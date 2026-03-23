import Chat from "../models/chat.js";
import User from "../models/user.js";
import ai from "../config/gerateText.js";
import axios from "axios";
import imagekit from "../config/imagekit.js";

// Text-based AI chat Message

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You have not enough credits to generate a response",
      });
    }
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push({
      role: "User",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a helpful assistant for answering user queries.",
      },
    });

    const replyText = response.candidates[0].content.parts[0].text;

    const reply = {
      role: "assistant",
      content: replyText,
      timeStamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    res.json({
      success: true,
      message: reply,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// API for image generation

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You have not enough credits to generate an image",
      });
    }

    const { prompt, chatId, isPublished } = req.body;
    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "User",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
    });

    // Encode the prompt

    const encodedPrompt = encodeURIComponent(prompt);

    // construct imgae generation URL

    const generatedUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/ai/${Date.now()}.png ? tr=w-800,h-400`;
    // Trigger genration of image by making a request to the generated URL

    const aiImageResponse = await axios.get(generatedUrl, {
      responseType: "arraybuffer",
    });
    // conver to base64
    const base64Image = Buffer.from(aiImageResponse.data, "binary").toString(
      "base64",
    );

    // upload to imagekit media libra

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `image-${Date.now()}.png`,
      folder: "aiProjectImages",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timeStamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    res.json({
      success: true,
      message: reply,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// Get all the published images

export const getPublishedImages = async (req, res) => {
  try {
    const publishedImagesMessages = await Chat.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.isPublished": true, "messages.isImage": true } },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
        },
      },
    ]);
    res.json({
      success: true,
      images: publishedImagesMessages.reverse(),
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};





// API for understanding the image

export const analyzeImageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "Not enough credits",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    if (!req.file) {
      return res.json({
        success: false,
        message: "No image uploaded",
      });
    }

    const userPrompt = (prompt || "").trim();
    const userMessageContentParts = [`[Image] ${req.file.originalname}`];
    if (userPrompt) {
      userMessageContentParts.push(userPrompt);
    }

    chat.messages.push({
      role: "User",
      content: userMessageContentParts.join("\n"),
      timeStamp: Date.now(),
      isImage: false,
    });

    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString("base64");

    // Send image to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: userPrompt || "Analyze this image and explain it in detail.",
            },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const result = response.candidates[0].content.parts[0].text;

    const reply = {
      role: "assistant",
      content: result,
      timeStamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    res.json({
      success: true,
      message: reply,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
