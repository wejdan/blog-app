// src/contexts/SocketContext.js
import React, { createContext, useContext } from "react";
import useSocket from "../hooks/chat/useSocket";

// Create context
const SocketContext = createContext();

// Provider component
export const SocketProvider = ({ serverUrl, options, children }) => {
  const socketOperations = useSocket(serverUrl, options);

  return (
    <SocketContext.Provider value={socketOperations}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
