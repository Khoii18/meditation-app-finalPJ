import express from "express";
import { generatePaymentQR, handleSepayWebhook, getAllTransactions, resolveTransaction, simulatePayment, rejectTransaction, deleteTransaction } from "../controllers/payment.controller.js";
import { verifyToken, verifyAdminOrCoach } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-qr", verifyToken, generatePaymentQR);

router.post("/webhook", handleSepayWebhook);

router.post("/simulate-payment", simulatePayment);

router.get("/transactions", verifyAdminOrCoach, getAllTransactions);
router.post("/transactions/resolve", verifyAdminOrCoach, resolveTransaction);
router.post("/transactions/reject", verifyAdminOrCoach, rejectTransaction);
router.delete("/transactions/:id", verifyAdminOrCoach, deleteTransaction);

export default router;
