// API controller for chat-related operations

import Chat from "../models/chat.js";

// create new chat for user

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };

    await Chat.create(chatData);
    res.json({
      success: true,
      message: "Chat created successfully",
      
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      data: {},
    });
  }
};

// API controller for fetching all chats of a user

export const getChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.json({
      success: true,
      message: "Chats",
      chats ,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      data: {},
    });
  }
};

// API for deleting chat

export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const { chatId } = req.body;

    await Chat.deleteOne({ _id: chatId, userId });
    res.json({
      success: true,
      message: "Chat deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      data: {},
    });
  }
};
