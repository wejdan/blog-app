import React, { useLayoutEffect } from "react";
import MessagesList from "./MessagesList";
import MessageInput from "../MessageInput";
import { useSelector } from "react-redux";
import InfiniteScrollChat from "./InfiniteScrollChat2";
import { useSocketContext } from "../../../context/SocketContext";
import { selectActiveChatMessages } from "../../../store/chatSlice";
import Loader from "../../UI/Loader";
import ChatHeader from "./ChatHeader";
import { getFirstMessageOfCurrentPage } from "../../../utils/chat";

function MessagesContainer() {
  const { chats, activeChat, foundMessage } = useSelector(
    (state) => state.chat
  );
  const { loadMoreMessages, loadPrevMessages } = useSocketContext();
  const { userData } = useSelector((state) => state.auth);

  const currentChat = chats[activeChat];
  console.log("currentChat", currentChat);
  return (
    <div className="flex-1 flex flex-col h-[100vh]">
      {/* Add chat header here */}
      <ChatHeader chat={currentChat} />
      {currentChat?.messages && !currentChat.loading ? (
        <InfiniteScrollChat
          key={activeChat}
          messages={currentChat.messages}
          hasNextPage={currentChat.pageInfo?.hasNextPage}
          loadMoreMessages={loadMoreMessages}
          loadPrevMessages={loadPrevMessages}
          scrollTo={foundMessage || currentChat.firstUnreadMessageId}
        />
      ) : (
        <div className="flex flex-col h-screen overflow-auto">
          {currentChat?.loading && (
            <div className=" flex-grow flex flex-col items-center justify-center ">
              <Loader />
            </div>
          )}
        </div>
      )}

      {/* <MessagesList key={activeChat} /> */}
      <MessageInput />
    </div>
  );
}

export default MessagesContainer;
