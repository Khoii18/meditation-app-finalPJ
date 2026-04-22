import express from "express";
import { generatePaymentQR, handleSepayWebhook } from "../controllers/payment.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Route tạo mã QR để thanh toán (Cần đăng nhập)
router.post("/create-qr", verifyToken, generatePaymentQR);

// Route xử lý Webhook từ SePay (Public - SePay gọi tới)
router.post("/webhook", handleSepayWebhook);

export default router;
