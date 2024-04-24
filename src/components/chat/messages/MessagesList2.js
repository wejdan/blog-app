import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectActiveChatMessages } from "../../../store/chatSlice";
import ChatMessage from "./ChatMessage";
import SystemNotification from "./SystemNotification";
import { formatDate } from "../../../utils/date";
import { useSocketContext } from "../../../context/SocketContext";
import Loader from "../../UI/Loader";

function MessagesList() {
  const { user, userData } = useSelector((state) => state.auth);

  const { loadMoreMessages } = useSocketContext();
  const messagesEndRef = useRef(null);
  const activeChatMessages = useSelector(selectActiveChatMessages);
  const { chats, activeChat } = useSelector((state) => state.chat);

  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasMounted = useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false); // State to handle image loading
  const [lastMessgeLoaded, setLastMessgeLoaded] = useState(false); // State to handle image loading
  const prevScrollHeight = useRef(0); // Store the previous scroll height
  const lastMessage =
    activeChatMessages?.messages?.[activeChatMessages.messages.length - 1];
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);

  const [loadedImages, setLoadedImages] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  const handleImageLoaded = () => {
    setLoadedImages((prev) => prev + 1);
    // Scroll adjustment for each image load
    if (containerRef.current && messagesEndRef.current) {
      const scrollDifference =
        messagesEndRef.current.getBoundingClientRect().bottom -
        containerRef.current.scrollHeight;
      if (scrollDifference < 0) {
        containerRef.current.scrollTop += Math.abs(scrollDifference);
      }
    }
  };

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
  useEffect(() => {
    // Ensure to scroll to the bottom only after all images have loaded or if there are no images
    if (totalImages === loadedImages || totalImages === 0) {
      if (!hasMounted.current || imageLoaded || lastMessgeLoaded) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setImageLoaded(false); // Reset image loaded flag after scrolling
        setLastMessgeLoaded(false);
        hasMounted.current = true;
      }
    }
  }, [imageLoaded, lastMessgeLoaded, loadedImages, totalImages]);

  const adjustScroll = () => {
    const newScrollHeight = containerRef.current.scrollHeight;
    const scrollOffset = newScrollHeight - prevScrollHeight.current;
    containerRef.current.scrollTop += scrollOffset;
  };
  // Scroll to bottom on initial load or when additional content (non-image) is loaded
  useEffect(() => {
    if (!hasMounted.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      hasMounted.current = true;
    }
  }, []);

  // useEffect(() => {
  //   // Scroll to the bottom if it's the first mount or if an image has loaded
  //   if (isInitalLoading) return;

  //   if (!hasMounted.current || imageLoaded || lastMessgeLoaded) {
  //     console.log("scrolling to the bottom");
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  //     hasMounted.current = true;
  //     setImageLoaded(false); // Reset image loaded flag after scrolling
  //     setLastMessgeLoaded(false);
  //   }
  // }, [imageLoaded, isInitalLoading, lastMessgeLoaded]);

  useEffect(() => {
    console.log("lastMessage", lastMessage);
    if (lastMessage?.type === "image") {
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true); // Set image loaded to true when image is loaded
      };
      img.src = lastMessage.imageUrl;
    } else {
      // For non-image last messages, you need to ensure that you're setting this only once per message
      if (!lastMessgeLoaded) {
        console.log("Non-image last message loaded");
        setLastMessgeLoaded(true);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (chats[activeChat]?.loading || !chats[activeChat]) return;
    const handleScroll = () => {
      if (containerRef.current.scrollTop === 0 && !isLoading) {
        setIsLoading(true);
        prevScrollHeight.current = containerRef.current.scrollHeight;
        loadMoreMessages(() => {
          adjustScroll();
          setIsLoading(false);
        });
      }
    };

    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [loadMoreMessages, isLoading, chats, activeChat]);

  const renderMessages = () => {
    const messages = activeChatMessages?.messages || [];
    const messageElements = [];
    let lastDate = null;

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
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
        messageElements.push(<SystemNotification key={msg._id} msg={msg} />);
      } else {
        messageElements.push(
          <ChatMessage
            key={msg._id}
            content={msg.content}
            type={msg.type}
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
        loadedImages === totalImages ? "opacity-100" : "opacity-100"
      }`}
    >
      {renderMessages()}
      <div ref={messagesEndRef} />
      {/* Invisible element at the end of the list */}
      {loadedImages !== totalImages && <Loader />}{" "}
      {/* Show loader while images are loading */}
    </ul>
  );
}

export default MessagesList;
