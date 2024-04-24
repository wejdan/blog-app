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

  const { loadMoreMessages } = useSocketContext();
  const messagesEndRef = useRef(null);
  const activeChatMessages = useSelector(selectActiveChatMessages);
  const { chats, activeChat } = useSelector((state) => state.chat);

  const containerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [lastMessageChanged, setLastMessageChanged] = useState(null);

  const lastMessage =
    activeChatMessages?.messages?.[activeChatMessages.messages.length - 1];
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [doneScrolling, setIsDoneScrolling] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  // Custom hook usage
  const [lastMsgRef, lastMsgNode] = useObserverRef((node) => {
    // Assuming node refers to the current instance of lastMsgRef's element

    if (
      lastMessageChanged !== lastMessage?._id &&
      (totalImages === loadedImages || totalImages === 0) &&
      isInitialLoaded
    ) {
      node.scrollIntoView({ behavior: "smooth" });
      setLastMessageChanged(node.id);
      setIsDoneScrolling(true);
      // setImageLoaded(false);
    }
  });

  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage?.type === "image") {
      const img = new Image();
      img.onload = () => {
        // setImageLoaded(true); // Set image loaded to true when image is loaded
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };
      img.src = lastMessage.imageUrl;
    } else {
      // For non-image last messages, you need to ensure that you're setting this only once per message
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lastMessage]);

  useEffect(() => {
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Load more messages on scroll to top
      if (
        container.scrollTop === 0 &&
        !isLoading &&
        chats[activeChat]?.pageInfo.hasNextPage &&
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

  const renderMessages = () => {
    const messages = activeChatMessages?.messages || [];
    const messageElements = [];
    let lastDate = null;

    for (let i = 0; i < messages.length; i++) {
      const isLastMsg = i === messages.length - 1;
      const msg = messages[i];
      console.log(",,,", msg);
      const messageDate = formatDate(msg.timestamp);
      const isCurrentUser = msg.sender?._id === user;

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
            key={msg._id}
            msg={msg}
            id={msg._id}
            ref={isLastMsg ? lastMsgRef : null}
          />
        );
      } else {
        messageElements.push(
          <ChatMessage
            isLastMsg={isLastMsg}
            ref={isLastMsg ? lastMsgRef : null}
            key={msg._id}
            id={msg._id}
            content={msg.content}
            type={msg.type}
            height={msg.height}
            isLoading={msg.isLoading}
            imageUrl={msg.imageUrl}
            isCurrentUser={isCurrentUser}
            timestamp={msg.timestamp}
            sender={msg.sender}
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
      className={`overflow-y-auto p-3 flex-grow flex flex-col transition-opacity duration-300 ${
        doneScrolling ? "opacity-100" : "opacity-0"
      }`}
    >
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
