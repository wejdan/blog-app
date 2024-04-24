// ChatItem.js
import React from "react";
import Avatar from "../../UI/Avatar";

const PrivateChatItem = ({
  chatnfo,
  isActive,
  onClick,
  isOnline,
  unreadMessageCount,
  typing,
}) => {
  return (
    <div
      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 ${
        isActive ? "bg-gray-600" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="relative">
          <Avatar imageUrl={chatnfo.profileImg} size="8" />
          {isOnline && (
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" />
          )}
        </div>
        <div className="flex-1 min-w-0 ml-4">
          <p className="text-sm font-semibold truncate">{chatnfo.name}</p>
          <p className="text-xs h-2">
            {typing ? "typing ..." : chatnfo.lastMessage}
          </p>
        </div>
      </div>
      <div>
        <p className="text-xs">{chatnfo.lastMessageTime}</p>
        {unreadMessageCount > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-500 rounded-full">
            {unreadMessageCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default PrivateChatItem;
