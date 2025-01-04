import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants.js";
import emptyImage from "@/assets/empty.jpg";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
    onlineUsers,
  } = useAppStore();
  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-neutral-100 hover:bg-neutral-50"
              : "hover:bg-neutral-50"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <div className="relative">
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`https://tawktalk.onrender.com/${contact.image}`}
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
                </Avatar>
                {onlineUsers.includes(contact._id) && (
                  <span className=" absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-1 border-white"></span>
                )}
              </div>
            )}
            {isChannel && (
              <div className="bg-black/20 text-white h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            <div className="flex flex-col text-black">
              {isChannel ? (
                <span>{contact.name}</span>
              ) : (
                <span>
                  {contact.firstName
                    ? `${contact.firstName} ${contact.lastName}`
                    : contact.email}
                </span>
              )}
              <span className="text-sm text-gray-500">
                {contact.latestMessage}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
