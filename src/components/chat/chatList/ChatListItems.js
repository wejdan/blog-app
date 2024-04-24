// ChatListItems.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAvailableUsers,
  selectSortedConversations,
  setActiveChat,
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

const ChatListItems = () => {
  const dispatch = useDispatch();
  const { editGroup, updateGroupImg, getChatInfo, requsetMessges } =
    useSocketContext();

  const { user } = useSelector((state) => state.auth);
  const sortedConversations = useSelector(selectSortedConversations);
  const availableUsers = useSelector(selectAvailableUsers);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { loadMoreMessages, markMessageAsRead } = useSocketContext();

  const { activeChat, chats, onlineUsers } = useSelector((state) => state.chat);
  const handleChatClick = (chatId) => {
    dispatch(setActiveChat(chatId));
    // getChatInfo(chatId);
    console.log("1.handleChatClick");
    if (!chats[chatId].pageInfo) {
      requsetMessges(chatId, 1, () => {
        dispatch(setLoadingChatMessges({ chatId, loading: false }));
        //  markMessageAsRead(chatId);
      });
    }
  };

  const handleUserClick = (selectedUser) => {
    dispatch(setSelectTarget(selectedUser));
    dispatch(setActiveChat(`temp-chat-${selectedUser._id}`));
  };

  const handleOnclickGroupInfo = (groupId) => {
    setSelectedGroup(groupId);
  };
  return (
    <>
      <div className="overflow-y-auto">
        {sortedConversations.map((chat) => {
          const chatnfo = getChatData(chat, user); // Assuming `user` is the current user object with an `_id` property.

          const isGroup = chat.conversationInfo.isGroup;
          if (!isGroup) {
            return (
              <PrivateChatItem
                key={chat.chatId}
                chatnfo={chatnfo}
                isActive={activeChat === chat.chatId}
                onClick={() => handleChatClick(chat.chatId)}
                isOnline={onlineUsers.includes(chatnfo._id)}
                unreadMessageCount={chat.unreadCount}
                typing={chatnfo.typing}
              />
            );
          } else {
            return (
              <GroupChatItem
                key={chat.chatId}
                chat={chatnfo}
                isActive={activeChat === chat.chatId}
                onClick={() => handleChatClick(chat.chatId)}
                unreadMessageCount={chat.unreadCount}
                onClickGroupInfo={handleOnclickGroupInfo}
                typing={chatnfo.typingStatus}
              />
            );
          }
        })}
        {availableUsers.map((user) => (
          <UserItem
            key={user._id}
            user={user}
            isActive={activeChat === `temp-chat-${user._id}`}
            onClick={() => handleUserClick(user)}
            isOnline={onlineUsers.includes(user._id)}
          />
        ))}
      </div>
      <CustomModal
        onConfirm={async () => {}}
        // isLoading={deleteUserMutation.isPending}
        isOpen={selectedGroup !== null}
        onRequestClose={() => {
          setSelectedGroup(null);
        }}
      >
        <EditGroupForm
          onSubmit={(data) => {
            editGroup(data);
            setSelectedGroup(null);
          }}
          groupId={selectedGroup}
          onImgUpdate={updateGroupImg}
        />
      </CustomModal>
    </>
  );
};

export default ChatListItems;
