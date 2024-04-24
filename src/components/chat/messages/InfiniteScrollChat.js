import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { formatDate } from "../../../utils/date";
import ChatMessage from "./ChatMessage";
import SystemNotification from "./SystemNotification";
import Loader from "../../UI/Loader";
import { useSelector } from "react-redux";
import { selectActiveChatMessages } from "../../../store/chatSlice";
import { useSocketContext } from "../../../context/SocketContext";

function InfiniteScrollChat({
  messages,
  loadMoreMessages,
  hasNextPage,
  scrollTo,
}) {
  const { activeChat, chats } = useSelector((state) => state.chat);
  const { markMessageAsRead } = useSocketContext();
  const [doneScrolling, setIsDoneScrolling] = useState(false);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const listInnerRef = useRef();
  const prevScrollHeight = useRef(0);
  const [loadedImages, setLoadedImages] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState(scrollTo);
  const firstUnreadMessageRef = useRef(null);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const currentLastMessageId = messages?.[messages.length - 1]?._id;
  const lastMessage = messages?.[messages.length - 1];
  const lastMsgRef = (node) => {
    if (!node) return;

    if (
      !doneScrolling &&
      (totalImages === loadedImages || totalImages === 0) &&
      isInitialLoaded
    ) {
      node?.scrollIntoView({ behavior: "smooth" });
      setLastSeenMessageId(node.id);
      setIsDoneScrolling(true);
      // setImageLoaded(false);
    }
  };
  useLayoutEffect(() => {
    // Get the ID of the current last message
    // Update the state only if the current last message ID is different from the last seen message ID
    if (currentLastMessageId && currentLastMessageId !== lastSeenMessageId) {
      setLastSeenMessageId(currentLastMessageId);
    }
  }, [messages, lastSeenMessageId, currentLastMessageId]);
  const handleImageLoaded = () => {
    setLoadedImages((prev) => prev + 1);
  };
  const handleScroll = () => {
    const isAtTop = listInnerRef.current.scrollTop === 0;
    const scrollAtBottom =
      listInnerRef.current.scrollHeight - listInnerRef.current.scrollTop <=
      listInnerRef.current.clientHeight + 10;

    setIsAtBottom(scrollAtBottom);
    if (isAtTop && !loading && hasNextPage) {
      prevScrollHeight.current = listInnerRef.current.scrollHeight;
      setLoading(true);
      loadMoreMessages(() => {
        const currentScrollHeight = listInnerRef.current.scrollHeight;
        const scrollOffset = currentScrollHeight - prevScrollHeight.current;
        listInnerRef.current.scrollTop = scrollOffset;
        setLoading(false);
      });
    }
  };

  useLayoutEffect(() => {
    if (!isInitialLoaded && messages.length > 0) {
      const totalImg = messages.reduce((count, msg) => {
        if (msg.type === "image") return count + 1;
        return count;
      }, 0);

      setTotalImages(totalImg);
      setLoadedImages(0); // Reset the loaded images count
      setIsInitialLoaded(true); // Ensure this block won't run again unless component is remounted
    }
  }, [messages, isInitialLoaded]);

  useLayoutEffect(() => {
    if (isAtBottom) {
      if (
        (totalImages === loadedImages || totalImages === 0) &&
        isInitialLoaded
      ) {
        if (lastMessage?.type === "image") {
          const img = new Image();
          img.onload = () => {
            scrollToBottom();
          };
          img.src = lastMessage.imageUrl;
        } else {
          scrollToBottom();
        }
        // setImageLoaded(false);
      }
    } else {
      if (lastSeenMessageId !== lastMessage?._id && lastMessage?._id) {
        setNewMessagesCount((prevCount) => prevCount + 1);
        if (!firstUnreadMessageId || firstUnreadMessageId === scrollTo) {
          setFirstUnreadMessageId(lastMessage?._id);
        }
      }
    }
  }, [
    lastMessage,
    totalImages,

    isInitialLoaded,
    loadedImages,
    lastSeenMessageId,
  ]); // You may need to adjust this dependency based on how your messages are structured

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
  const scrollToBottom = () => {
    if (firstUnreadMessageId) {
      if (firstUnreadMessageRef.current) {
        firstUnreadMessageRef.current.scrollIntoView({ behavior: "smooth" });

        // setNewMessagesCount(0); // Reset new message count
        setFirstUnreadMessageId(null);
      }
    } else {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          : isLastMsg
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
