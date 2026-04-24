import express from "express";
import { generatePaymentQR, handleSepayWebhook, getAllTransactions, resolveTransaction, simulatePayment, rejectTransaction, deleteTransaction } from "../controllers/payment.controller.js";
import { verifyToken, verifyAdminOrCoach } from "../middleware/auth.js";

const router = express.Router();

// Route tạo mã QR để thanh toán (Cần đăng nhập)
router.post("/create-qr", verifyToken, generatePaymentQR);

// Route xử lý Webhook từ SePay (Public - SePay gọi tới)
router.post("/webhook", handleSepayWebhook);

// Route giả lập thanh toán thành công (dành cho môi trường dev/local)
router.post("/simulate-payment", simulatePayment);

// Routes quản lý cho Admin
router.get("/transactions", verifyAdminOrCoach, getAllTransactions);
router.post("/transactions/resolve", verifyAdminOrCoach, resolveTransaction);
router.post("/transactions/reject", verifyAdminOrCoach, rejectTransaction);
router.delete("/transactions/:id", verifyAdminOrCoach, deleteTransaction);

export default router;
