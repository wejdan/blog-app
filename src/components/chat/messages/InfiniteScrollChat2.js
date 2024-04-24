import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { formatDate } from "../../../utils/date";
import ChatMessage from "./ChatMessage";
import SystemNotification from "./SystemNotification";
import Loader from "../../UI/Loader";
import { useSelector } from "react-redux";
import { selectActiveChatMessages } from "../../../store/chatSlice";
import { useSocketContext } from "../../../context/SocketContext";
import { useImageLoad } from "../../../hooks/scroll/useImageLoad";
import { useScroll } from "../../../hooks/scroll/useScroll";
import { useMessageTrackingAndVisibility } from "../../../hooks/scroll/useMessageTrackingAndVisibility";

function InfiniteScrollChat({
  messages,
  loadMoreMessages,
  hasNextPage,
  loadPrevMessages,
  scrollTo,
}) {
  const { totalImages, loadedImages, handleImageLoaded, isInitialLoaded } =
    useImageLoad(messages);
  const {
    firstUnreadMessageRef,
    messageEndRef,
    lastMsgRef,
    newMessagesCount,
    setNewMessagesCount,
    firstUnreadMessageId,
    setFirstUnreadMessageId,
    lastSeenMessageId,
    doneScrolling,
    setIsDoneScrolling,
    checkForNewMessages,
  } = useMessageTrackingAndVisibility(
    messages,
    scrollTo,
    totalImages,
    loadedImages,
    isInitialLoaded
  );

  const scrollToBottom = useCallback(() => {
    if (firstUnreadMessageId) {
      if (firstUnreadMessageRef.current) {
        firstUnreadMessageRef.current.scrollIntoView({ behavior: "smooth" });

        // setNewMessagesCount(0); // Reset new message count
        setFirstUnreadMessageId(null);
        setIsDoneScrolling(true);
      }
    } else {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  const { listInnerRef, isAtBottom, handleScroll, loading } = useScroll(
    messages,
    loadMoreMessages,
    loadPrevMessages,
    hasNextPage,
    scrollToBottom,
    checkForNewMessages
  );
  const { activeChat, chats } = useSelector((state) => state.chat);
  const { markMessageAsRead } = useSocketContext();
  const activeChatMessages = useSelector(selectActiveChatMessages);
  useEffect(() => {
    if (
      activeChat &&
      !activeChat.startsWith("temp-chat-") &&
      activeChatMessages
    ) {
      markMessageAsRead(activeChat);
    }
  }, [activeChatMessages, activeChat]);

  const scrollToFirstUnreadMessage = () => {
    // Implement logic to scroll to the first unread message
    firstUnreadMessageRef.current.scrollIntoView({ behavior: "smooth" });
    setNewMessagesCount(0); // Reset new message count
    setFirstUnreadMessageId(null);
  };
  if (chats[activeChat]?.loading || chats[activeChat]?.loading === undefined) {
    return (
      <div className=" flex-grow flex flex-col items-center justify-center ">
        <Loader />
      </div>
    );
  }
  const renderMessages = () => {
    const messageElements = [];
    let lastDate = null;

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isLastMsg = i === messages.length - 1;

      const refProp =
        msg._id === firstUnreadMessageId
          ? firstUnreadMessageRef
          : isLastMsg && !firstUnreadMessageId
          ? lastMsgRef
          : null;

      const messageDate = formatDate(msg.timestamp);

      if (messageDate !== lastDate) {
        messageElements.push(
          <li
            key={`date-${messageDate}`}
            className="date-separator text-center text-sm py-2 text-gray-500  w-full"
          >
            {messageDate}
          </li>
        );
        lastDate = messageDate;
      }

      if (msg.type === "system") {
        messageElements.push(
          <SystemNotification
            ref={refProp}
            key={msg._id}
            msg={msg}
            id={msg._id}
          />
        );
      } else {
        messageElements.push(
          <ChatMessage
            ref={refProp}
            key={msg._id}
            id={msg._id}
            content={msg.content}
            type={msg.type}
            isLoading={msg.isLoading}
            imageUrl={msg.imageUrl}
            timestamp={msg.timestamp}
            sender={msg.sender}
            handleImageLoaded={handleImageLoaded}
            fileMetadata={msg.fileMetadata}
          />
        );
      }
    }
    return messageElements;
  };
  return (
    <div
      className={`overflow-y-auto relative p-3 flex-grow flex flex-col transition-opacity duration-0 ${
        doneScrolling ? "opacity-100" : "opacity-0"
      }`}
      ref={listInnerRef}
      onScroll={handleScroll}
    >
      {loading && <Loader />}
      {renderMessages()}
      <div ref={messageEndRef} />
      {newMessagesCount > 0 && !isAtBottom && (
        <div
          className="fixed bottom-20 right-5 cursor-pointer bg-gray-500 text-white p-2 rounded-full shadow-lg flex items-center justify-center"
          style={{ width: "40px", height: "40px" }} // Ensures the div is circular
          onClick={scrollToFirstUnreadMessage}
        >
          <span className="text-sm font-bold">{newMessagesCount}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default InfiniteScrollChat;
