import React, { useEffect, useRef, useState } from "react";
import { useAppContenxt } from "../context/AppContenxt";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";

const ChatBox = () => {
  const { selectedChat, theme, user, axios, token, setUser, fetchUser } =
    useAppContenxt();
  const containerRef = useRef(null);
  const fileRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast("Login to send message");
      setLoading(true);
      const promptCoppy = prompt;
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        {
          role: "User",
          content: prompt,
          timeStamp: Date.now(),
          isImage: false,
        },
      ]);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: selectedChat._id, prompt, isPublished },
        {
          headers: { Authorization: token },
        },
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        fetchUser();
      } else {
        toast.error(data.message);
        setPrompt(promptCoppy);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPrompt("");
      setLoading(false);
      fetchUser();
    }
  };

  const handleFileChange = async (e) => {
    try {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;

      setLoading(true);

      let selectedMode = "";

      if (selectedFile.type.startsWith("image/")) {
        selectedMode = "analyze-image";
      } else {
        selectedMode = "notes-gen";
      }

      setMode(selectedMode);
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name);
      setPrompt("");

      // Add user message with file info
      setMessages((prev) => [
        ...prev,
        {
          role: "User",
          content: `[${selectedMode === "analyze-image" ? "Image" : "Document"}] ${selectedFile.name}`,
          timeStamp: Date.now(),
          isImage: false,
        },
      ]);

      const formData = new FormData();

      if (selectedMode === "analyze-image") {
        formData.append("image", selectedFile);
      } else {
        formData.append("document", selectedFile);
      }

      formData.append("chatId", selectedChat._id);

      const { data } = await axios.post(
        `/api/message/${selectedMode}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        fetchUser();
        setMode("text");
      } else {
        toast.error(data.message);
        // Remove user message if failed
        setMessages((prev) => prev.slice(0, -1));
        setMode("text");
      }
    } catch (error) {
      toast.error(error.message);
      // Remove user message if failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setSelectedFileName("");
      setFile(null);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      // Create new array to ensure React detects the change
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <>
      <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
        <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
          {messages.length === 0 && (
            <div className="h-full flex-col flex items-center justify-center gap-2 text-primary">
              {/* <img
                src={theme === "dark" ? assets.logo_full_dark_g: assets.pageLogo}
                alt=""
                className="w-full max-w-56 sm:max-w-68"
              /> */}
              <p className="text-violet-700 text-4xl dark:text-blue-700">
                MirrorChat
              </p>
              <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
                Ask me anything
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}

          {/* Three dot loading animation */}
          {loading && (
            <div className="loading flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            </div>
          )}
        </div>
        {mode == "image" && (
          <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
            <p className="text-xs">Publish Image to community</p>
            <input
              type="checkbox"
              className="cursor-poin"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
          </label>
        )}

        {/* input  */}
        <form
          onSubmit={onSubmit}
          className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
        >
          <select
            onChange={(e) => {
              setMode(e.target.value);
              setPrompt("");
              setFile(null);
            }}
            value={mode}
            className="text-sm pl-3 pr-2 outline-none"
          >
            <option value="text" className="dark:bg-purple-900">
              Text
            </option>
            <option className="dark:bg-purple-900" value="image">
              Image
            </option>
          </select>
          <input
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            className="flex-1 w-full text-sm outline-none"
            value={prompt}
            required={!file}
            disabled={file}
          />
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="text-2xl font-bold text-gray-600 dark:text-white cursor-pointer hover:text-primary dark:hover:text-purple-400 transition"
          >
            +
          </button>
          <button className="" disabled={loading}>
            <img
              src={loading ? assets.stop_icon : assets.send_icon}
              className="w-8 cursor-pointer"
              alt=""
            />
          </button>
          <input
            type="file"
            ref={fileRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*,.pdf,.doc,.docx,.txt" // Allow images and documents
          />
        </form>
      </div>
    </>
  );
};

export default ChatBox;
