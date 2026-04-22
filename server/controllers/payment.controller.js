import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

/**
 * 1. Tạo QR thanh toán & Lưu vào DB (Pending)
 */
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

/**
 * 2. Xử lý Webhook từ SePay (Nâng cấp Gói cước thực tế)
 */
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

    // 1. Cập nhật trạng thái giao dịch
    transaction.status = "COMPLETED";
    transaction.sepayTransactionId = sepayId;
    transaction.transactionDate = new Date();
    await transaction.save();

    // 2. Tính toán thời hạn gói cước
    const now = new Date();
    let expiryDate = new Date();

    if (transaction.planId === "monthly") {
      expiryDate.setDate(now.getDate() + 30);
    } else if (transaction.planId === "annual") {
      expiryDate.setDate(now.getDate() + 365);
    } else if (transaction.planId === "lifetime") {
      expiryDate.setFullYear(now.getFullYear() + 99); // 99 năm coi như trọn đời
    }

    // 3. Cập nhật User
    await User.findByIdAndUpdate(transaction.userId, {
      $set: {
        "premiumStatus.isPremium": true,
        "premiumStatus.planType": transaction.planId,
        "premiumStatus.startDate": now,
        "premiumStatus.expiryDate": expiryDate
      }
    });

    console.log(`User ${transaction.userId} upgraded to ${transaction.planId} until ${expiryDate}`);

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
};