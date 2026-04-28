import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const cleanupOldConversations = async () => {
  try {
    // Increase to 60 minutes to avoid premature deletion during testing/timezone issues
    const threshold = new Date(Date.now() - 60 * 60 * 1000);
    
    // Find all support messages (both explicit support and potential ones)
    const messages = await Message.find({
      $or: [{ isAdminChat: true }, { autoReplied: true }]
    }).sort({ createdAt: -1 });

    const processedPairs = new Set();
    const conversationsToDelete = [];

    for (const msg of messages) {
      const sId = (msg.senderId?._id || msg.senderId).toString();
      const rId = (msg.receiverId?._id || msg.receiverId).toString();
      const pairId = [sId, rId].sort().join("-");
      
      if (processedPairs.has(pairId)) continue;
      processedPairs.add(pairId);

      // Only delete if the ABSOLUTE LATEST message in the thread is older than the threshold
      if (msg.createdAt < threshold) {
        conversationsToDelete.push({ u1: sId, u2: rId });
      }
    }

    for (const pair of conversationsToDelete) {
      await Message.deleteMany({
        $or: [
          { senderId: pair.u1, receiverId: pair.u2 },
          { senderId: pair.u2, receiverId: pair.u1 }
        ]
      });
      console.log(`[CLEANUP] Deleted inactive support thread: ${pair.u1} <-> ${pair.u2}`);
    }
  } catch (error) {
    console.error("[CLEANUP ERROR]:", error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    await cleanupOldConversations();
    const { receiverId, content, isAdminChat } = req.body;
    const senderId = req.user.id;

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      isAdminChat
    });

    if (isAdminChat) {
      setTimeout(async () => {
        await Message.create({
          senderId: receiverId,
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
    await cleanupOldConversations();
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .populate("senderId", "name email avatar")
    .populate("receiverId", "name email avatar")
    .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyMessage = async (req, res) => {
  try {
    await cleanupOldConversations();
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    console.log(`[REPLY] From ${senderId} to ${receiverId}: ${content} (FORCING isAdminChat: true)`);

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      isAdminChat: true 
    });
    
    // Return populated message
    const populated = await Message.findById(message._id)
      .populate("senderId", "name email avatar")
      .populate("receiverId", "name email avatar");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminMessages = async (req, res) => {
  try {
    await cleanupOldConversations();
    // We remove the { isAdminChat: true } filter temporarily to recover "lost" messages
    const messages = await Message.find()
      .populate("senderId", "name email avatar")
      .populate("receiverId", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId, content } = req.body;
    const userId = req.user.id;

    const message = await Message.findOne({ _id: messageId, senderId: userId });
    if (!message) return res.status(404).json("Message not found or not authorized");

    message.content = content;
    message.isEdited = true;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
