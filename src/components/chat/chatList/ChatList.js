import React from "react";
import ChatListHeader from "./ChatListHeader";
import ChatListItems from "./ChatListItems";
import { useSelector } from "react-redux";
import SearchResultsList from "./SearchResultsList";

function ChatList({ onCreateGroup }) {
  const { searchTerm } = useSelector((state) => state.chat);

  return (
    <div className="w-1/3 border-r border-gray-700">
      <ChatListHeader onCreateGroup={onCreateGroup} />
      {searchTerm ? <SearchResultsList /> : <ChatListItems />}
    </div>
  );
}

export default ChatList;
