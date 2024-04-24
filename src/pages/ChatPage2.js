import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useSelector } from "react-redux";
import {
  sendMessage as sendMessageAction,
  selectActiveChatMessages,
} from "../store/chatSlice";
import useSocket from "../hooks/chat/useSocket";

import CustomModal from "../components/UI/CustomModal";
import CreateGroupForm from "../components/chat/messages/CreateGroupForm";

import ChatList from "../components/chat/chatList/ChatList";
import MessagesContainer from "../components/chat/messages/MessagesContainer";
import { useSocketContext } from "../context/SocketContext";

const ChatPage = () => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const { createGroup } = useSocketContext();

  const onCreateGroup = () => {
    setShowCreateGroup(true);
  };
  return (
    <>
      <div className="flex flex-grow bg-gray-900 text-white">
        {/* Chat List */}
        <ChatList onCreateGroup={onCreateGroup} />

        {/* Chat Messages */}
        <MessagesContainer />
      </div>
      <CustomModal
        onConfirm={async () => {}}
        // isLoading={deleteUserMutation.isPending}
        isOpen={showCreateGroup}
        onRequestClose={() => {
          setShowCreateGroup(false);
        }}
      >
        <CreateGroupForm
          onSubmit={(data) => {
            createGroup(data);
            setShowCreateGroup(false);
          }}
        />
      </CustomModal>
    </>
  );
};

export default ChatPage;
