import { useAppStore } from "@/store";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType, onlineUsers } =
    useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg bg-gray-400 border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
            {selectedChatType === "contact" ? (
              onlineUsers.includes(selectedChatData._id) ? (
                <span className=" flex items-center gap-1">
                  <span className=" h-3 w-3 bg-green-700 rounded-full"></span>
                  <span className="text-neutral-500">online</span>
                </span>
              ) : (
                <span className=" flex items-center gap-1">
                  <span className=" h-3 w-3 bg-red-700 rounded-full"></span>
                  <span className="text-neutral-500">offline</span>
                </span>
              )
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={closeChat}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
