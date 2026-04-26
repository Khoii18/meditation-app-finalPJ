import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, isAdminChat } = req.body;
    const senderId = req.user.id;

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      isAdminChat
    });

    // Auto-reply logic for Admin
    if (isAdminChat) {
      setTimeout(async () => {
        await Message.create({
          senderId: receiverId, // Admin ID
          receiverId: senderId,
          content: "Xin chào! Đây là tin nhắn tự động từ hệ thống Lunaria. Chúng tôi đã tiếp nhận yêu cầu của bạn về vấn đề tài khoản/thanh toán. Một nhân viên hỗ trợ sẽ phản hồi bạn sớm nhất có thể. Cảm ơn bạn đã kiên nhẫn!",
          isAdminChat: true,
          autoReplied: true
        });
      }, 2000);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    const message = await Message.create({
      senderId,
      receiverId,
      content
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminMessages = async (req, res) => {
  try {
    const messages = await Message.find({ isAdminChat: true }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
