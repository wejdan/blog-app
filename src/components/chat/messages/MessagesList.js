import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectActiveChatMessages } from "../../../store/chatSlice";
import ChatMessage from "./ChatMessage";
import SystemNotification from "./SystemNotification";
import { formatDate } from "../../../utils/date";
import { useSocketContext } from "../../../context/SocketContext";
import Loader from "../../UI/Loader";
import { useObserverRef } from "../../../hooks/chat/useObserverRef";

function MessagesList() {
  const { user, userData } = useSelector((state) => state.auth);

  const { loadMoreMessages, markMessageAsRead } = useSocketContext();
  const messagesEndRef = useRef(null);
  const activeChatMessages = useSelector(selectActiveChatMessages);
  const { chats, activeChat } = useSelector((state) => state.chat);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [lastMessageChanged, setLastMessageChanged] = useState(null);

  const lastMessage =
    activeChatMessages?.messages?.[activeChatMessages.messages.length - 1];
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [doneScrolling, setIsDoneScrolling] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState(null);
  const firstUnreadMessageRef = useRef(null);
  const handleGoToBottom = () => {
    firstUnreadMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessagesCount(0); // Reset new message count
    setFirstUnreadMessageId(null);
  };
  useLayoutEffect(() => {
    // Get the ID of the current last message
    const currentLastMessageId =
      activeChatMessages?.messages?.[activeChatMessages.messages.length - 1]
        ?._id;
    // Update the state only if the current last message ID is different from the last seen message ID
    if (currentLastMessageId && currentLastMessageId !== lastSeenMessageId) {
      setLastSeenMessageId(currentLastMessageId);
    }
  }, [activeChatMessages?.messages, lastSeenMessageId]);

  // Custom hook usage
  const [lastMsgRef, lastMsgNode] = useObserverRef((node) => {
    // Assuming node refers to the current instance of lastMsgRef's element

    if (
      !doneScrolling &&
      (totalImages === loadedImages || totalImages === 0) &&
      isInitialLoaded
    ) {
      node.scrollIntoView({ behavior: "smooth" });
      setLastMessageChanged(node.id);
      setIsDoneScrolling(true);
      // setImageLoaded(false);
    }
  });

  useLayoutEffect(() => {
    // Check if there's a last message and if the initial loading is done
    if (!lastMessage || !isInitialLoaded || !lastSeenMessageId) return;
    console.log("lastMessage", lastMessage);
    // This ensures the effect runs only after the first load and when new messages are added
    if (lastMessage._id !== lastSeenMessageId) {
      if (isAtBottom) {
        if (lastMessage?.type === "image") {
          const img = new Image();
          img.onload = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          };
          img.src = lastMessage.imageUrl;
        } else {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        if (lastMessage._id) {
          setNewMessagesCount((prevCount) => prevCount + 1);
          if (!firstUnreadMessageId) {
            setFirstUnreadMessageId(lastMessage._id);
          }
        }
      }
    }
  }, [
    lastSeenMessageId,
    lastMessage,
    doneScrolling,
    isInitialLoaded,
    isAtBottom,
  ]); // Update to depend on lastSeenMessageId

  useLayoutEffect(() => {
    if (!isInitialLoaded && activeChatMessages?.messages.length > 0) {
      const totalImg = activeChatMessages.messages.reduce((count, msg) => {
        if (msg.type === "image") return count + 1;
        return count;
      }, 0);

      setTotalImages(totalImg);
      setLoadedImages(0); // Reset the loaded images count
      setIsInitialLoaded(true); // Ensure this block won't run again unless component is remounted
    }
  }, [activeChatMessages, isInitialLoaded]);
  const handleImageLoaded = () => {
    setLoadedImages((prev) => prev + 1);
    // Scroll adjustment for each image load
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Load more messages on scroll to top
      const isScrolledToBottom =
        containerRef.current.scrollHeight - containerRef.current.scrollTop <=
        containerRef.current.clientHeight + 10; // +10 is a threshold
      setIsAtBottom(isScrolledToBottom);
      if (
        container.scrollTop === 0 &&
        !isLoading &&
        chats[activeChat]?.pageInfo?.hasNextPage &&
        activeChat
      ) {
        setIsLoading(true);
        const previousHeight = container.scrollHeight;

        loadMoreMessages((pageData) => {
          // After messages have loaded, adjust scroll to maintain position
          const currentHeight = container.scrollHeight;
          container.scrollTop = currentHeight - previousHeight;
          setIsLoading(false);
          //  setPageInfo(pageData);
        });
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadMoreMessages, isLoading, activeChat, chats]);
  useLayoutEffect(() => {
    if (
      activeChat &&
      !activeChat.startsWith("temp-chat-") &&
      activeChatMessages
    ) {
      markMessageAsRead(activeChat);
    }
  }, [activeChatMessages, activeChat]);

  const renderMessages = () => {
    const messages = activeChatMessages?.messages || [];
    const messageElements = [];
    let lastDate = null;

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isLastMsg = chats[activeChat]?.pageInfo.firstUnreadMessageId
        ? msg._id === chats[activeChat]?.pageInfo.firstUnreadMessageId
        : i === messages.length - 1;

      const messageDate = formatDate(msg.timestamp);
      const isCurrentUser = msg.sender?._id === user;
      const ref =
        !isAtBottom && msg._id === firstUnreadMessageId
          ? firstUnreadMessageRef
          : isLastMsg
          ? lastMsgRef
          : null;
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
          <SystemNotification key={msg._id} msg={msg} id={msg._id} ref={ref} />
        );
      } else {
        messageElements.push(
          <ChatMessage
            isLastMsg={isLastMsg}
            ref={ref}
            key={msg._id}
            id={msg._id}
            content={msg.content}
            type={msg.type}
            height={msg.height}
            isLoading={msg.isLoading}
            imageUrl={msg.imageUrl}
            timestamp={msg.timestamp}
            sender={msg.sender}
            fileMetadata={msg.fileMetadata}
            handleImageLoaded={handleImageLoaded}
          />
        );
      }
    }
    return messageElements;
  };

  if (chats[activeChat]?.loading) {
    return (
      <div className=" flex-grow flex flex-col items-center justify-center ">
        <Loader />
      </div>
    );
  }
  return (
    <ul
      ref={containerRef}
      className={`overflow-y-auto p-3 flex-grow flex flex-col transition-opacity duration-0 ${
        doneScrolling ? "opacity-100" : "opacity-0"
      }`}
    >
      {" "}
      {newMessagesCount > 0 && !isAtBottom && (
        <div
          className="fixed bottom-20 right-5 cursor-pointer bg-gray-500 text-white p-2 rounded-full shadow-lg flex items-center justify-center"
          style={{ width: "40px", height: "40px" }} // Ensures the div is circular
          onClick={handleGoToBottom}
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
      {chats[activeChat]?.pageInfo &&
        chats[activeChat]?.pageInfo.hasNextPage === false && (
          <p className="text-center text-xs text-gray-500">No more Messges</p>
        )}
      {isLoading && <Loader />}
      {renderMessages()}
      <div ref={messagesEndRef} />
    </ul>
  );
}

export default MessagesList;
