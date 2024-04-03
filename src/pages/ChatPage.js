import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Input from "../components/UI/Input";

// Connect to Socket.IO server
const socket = io("http://localhost:5000"); // Use your actual server URL here

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("chat message", (msg) => {
      setChat([...chat, msg]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("chat message");
    };
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("chat message", message);
    setMessage("");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Chat Room</h1>
      </div>
      <ul className="mb-4">
        {chat.map((msg, index) => (
          <li key={index} className="border-b border-gray-200 p-2">
            {msg}
          </li>
        ))}
      </ul>
      <form className="flex" onSubmit={sendMessage}>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
