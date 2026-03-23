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
  const abortControllerRef = useRef(null);
  const currentRequestIdRef = useRef(null);
  const cancelRequestedRef = useRef(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const textareaRef = useRef(null);

  const resetTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
  };

  const createRequestId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  };

  const textInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast("Login to send message");
      setLoading(true);
      cancelRequestedRef.current = false;
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const requestId = createRequestId();
      currentRequestIdRef.current = requestId;
      const promptCoppy = prompt;

      if (file) {
        const userContentParts = [`[Image] ${selectedFileName}`];
        if (prompt?.trim()) {
          userContentParts.push(prompt.trim());
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "User",
            content: userContentParts.join("\n"),
            timeStamp: Date.now(),
            isImage: false,
            requestId,
          },
        ]);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("chatId", selectedChat._id);
        formData.append("prompt", prompt);
        formData.append("requestId", requestId);

        const { data } = await axios.post(
          "/api/message/analyze-image",
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
            signal: controller.signal,
          },
        );

        if (data.success) {
          setMessages((prev) => [...prev, data.message]);
          fetchUser();
          setMode("text");
        } else {
          toast.error(data.message);
          setMessages((prev) => prev.slice(0, -1));
          setPrompt(promptCoppy);
        }
      } else {
        setPrompt("");
        setMessages((prev) => [
          ...prev,
          {
            role: "User",
            content: prompt,
            timeStamp: Date.now(),
            isImage: false,
            requestId,
          },
        ]);

        const { data } = await axios.post(
          `/api/message/${mode}`,
          { chatId: selectedChat._id, prompt, isPublished, requestId },
          {
            headers: { Authorization: token },
            signal: controller.signal,
          },
        );

        if (data.success) {
          setMessages((prev) => [...prev, data.message]);
          fetchUser();
        } else {
          toast.error(data.message);
          setPrompt(promptCoppy);
        }
      }
    } catch (error) {
      if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
        return;
      }
      toast.error(error.message);
    } finally {
      const wasCanceled = cancelRequestedRef.current;
      if (!wasCanceled) {
        setPrompt("");
      }
      setLoading(false);
      if (!wasCanceled) {
        fetchUser();
        setSelectedFileName("");
        setFile(null);
        resetTextareaHeight();
      }
      abortControllerRef.current = null;
      currentRequestIdRef.current = null;
      if (fileRef.current) {
        if (!wasCanceled) {
          fileRef.current.value = "";
        }
      }
    }
  };

  const handleCancel = async () => {
    cancelRequestedRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    const requestId = currentRequestIdRef.current;
    if (requestId && selectedChat?._id) {
      try {
        await axios.post(
          "/api/message/cancel",
          { chatId: selectedChat._id, requestId },
          { headers: { Authorization: token } },
        );
      } catch (error) {
        // Silent: cancel is best-effort
      }
    }
    setLoading(false);
  };

  const handleFileChange = async (e) => {
    try {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;

      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please select an image file only.");
        return;
      }

      setFile(selectedFile);
      setSelectedFileName(selectedFile.name);
      e.target.value = "";
    } catch (error) {
      toast.error(error.message);
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
          className="bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-2xl w-full max-w-2xl p-3 pl-4 mx-auto flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <select
              onChange={(e) => {
                setMode(e.target.value);
                setPrompt("");
                setFile(null);
                setSelectedFileName("");
                resetTextareaHeight();
                if (fileRef.current) {
                  fileRef.current.value = "";
                }
              }}
              value={mode}
              className="text-sm pl-3 pr-2 outline-none bg-transparent"
            >
              <option value="text" className="dark:bg-purple-900">
                Text
              </option>
              <option className="dark:bg-purple-900" value="image">
                Image
              </option>
            </select>

            <div className="flex-1" />

            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="relative text-2xl font-bold text-gray-600 dark:text-white cursor-pointer hover:text-primary dark:hover:text-purple-400 transition"
            >
              <img src={assets.gallery_icon} className="w-6 not-dark:invert" alt="" />
            </button>
            <button
              className=""
              type="submit"
              onClick={(e) => {
                if (loading) {
                  e.preventDefault();
                  handleCancel();
                }
              }}
            >
              <img
                src={loading ? assets.stop_icon : assets.send_icon}
                className="w-8 cursor-pointer"
                alt=""
              />
            </button>
          </div>

          {file && (
            <div className="flex items-center justify-between gap-3 bg-white/70 dark:bg-[#3a2a50]/60 border border-primary/40 dark:border-[#80609F]/40 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-gray-500 dark:text-gray-200">Image</span>
                <span className="text-xs font-medium text-gray-800 dark:text-white truncate">
                  {selectedFileName}
                </span>
              </div>
              <button
                type="button"
                aria-label="Remove selected image"
                onClick={() => {
                  setFile(null);
                  setSelectedFileName("");
                  setMode("text");
                  if (fileRef.current) {
                    fileRef.current.value = "";
                  }
                }}
                className="text-xs px-2 py-1 rounded-full bg-red-600 text-white hover:bg-red-500"
              >
                Remove
              </button>
            </div>
          )}

          <textarea
            rows={1}
            onChange={(e) => setPrompt(e.target.value)}
            onInput={textInput}
            ref={textareaRef}
            type="text"
            className="text-sm outline-none w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto min-h-[44px] max-h-40"
            value={prompt}
            required={!file}
            disabled={loading}
            placeholder={file ? "Type your message..." : "Type a message..."}
          />
          <input
            type="file"
            ref={fileRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*"
          />
        </form>
      </div>
    </>
  );
};

export default ChatBox;
