import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

export const generatePaymentQR = async (req, res) => {
  try {
    const { amount, planId, description } = req.body;
    const userId = req.user.id;
    
    const bankAccount = process.env.SEPAY_RECEIVE_ACCOUNT;
    const bankId = process.env.SEPAY_PAYMENT_BANK_ID;

    if (!bankAccount || !bankId) {
      return res.status(500).json({ message: "Bank configuration missing." });
    }

    const transactionCode = `OASIS${Math.floor(100000 + Math.random() * 900000)}`;

    const newTransaction = new Transaction({
      userId,
      amount,
      planId,
      content: transactionCode,
      status: "PENDING"
    });
    await newTransaction.save();

    const qrDataURL = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankId}&amount=${amount}&des=${encodeURIComponent(transactionCode)}`;

    res.status(200).json({
      success: true,
      data: {
        qrDataURL,
        amount,
        content: transactionCode,
        bankAccount,
        bankId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleSepayWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const { content, transferAmount, id: sepayId } = payload;

    if (!content) return res.status(400).send("Missing content");

    const transactionCodeMatch = content.match(/OASIS\d+/);
    if (!transactionCodeMatch) return res.status(200).send("Pattern not found");

    const transactionCode = transactionCodeMatch[0];

    const transaction = await Transaction.findOne({ 
      content: transactionCode, 
      status: "PENDING" 
    });

    if (!transaction) return res.status(200).send("Transaction not found");

    transaction.status = "COMPLETED";
    transaction.sepayTransactionId = sepayId;
    transaction.transactionDate = new Date();
    await transaction.save();

    const subscriptionPlans = ["monthly", "annual", "lifetime"];
    
    if (subscriptionPlans.includes(transaction.planId)) {
      const now = new Date();
      let expiryDate = new Date();

      if (transaction.planId === "monthly") {
        expiryDate.setDate(now.getDate() + 30);
      } else if (transaction.planId === "annual") {
        expiryDate.setDate(now.getDate() + 365);
      } else if (transaction.planId === "lifetime") {
        expiryDate.setFullYear(now.getFullYear() + 99);
      }

      await User.findByIdAndUpdate(transaction.userId, {
        $set: {
          "premiumStatus.isPremium": true,
          "premiumStatus.planType": transaction.planId,
          "premiumStatus.startDate": now,
          "premiumStatus.expiryDate": expiryDate
        }
      });
      console.log(`User ${transaction.userId} upgraded to ${transaction.planId}`);
    } else {
      await User.findByIdAndUpdate(transaction.userId, {
        $addToSet: { purchasedPackages: transaction.planId }
      });
      console.log(`User ${transaction.userId} purchased coach package: ${transaction.planId}`);
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const simulatePayment = async (req, res) => {
  try {
    const { transactionCode } = req.body;
    
    const transaction = await Transaction.findOne({ 
      content: transactionCode, 
      status: "PENDING" 
    });

    if (!transaction) return res.status(404).json({ message: "Transaction not found or already completed." });

    transaction.status = "COMPLETED";
    transaction.sepayTransactionId = `MOCK_${Date.now()}`;
    transaction.transactionDate = new Date();
    await transaction.save();

    const subscriptionPlans = ["monthly", "annual", "lifetime"];
    if (subscriptionPlans.includes(transaction.planId)) {
      const now = new Date();
      let expiryDate = new Date();
      if (transaction.planId === "monthly") expiryDate.setDate(now.getDate() + 30);
      else if (transaction.planId === "annual") expiryDate.setDate(now.getDate() + 365);
      else if (transaction.planId === "lifetime") expiryDate.setFullYear(now.getFullYear() + 99);

      await User.findByIdAndUpdate(transaction.userId, {
        $set: {
          "premiumStatus.isPremium": true,
          "premiumStatus.planType": transaction.planId,
          "premiumStatus.startDate": now,
          "premiumStatus.expiryDate": expiryDate
        }
      });
    } else {
      await User.findByIdAndUpdate(transaction.userId, {
        $addToSet: { purchasedPackages: transaction.planId }
      });
    }

    res.json({ success: true, message: "Payment simulated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveTransaction = async (req, res) => {
  try {
    const { transactionId, planId } = req.body;
    
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    transaction.status = "COMPLETED";
    transaction.planId = planId;
    transaction.transactionDate = new Date();
    await transaction.save();

    const now = new Date();
    let expiryDate = new Date();
    if (planId === "monthly") {
      expiryDate.setDate(now.getDate() + 30);
    } else if (planId === "annual") {
      expiryDate.setDate(now.getDate() + 365);
    } else if (planId === "lifetime") {
      expiryDate.setFullYear(now.getFullYear() + 99);
    }

    await User.findByIdAndUpdate(transaction.userId, {
      $set: {
        "premiumStatus.isPremium": true,
        "premiumStatus.planType": planId,
        "premiumStatus.startDate": now,
        "premiumStatus.expiryDate": expiryDate
      }
    });

    res.json({ success: true, message: "Transaction manually resolved and User updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json("Transaction not found");

    transaction.status = "FAILED";
    await transaction.save();

    await User.findByIdAndUpdate(transaction.userId, {
      $set: {
        "premiumStatus.isPremium": false,
        "premiumStatus.planType": "none",
        "premiumStatus.expiryDate": new Date(0)
      }
    });

    res.json({ success: true, message: "Transaction rejected and access revoked." });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Transaction record deleted." });
  } catch (error) {
    res.status(500).json(error.message);
  }
};