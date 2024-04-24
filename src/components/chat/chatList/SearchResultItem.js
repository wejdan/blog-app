// ChatItem.js
import React from "react";
import Avatar from "../../UI/Avatar";
import { formatLastMessageTimestamp } from "../../../utils/chat";
import { useSelector } from "react-redux";

const SearchResultItem = ({ msg, onClick }) => {
  const { chats, activeChat, foundMessage } = useSelector(
    (state) => state.chat
  );

  return (
    <div
      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 ${
        msg.id === foundMessage ? "bg-gray-600" : ""
      }`}
      onClick={() => {
        onClick(msg.chatId, msg._id, msg.page);
      }}
    >
      <div className="flex items-center">
        <div className="relative">
          <Avatar imageUrl={msg.sender.profileImg} size="8" />
        </div>
        <div className="flex-1 min-w-0 ml-4">
          <p className="text-sm font-semibold truncate">{msg.sender.name}</p>
          <p className="text-xs h-2">{msg.content}</p>
        </div>
      </div>
      <div>
        <p className="text-xs">{formatLastMessageTimestamp(msg.timestamp)}</p>
      </div>
    </div>
  );
};

export default SearchResultItem;
