import React, { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";
import {
  ChatIcon,
  SearchIcon,
  DotsVerticalIcon,
} from "@heroicons/react/outline"; // You might need to install @heroicons/react
import { useSelector } from "react-redux";
import Avatar from "../components/UI/Avatar";

// Connect to Socket.IO server

const dummyChats = [
  {
    name: "Jane Doe",
    message: "Hey, how's it going?",
    time: "4:14 AM",
    avatar: "path-to-avatar",
    unread: 2,
  },
  // Add more dummy chat data here
];

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]); // Add this line

  const [chat, setChat] = useState({}); // Chat messages organized by chat partner ID
  const [unreadMessages, setUnreadMessages] = useState({}); // Unread messages organized by chat partner ID
  const [activeChat, setActiveChat] = useState(null); // Unread messages organized by chat partner ID
  const [lastMessageTimestamps, setLastMessageTimestamps] = useState({});
  const { accessToken, refreshToken, user, userData } = useSelector(
    (state) => state.auth
  );
  const socket = useMemo(
    () =>
      io("http://localhost:5000", {
        withCredentials: true,
        auth: {
          token: accessToken, // Make sure to send the actual token
        },
      }),
    [accessToken]
  ); //
  useEffect(() => {
    socket.on("chat message", (msg) => {
      const { senderId, time } = msg;
      const chatId = senderId === user ? msg.target : senderId; // Determine the chat ID based on the message direction

      // If it's the active chat or a message sent by the user, display it immediately
      if (activeChat === chatId) {
        setChat((prevChats) => ({
          ...prevChats,
          [chatId]: [...(prevChats[chatId] || []), msg],
        }));
      } else {
        // Otherwise, add to unread messages
        setUnreadMessages((prevUnreads) => ({
          ...prevUnreads,
          [chatId]: [...(prevUnreads[chatId] || []), msg],
        }));
        setLastMessageTimestamps((prevTimestamps) => ({
          ...prevTimestamps,
          [chatId]: new Date(time).getTime(), // Assuming `time` can be converted to a valid Date.
        }));
      }
    });
    socket.on("online users", (users) => {
      // Assuming each user object has an '_id' field and filtering out the current user
      const filteredUsers = users.filter(
        (onlineUser) => onlineUser._id !== user
      );
      setOnlineUsers(filteredUsers); // Update state with filtered list
    });
    return () => {
      socket.off("chat message");
      socket.off("online users");
    };
  }, [chat, socket, user, activeChat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeChat) {
      const timestamp = new Date().getTime(); // Get the current timestamp
      const messageData = {
        senderId: user,
        content: message,
        time: timestamp,
        target: activeChat,
      };

      socket.emit("chat message", messageData);
      setChat((prevChats) => ({
        ...prevChats,
        [activeChat]: [...(prevChats[activeChat] || []), messageData],
      }));
      setLastMessageTimestamps((prevTimestamps) => ({
        ...prevTimestamps,
        [activeChat]: timestamp,
      }));
      setMessage("");
    }
  };

  useEffect(() => {
    if (activeChat && unreadMessages[activeChat]) {
      // Move unread messages to chat
      setChat((prevChats) => ({
        ...prevChats,
        [activeChat]: [
          ...(prevChats[activeChat] || []),
          ...unreadMessages[activeChat],
        ],
      }));

      // Reset unread count for the active chat
      setUnreadMessages((prevUnreads) => {
        const newUnreads = { ...prevUnreads };
        delete newUnreads[activeChat];
        return newUnreads;
      });
    }
  }, [activeChat, unreadMessages]);
  // Before rendering the list, sort onlineUsers based on the last message timestamp.
  const sortedOnlineUsers = useMemo(() => {
    return onlineUsers
      .slice() // Create a copy to avoid mutating the original array
      .sort((a, b) => {
        const lastA = lastMessageTimestamps[a._id] || 0;
        const lastB = lastMessageTimestamps[b._id] || 0;
        return lastB - lastA; // Descending order
      });
  }, [onlineUsers, lastMessageTimestamps]);
  return (
    <div className="flex flex-grow bg-gray-900 text-white">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-700">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <Avatar imageUrl={userData.profileImg} size="8" />

            <h2 className="text-xl font-semibold">Chats</h2>
          </div>
          <div className="flex space-x-3">
            <SearchIcon className="h-6 w-6" />
            <DotsVerticalIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="overflow-y-auto">
          {sortedOnlineUsers.map((onlineUser, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 ${
                activeChat === onlineUser._id ? "bg-gray-600" : ""
              }`} // Highlight the active chat
              onClick={() => setActiveChat(onlineUser._id)} // Set the active chat on click
            >
              <div className="flex items-center">
                <Avatar imageUrl={onlineUser.profileImg} size="8" />
                <div className="flex-1 min-w-0 ml-4">
                  <p className="text-sm font-semibold truncate">
                    {onlineUser.name}
                  </p>
                </div>
              </div>
              {/* Move the conditionally rendered unread messages notification here, outside of the name container */}
              {unreadMessages[onlineUser._id] &&
                unreadMessages[onlineUser._id].length > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-500 rounded-full">
                    {unreadMessages[onlineUser._id].length}
                  </span>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {/* Add chat header here */}
        <ul className="overflow-y-auto p-3 flex-1">
          {activeChat &&
            (chat[activeChat] || []).map((msg, index) => {
              const isCurrentUser = msg.senderId === user; // Compare sender ID to current user ID
              return (
                <li
                  key={index}
                  className={`p-2 rounded my-1 max-w-xs ${
                    isCurrentUser
                      ? "ml-auto bg-green-500"
                      : "mr-auto bg-blue-500" // Adjust styles based on sender
                  }`}
                >
                  {msg.content}
                </li>
              );
            })}
        </ul>
        <form
          className="flex items-center justify-between p-3 border-t border-gray-700"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            className="flex-1 rounded-full p-2 mr-3 bg-gray-700 text-white outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!activeChat}
          />
          <button
            className="bg-green-500 rounded-full p-3 hover:bg-green-600"
            type="submit"
          >
            <ChatIcon className="h-5 w-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
