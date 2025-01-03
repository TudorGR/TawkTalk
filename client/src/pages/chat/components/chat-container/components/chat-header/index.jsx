import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { IoIosArrowRoundBack } from "react-icons/io";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType, onlineUsers } =
    useAppStore();

  return (
    <div className="h-[80px] border border-l-0 border-r-0 border-t-0 border-b-1 border-gray-200 flex items-center justify-between px-8">
      <div className="flex gap-5 items-center w-full justify-start">
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={closeChat}
            className="text-neutral-500 focus:border-none"
          >
            <IoIosArrowRoundBack className="text-3xl text-black" />
          </button>
        </div>
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative flex items-center justify-center">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <AvatarImage
                    src={"src/assets/empty.jpg"}
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-12 w-12 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>
          <div className="flex flex-col text-black">
            {selectedChatType === "channel" && (
              <>
                <span>{selectedChatData.name}</span>
                <span className="text-sm text-white/40">
                  {selectedChatData.members.length + 1} members
                </span>
              </>
            )}
            {selectedChatType === "contact" && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
            {selectedChatType === "contact" ? (
              onlineUsers.includes(selectedChatData._id) ? (
                <span className=" flex items-center gap-1">
                  <span className=" h-3 w-3 bg-green-500 rounded-full"></span>
                  <span className="text-black/30 text-sm">online</span>
                </span>
              ) : (
                <span className=" flex items-center gap-1">
                  <span className=" h-3 w-3 bg-red-700 rounded-full"></span>
                  <span className="text-black/30 text-sm">offline</span>
                </span>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
