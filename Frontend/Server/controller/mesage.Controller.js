import Chat from "../models/chat.js";
import User from "../models/user.js";
import ai from "../config/gerateText.js";
import axios from "axios";
import imagekit from "../config/imagekit.js";
import { extractPdfText } from "./extendToText.Controller.js";

// Text-based AI chat Message

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.json({
        sucess: false,
        message: "You have not enough credits to generate a response",
      });
    }
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.status(404).json({
        sucess: false,
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
      model: "gemini-3-flash-preview",
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
    res.json({
      sucess: true,
      message: reply,
    });

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    res.json({
      sucess: false,
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
      role: "assistnat",
      content: uploadResponse.url,
      timeStamp: Date.now(),
      isImage: true,
      isPublished,
    };

    res.json({
      success: true,
      message: reply,
    });
    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
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

// API for generations notes by uploading documnets

export const generateNotesController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 5) {
      return res.json({
        success: false,
        message: "Not enough credits to generate notes",
      });
    }

    const { chatId } = req.body;

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
        message: "No document uploaded",
      });
    }

    // Extract text from the uploaded document using pdfjs

    const documentText = await extractPdfText(req.file.buffer);

    // Send to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate detailed exam notes from this document:\n\n${documentText}`,
      config: {
        systemInstruction: `
        You are an expert academic notes generator.

        You are an expert academic assistant, researcher, and teacher.

        Your task is to carefully analyze the uploaded document and transform it into structured, easy-to-understand study material suitable for students preparing for exams.

        Strict Instructions:

      1. Read the entire document carefully before generating the response.
      2. Extract the most important information such as concepts, explanations, definitions, examples, and key ideas.
      3. Rewrite the content in simple and clear language suitable for students.
      4. Do not copy sentences directly from the document. Summarize and rephrase them.
      5. Organize the content into logical sections with headings and subheadings.
      6. Use bullet points for clarity.
      7. Highlight important terms using **bold formatting**.
      8. If the document contains multiple topics, create separate sections for each topic.
      9. Ensure the notes are detailed but concise.
      10. Focus on concepts important for exams.

      Your output MUST follow this structure:

      # Document Title

      ## Overview
      Provide a short explanation of the overall topic.

      ## Key Concepts
      List the main ideas in bullet points.

      ## Detailed Notes

      ### Topic 1
      Explain the concept clearly using bullet points and short paragraphs.

      ### Topic 2
      Explain the concept clearly using bullet points and short paragraphs.

      (continue for all topics found in the document)

      ## Important Definitions
      List important terms and their definitions.

      - Term — definition
      - Term — definition

      ## Important Points for Exams
      Provide key takeaways students should remember for exams.

      - point
      - point
      - point

      ## Flashcards (For Revision)

      Q: Question  
      A: Answer  

      Q: Question  
      A: Answer  

      (Generate at least 5 flashcards)

      ## Multiple Choice Questions

      Generate 5 MCQs from the document.

      Question 1:
      A.
      B.
      C.
      D.

      Correct Answer:

      Question 2:
      A.
      B.
      C.
      D.

      Correct Answer:

      ## Summary

      Provide a concise summary of the entire document in 5-10 bullet points.
      `,
      },
    });

    const notes = response.candidates[0].content.parts[0].text;

    const reply = {
      role: "assistant",
      content: notes,
      timeStamp: Date.now(),
      isImage: false,
      isNotes: true,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -3 } });

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

    const { chatId } = req.body;

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

    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString("base64");

    // Send image to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: "Analyze this image and explain it in detail." },
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

    const result = response.text;

    const reply = {
      role: "assistant",
      content: result,
      timeStamp: Date.now(),
      isImage: true,
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
