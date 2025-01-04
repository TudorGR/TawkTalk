import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES_ROUTE,
  HOST,
} from "@/utils/constants.js";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { AvatarFallback } from "@/components/ui/avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { FaRegFile } from "react-icons/fa";
import emptyImage from "@/assets/empty.jpg";
import useDetectKeyboardOpen from "use-detect-keyboard-open";

const MessageContainer = () => {
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();
  const scrollRef = useRef();
  const scrollRef2 = useRef();
  const isKeyboardOpen = useDetectKeyboardOpen();
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getChannelMessages = async () => {
      try {
        const res = await apiClient.get(
          `${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (isKeyboardOpen) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isKeyboardOpen]);

  useEffect(() => {
    if (
      scrollRef.current &&
      selectedChatMessages.length === scrollRef2.current + 1
    ) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollRef.current.scrollIntoView();
    }

    scrollRef2.current = selectedChatMessages.length;
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-black/40 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const res = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderDMMessages = (message) => (
    <div
      className={` ${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-blue-600 text-white"
              : "bg-white text-black border-1 border-gray-200"
          } border inline-block px-4 py-2 rounded-2xl  my-1 max-w-[90%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? ` text-black ${
                  checkIfImage(message.fileUrl)
                    ? "bg-white/0 border-none transform translate-x-8 py-0"
                    : "bg-blue-600 text-white"
                }`
              : `bg-white border-1 border-gray-200 text-black border-[#ffffff]/20 ${
                  checkIfImage(message.fileUrl)
                    ? "bg-white/0 border-none py-0"
                    : "bg-white text-black"
                }`
          } border inline-block px-4 py-2 rounded-2xl my-1 max-w-[90%] break-words `}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${message.fileUrl}`}
                height={300}
                width={300}
                className="rounded-2xl ml-[-16px]"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                onClick={() => downloadFile(message.fileUrl)}
                className="bg-black/10 p-3 text-2xl rounded-full hover:bg-black/20 cursor-pointer transition-all duration-300"
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-black/40">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessages = (message) => {
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-blue-600 text-white "
                : "bg-white text-black"
            } border inline-block px-4 py-2 rounded-2xl my-1 max-w-[90%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? `bg-blue-600 text-white ${
                    checkIfImage(message.fileUrl)
                      ? "transform translate-x-8 py-0 bg-white/0 border-none"
                      : ""
                  }`
                : `bg-white text-black border-gray-200 ${
                    checkIfImage(message.fileUrl) ? "border-none py-0" : ""
                  }`
            } border inline-block px-4 py-2 rounded-2xl my-1 max-w-[90%] break-words ml-9`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${message.fileUrl}`}
                  height={300}
                  width={300}
                  className="rounded-2xl ml-[-16px]"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image ? (
                <AvatarImage
                  src={`https://tawktalk.onrender.com/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <AvatarImage
                  src={emptyImage}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg bg-gray-400 flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-black">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-xs text-gray-400">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-black mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pt-24 pb-48 md:pb-6 md:pt-6 flex-1 overflow-y-auto no-scrollbar p-6  w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="transition-all duration-300 fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg">
          <div>
            <img
              src={`https://tawktalk.onrender.com/${imageURL}`}
              className="h-[80vh] w-full object-contain"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              onClick={() => downloadFile(imageURL)}
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
