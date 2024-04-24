// src/hooks/useSocket.js
import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  receiveMessage,
  setOnlineUsers,
  setChatHistory,
  updateUserStatus,
  setAllUsers,
  setActiveChat,
  updateChatData,
  removeChat,
  addMessage,
  removeMessage,
  setMessages,
  setLoadingChatMessges,
  markChatAsRead,
  setUserTyping,
  setSearchResults,
} from "../../store/chatSlice";
import { useUploadChatImg } from "../users/useUploadChatImg";
import toast from "react-hot-toast";

const useSocket = (serverUrl, options) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const chats = useSelector((state) => state.chat.chats);

  const { handleImageUpload, loading } = useUploadChatImg();
  // Define a function within your useSocket hook that returns an object of event handlers

  const handleGroupUpdated = useCallback(
    (updatedGroupInfo) => {
      dispatch(
        updateChatData({
          chatId: updatedGroupInfo.chatId,
          updatedData: updatedGroupInfo,
        })
      );
    },
    [dispatch] // Or depend on your state setter function if using local state
  );

  const handleAllUsers = useCallback(
    (allUsers) => {
      // Dispatch an action to store this list in your Redux store or local state
      // For example, you might have an action like `setAllUsers`
      const filteredUsers = allUsers.filter(
        (onlineUser) => onlineUser._id !== user
      );
      dispatch(setAllUsers(filteredUsers));
    },
    [dispatch, user]
  );

  // Handle real-time updates when a user's online status changes
  const handleUserStatusChange = useCallback(
    ({ userId, isOnline, lastSeen }) => {
      // Dispatch an action to update this user's online status in your Redux store or local state
      // This could involve updating a specific user's `isOnline` property within a users array
      dispatch(updateUserStatus({ userId, isOnline, lastSeen }));
    },
    [dispatch]
  );
  // Define handlers using useCallback to ensure they are stable
  const handleReceiveMessage = useCallback(
    (msg) => {
      // console.log("receiveMessage", msg);
      dispatch(receiveMessage(msg));
    },
    [dispatch]
  );

  const handleSetOnlineUsers = useCallback(
    (users) => {
      const filteredUsers = users.filter((onlineUser) => onlineUser !== user);
      dispatch(setOnlineUsers(filteredUsers));
    },
    [dispatch, user]
  );

  const handleRemovedFromGroup = useCallback(
    ({ chatId }) => {
      dispatch(removeChat(chatId));
      if (activeChat === chatId) {
        dispatch(setActiveChat(null));
      }
    },
    [dispatch, user, activeChat]
  );

  const handleGroupCreated = useCallback(
    (data) => {
      // Dispatch an action to add the new group to your chat list or state
      console.log("New group created", data);
      const {
        chatId,
        isGroup,
        lastMessageTimestamp,
        lastMessage,
        conversationInfo,
      } = data;

      dispatch(
        setChatHistory({
          messages: [],
          chatId,
          isGroup,
          lastMessage,
          conversationInfo,
          currentUser: user,
          lastMessageTimestamp,
        })
      );
      if (conversationInfo.admin._id === user) {
        dispatch(setActiveChat(chatId));
      }
    },
    [dispatch, user]
  );

  const handleChatSession = useCallback(
    (data) => {
      const {
        chatId,
        messages,
        lastMessageTimestamp,
        conversationInfo,
        lastMessage,
        tempChatId,
        isNewChat,
        firstUnreadMessageId,
        unreadCount,
      } = data;
      // Dispatch an action to store or update the chat session in the state
      dispatch(
        setChatHistory({
          chatId,
          messages,
          tempChatId,
          unreadCount,
          firstUnreadMessageId,
          isNewChat,
          lastMessageTimestamp,
          lastMessage,
          conversationInfo, // This now includes whether it's a group, groupInfo, and participant info
          currentUser: user,
        })
      );

      // If setActive is true, also dispatch an action to set this chat as the active chat
      if (isNewChat) {
        dispatch(setActiveChat(chatId));
      }
    },
    [dispatch, user]
  );
  const handleError = useCallback(
    (error) => {
      const {
        message, // Generic message
        details,
        tempId, // Detailed error message, consider the security implications of sending error details to the client
      } = error;
      // Dispatch an action to store or update the chat session in the state
      toast.error(message);
      if (tempId) {
        dispatch(removeMessage({ chatId: activeChat, tempId }));
      }
    },
    [dispatch, activeChat]
  );
  const handleTyping = useCallback((data) => {
    const {
      userId, // Generic message
      chatId,
      typing, // Detailed error message, consider the security implications of sending error details to the client
    } = data;
    // Dispatch an action to store or update the chat session in the state
    dispatch(setUserTyping({ chatId, userId, typing }));
  }, []);
  const handleStopTyping = useCallback((error) => {
    const {
      userId, // Generic message
      chatId, // Detailed error message, consider the security implications of sending error details to the client
    } = error;
    // Dispatch an action to store or update the chat session in the state
    dispatch(setUserTyping({ chatId, userId, typing: false }));
  }, []);

  const handleSearchResultsMessges = useCallback((messages) => {
    // Dispatch an action to store or update the chat session in the state
    console.log("handleSearchResultsMessges", messages);
    //   dispatch(setSearchResults(messages));
  }, []);
  const handleSearchResults = useCallback((messages) => {
    // Dispatch an action to store or update the chat session in the state
    console.log("handleSearchResults", messages);
    dispatch(setSearchResults(messages));
  }, []);
  const handleMessageResponse = useCallback(
    (data) => {
      const {
        chatId,
        messages,
        pageInfo, // Detailed error message, consider the security implications of sending error details to the client
      } = data;
      // Dispatch an action to store or update the chat session in the state

      dispatch(setMessages({ chatId, messages, pageInfo, currentUser: user }));
    },
    [dispatch]
  );

  useEffect(() => {
    const newSocket = io(serverUrl, options);
    setSocket(newSocket);

    // Internal event handling

    // Setup dynamic event listeners
    // setupEventListeners(newSocket, eventHandlers(dispatch, user));
    newSocket.on("chat message", handleReceiveMessage);
    newSocket.on("online users", handleSetOnlineUsers);
    newSocket.on("chat session", handleChatSession);
    newSocket.on("all users", handleAllUsers);
    newSocket.on("typing", handleTyping);
    newSocket.on("stop typing", handleStopTyping);
    newSocket.on("search results", handleSearchResults);
    newSocket.on("getMessagesAroundSearchResult", handleSearchResultsMessges);

    newSocket.on("user status change", handleUserStatusChange);
    newSocket.on("removed from group", handleRemovedFromGroup);
    newSocket.on("group deleted", handleRemovedFromGroup);
    newSocket.on("group created", handleGroupCreated);
    newSocket.on("group updated", handleGroupUpdated);
    newSocket.on("messages-response", handleMessageResponse);
    newSocket.on("error", handleError);

    return () => {
      newSocket.off("chat message", handleReceiveMessage);
      newSocket.off("online users", handleSetOnlineUsers);
      newSocket.off("chat session", handleChatSession);
      newSocket.off("all users", handleAllUsers);
      newSocket.off("user status change", handleUserStatusChange);
      newSocket.off("group created", handleGroupCreated);
      newSocket.off("group updated", handleGroupUpdated);
      newSocket.off("removed from group", handleRemovedFromGroup);
      newSocket.off("group deleted", handleRemovedFromGroup);
      newSocket.off("messages-response", handleMessageResponse);
      newSocket.off("error", handleError);
      newSocket.off("typing", handleTyping);
      newSocket.off("stop typing", handleStopTyping);
      newSocket.off("search results", handleSearchResults);
      newSocket.off(
        "getMessagesAroundSearchResult",
        handleSearchResultsMessges
      );

      newSocket.disconnect();
    };
  }, [serverUrl, options, user, dispatch]); // Include user._id in dependencies to reconfigure on user change

  useEffect(() => {
    if (socket && activeChat) {
      socket.emit("start chat", { senderId: user, target: activeChat });
    }
  }, [socket, activeChat, user]); // Re-run this effect if `socket` or `activeChat` changes

  const sendMessage = useCallback(
    (messageData, type, target) => {
      const tempId = `temp-${Date.now()}`;
      const sender = {
        _id: user,
        name: user.name,
        profileImg: user.profileImg,
      };
      const targetObj = target ? { ...target } : null;
      const tempChatId = activeChat || `temp-chat-${target._id}`; // Use target as temp chatId if activeChat is not available
      const tempMessage = {
        tempId,
        chatId: tempChatId,
        sender,
        type,
        target: target?._id,
        content: type === "image" || type === "file" ? "" : messageData, // Empty content for image until upload is done
        imageUrl:
          type === "image" ? URL.createObjectURL(messageData.file) : undefined, // Local image URL for preview
        fileMetadata:
          type === "file"
            ? {
                url: URL.createObjectURL(messageData.file),
                name: messageData.file.name,
                size: messageData.file.size,
                type: messageData.file.type,
              }
            : undefined,
        timestamp: new Date().toISOString(),
        isLoading: true, // Mark this message as loading
      };

      if (messageData.width) {
        tempMessage.width = messageData.width;
        tempMessage.height = messageData.height;
      }
      // Dispatch action to add this temporary message to the store
      //  dispatch(setActiveChat(tempChatId));
      dispatch(
        addMessage({
          chatId: tempChatId,
          message: tempMessage,
          participants: [sender, targetObj],
        })
      );
      // For images, start upload, then send the message with the actual image URL
      if (type === "image") {
        handleImageUpload(messageData.file).then((imageUrl) => {
          socket.emit("send message", {
            ...tempMessage,
            chatId: tempChatId,
            imageUrl,
            tempId,
            type: "image",
            isLoading: false,
            height: messageData.height,
          });
          console.log("emmting msg", imageUrl);
        });
      }
      if (type === "file") {
        handleImageUpload(messageData.file, "file").then((url) => {
          socket.emit("send message", {
            ...tempMessage,
            chatId: tempChatId,
            fileMetadata: {
              url,
              name: messageData.file.name,
              size: messageData.file.size,
              type: messageData.file.type,
            },
            tempId,
            type: "file",
            isLoading: false,
          });
        });
      } else {
        // Directly send text messages
        socket.emit("send message", {
          ...tempMessage,
          chatId: tempChatId,

          tempId,
          type: "text",
          isLoading: false,
        });
      }
    },
    [activeChat, user, socket, dispatch]
  );

  const createGroup = useCallback(
    ({ groupName, participantIds }) => {
      socket.emit("create group", { groupName, participantIds });
    },
    [socket]
  );
  const getChatInfo = useCallback(
    ({ chatId }) => {
      socket.emit("chat info", { chatId });
    },
    [socket]
  );
  const editGroup = useCallback(
    ({ groupId, groupName, participantIds }) => {
      socket.emit("edit group", { groupId, groupName, participantIds });
    },
    [socket]
  );

  const exitGroup = useCallback(
    ({ groupId }) => {
      console.log("exit group", groupId);
      socket.emit("exit group", { groupId });
    },
    [socket]
  );
  const markMessageAsRead = useCallback(
    (chatId) => {
      if (socket) {
        socket.emit("read message", { chatId });
        dispatch(markChatAsRead(chatId));
      }
    },
    [socket]
  );
  const fetchSurroundingMessages = useCallback(
    (messageId) => {
      socket.emit("fetchSurroundingMessages", { messageId, range: 10 });
    },
    [socket]
  );
  const updateGroupImg = useCallback(
    ({ groupId, url }) => {
      if (socket) {
        socket.emit("update group img", { groupId, url });
      }
    },
    [socket]
  );
  const updateTypingStatus = useCallback(
    (isTyping) => {
      if (socket) {
        socket.emit("typing", { chatId: activeChat, typing: isTyping });
      }
    },
    [socket, activeChat]
  );

  // Assuming loadMoreMessages is in a context or similar module
  const loadMoreMessages = useCallback(
    (onLoaded) => {
      const nextPage = chats[activeChat]?.pageInfo?.currentPage + 1;
      console.log("nextPage", nextPage);
      if (chats[activeChat]?.pageInfo?.hasNextPage) {
        socket.emit(
          "request-messages",
          { chatId: activeChat, page: nextPage },
          (hasMore) => {
            if (onLoaded) {
              onLoaded(hasMore);
            }
          }
        );
      }
    },
    [socket, activeChat, chats]
  );
  const loadPrevMessages = useCallback(
    (onLoaded) => {
      const prevPage = chats[activeChat]?.pageInfo?.currentPage - 1;
      if (prevPage >= 1) {
        socket.emit(
          "request-messages",
          { chatId: activeChat, page: prevPage },
          (hasMore) => {
            if (onLoaded) {
              onLoaded(hasMore);
            }
          }
        );
      }
    },
    [socket, activeChat, chats]
  );
  const requsetMessges = useCallback(
    (chatId, page, onLoaded) => {
      if (chatId && !chatId.startsWith("temp-chat")) {
        dispatch(setLoadingChatMessges({ chatId, loading: true }));
        console.log("page", page);
        socket.emit("request-messages", { chatId, page }, (response) => {
          if (onLoaded) {
            onLoaded();
          }
        });
      }
    },
    [activeChat, setLoadingChatMessges, socket]
  );
  const searchMessages = useCallback(
    (searchTerm) => {
      socket.emit("search messages", { searchTerm });
    },
    [socket]
  );

  return {
    socket,
    sendMessage,
    searchMessages,
    markMessageAsRead,
    editGroup,
    createGroup,
    updateGroupImg,
    exitGroup,
    loadMoreMessages,
    requsetMessges,
    getChatInfo,
    fetchSurroundingMessages,
    updateTypingStatus,
    loadPrevMessages,
  };
};

export default useSocket;
