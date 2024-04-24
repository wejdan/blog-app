// ChatListItems.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAvailableUsers,
  selectSortedConversations,
  setActiveChat,
  setFoundMessge,
  setLoadingChatMessges,
  setSelectTarget,
} from "../../../store/chatSlice";
import UserItem from "./UserItem";
import PrivateChatItem from "./PrivateChatItem";
import GroupChatItem from "./GroupChatItem";
import CustomModal from "../../UI/CustomModal";
import EditGroupForm from "../messages/EditGroupForm";
import { useSocketContext } from "../../../context/SocketContext";
import { getChatData } from "../../../utils/chat";
import SearchResultItem from "./SearchResultItem";

const SearchResultsList = () => {
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.chat);

  const {
    editGroup,
    updateGroupImg,
    fetchSurroundingMessages,
    requsetMessges,
  } = useSocketContext();

  const { user } = useSelector((state) => state.auth);
  const sortedConversations = useSelector(selectSortedConversations);
  const availableUsers = useSelector(selectAvailableUsers);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { activeChat, chats, onlineUsers } = useSelector((state) => state.chat);
  const handleChatClick = (chatId, msgId, page) => {
    dispatch(setActiveChat(chatId));
    dispatch(setFoundMessge(msgId));

    // getChatInfo(chatId);
    // fetchSurroundingMessages(msgId);
    requsetMessges(chatId, page, () => {
      dispatch(setLoadingChatMessges({ chatId, loading: false }));
      //  markMessageAsRead(chatId);
    });
  };

  return (
    <div className="overflow-y-auto max-h-[90vh]">
      {searchResults?.messages?.map((messge) => {
        return (
          <SearchResultItem
            key={messge._id}
            onClick={handleChatClick}
            msg={messge}
          />
        );
      })}
    </div>
  );
};

export default SearchResultsList;
