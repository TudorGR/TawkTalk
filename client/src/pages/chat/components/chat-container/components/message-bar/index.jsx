import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import { RiAttachment2 } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { toast } from "sonner";

const MessageBar = () => {
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const fileInputRef = useRef();
  const socket = useSocket();
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (message.length > 0) {
      if (selectedChatType === "contact") {
        socket.emit("sendMessage", {
          sender: userInfo.id,
          content: message,
          recipient: selectedChatData._id,
          messageType: "text",
          fileUrl: undefined,
        });
      } else if (selectedChatType === "channel") {
        socket.emit("send-channel-message", {
          sender: userInfo.id,
          content: message,
          messageType: "text",
          fileUrl: undefined,
          channelId: selectedChatData._id,
        });
      }
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleAttachmentChange = async (event) => {
    const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

    try {
      const file = event.target.files[0];
      if (file) {
        if (file.size > FILE_SIZE_LIMIT) {
          toast("File size exceeds the 5 MB limit.");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });
        setIsUploading(false);

        if (res.status === 200 && res.data) {
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: res.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  return (
    <div className="border border-t-1 border-l-0 border-r-0 border-b-0 border-gray-200 h-[80px] flex justify-center items-center px-[3vh] gap-4">
      <div className="flex-1 flex bg-gray-100 rounded-full items-center gap-5 px-3">
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="text-neutral-500 border-none outline-none focus:text-white transition-all duration-300"
          >
            <MdOutlineEmojiEmotions className="text-3xl" />
          </button>
          <div className="absolute bottom-16 left-0" ref={emojiRef}>
            <EmojiPicker
              theme="light"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
        <input
          type="text"
          className=" text-black flex-1 py-4 bg-transparent rounded-md focus:border-none focus:outline-none w-full"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 border-none outline-none focus:text-white duration-300 transition-all"
        >
          <RiAttachment2 className="text-3xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
      </div>
      <button
        className="bg-blue-600 rounded-full flex items-center justify-center p-4 border-none hover:bg-blue-600/80 focus:bg-blue-600/80 outline-none duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl text-white" />
      </button>
    </div>
  );
};

export default MessageBar;
