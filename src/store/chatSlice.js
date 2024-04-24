import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

// Simple selectors
export const selectAllUsers = (state) => state.chat.allUsers;
export const selectLastMessageTimestamps = (state) =>
  state.chat.lastMessageTimestamps;

// Memoized selector
export const selectSortedUsers = createSelector(
  [selectAllUsers, selectLastMessageTimestamps],
  (allUsers, lastMessageTimestamps) => {
    return allUsers.slice().sort((a, b) => {
      // Convert string timestamps to numbers for comparison.
      // If no timestamp is present, use -Infinity to sort these users to the end.
      const lastA = lastMessageTimestamps[a._id]
        ? new Date(lastMessageTimestamps[a._id]).getTime()
        : -Infinity;
      const lastB = lastMessageTimestamps[b._id]
        ? new Date(lastMessageTimestamps[b._id]).getTime()
        : -Infinity;

      return lastB - lastA;
    });
  }
);
// Selector to get sorted conversations (both private and groups)
// Selector to sort conversations based on the last message timestamp
export const selectSortedConversations = createSelector(
  [(state) => state.chat.chats],
  (chats) => {
    // Map through the chats to include chatId with each chat's details
    const chatsWithId = Object.entries(chats).map(([chatId, chatDetails]) => ({
      ...chatDetails,
      chatId,
    }));

    // Now, sort these chats by lastMessageTimestamp
    return chatsWithId.sort((a, b) => {
      const lastA = new Date(a.lastMessageTimestamp || 0).getTime();
      const lastB = new Date(b.lastMessageTimestamp || 0).getTime();
      return lastB - lastA;
    });
  }
);

// Selector to get users not in any chat with the current user
export const selectAvailableUsers = createSelector(
  [(state) => state.chat.allUsers, (state) => state.chat.chats],
  (allUsers, chats) => {
    // Create a set to hold IDs of users with whom the current user has direct conversations
    const directConversationsUserIds = new Set();

    Object.values(chats).forEach((chat) => {
      // Check if the chat is not a group; add users from direct conversations only
      if (!chat.conversationInfo.isGroup) {
        chat.conversationInfo.participants.forEach((participant) =>
          directConversationsUserIds.add(participant._id.toString())
        );
      }
    });

    // Filter out users that are already in a direct conversation
    return allUsers.filter(
      (user) => !directConversationsUserIds.has(user._id.toString())
    );
  }
);

// Inside chatSlice or a separate selectors file
export const selectChats = (state) => state.chat.chats;
export const selectActiveChatId = (state) => state.chat.activeChat;
export const selectActiveChatMessages = createSelector(
  [selectChats, selectActiveChatId],
  (chats, activeChatId) => {
    // This now returns the same reference if chats and activeChatId haven't changed

    return chats[activeChatId];
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [], // A Set of user IDs
    allUsers: [],
    chats: {},
    unreadMessages: {},
    activeChat: null,
    selectedTarget: null,
    lastMessageTimestamps: {},
    searchTerm: "",
    searchResults: null,
    foundMessage: null,
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;

      state.chats[action.payload].unreadCount = 0;
    },
    setFoundMessge: (state, action) => {
      state.foundMessage = action.payload;

      //state.chats[action.payload].unreadCount = 0;
    },
    setSelectTarget: (state, action) => {
      state.selectedTarget = action.payload;
      // Mark any unread messages for the active chat as read
      //     state.activeChat = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    markChatAsRead: (state, action) => {
      state.chats[action.payload].firstUnreadMessageId = null;
    },
    receiveMessage: (state, action) => {
      const { message, chatId, unreadCount } = action.payload;
      console.log("receiveMessage", message, chatId, unreadCount);

      const chat = state.chats[chatId] || {
        messages: [],
        isGroup: false,
        groupInfo: {},
        conversationInfo: {},
        unreadCount,
        firstUnreadMessageId: null,
        typing: {},
      };
      //  chat.messages.push(message);
      chat.lastMessageTimestamp = message.timestamp;
      chat.lastMessage = message;

      if (state.activeChat !== chatId) {
        if (!message.tempId) {
          state.chats[chatId].unreadCount += 1;
          // Avoid adding temp messages to unread
          // state.unreadMessages[chatId].push(message);
          if (!chat.firstUnreadMessageId) {
            chat.firstUnreadMessageId = message._id;
          }
        }
      }
      if (state.activeChat === chatId || chat.pageInfo) {
        if (message.tempId) {
          const tempIndex = chat.messages.findIndex(
            (m) => m.tempId === message.tempId
          );
          if (tempIndex !== -1) {
            // Replace the temporary message with the final one
            chat.messages[tempIndex] = message;
          } else {
            // In case tempId is provided but no matching message is found, just add the message
            chat.messages.push(message);
            //  chat.lastMessage = message;
          }
        } else {
          // This is a new message (not replacing a temp one), add it to the list
          chat.messages.push(message);
          // chat.lastMessage = message;
        }
      }

      chat.messages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      state.chats[chatId] = chat;
    },

    setAllUsers: (state, action) => {
      const updatedUsers = action.payload.map((user) => ({
        ...user,
        lastSeen: user.lastSeen || null, // Add null if lastSeen isn't provided
      }));
      state.allUsers = updatedUsers;
    },
    setUserTyping: (state, action) => {
      const { chatId, userId, typing } = action.payload;
      if (!state.chats[chatId]) {
        return;
      }
      if (typing) {
        // Set the typing user; assuming only one user can type at a time per chat
        state.chats[chatId].typing = userId;
      } else {
        // Check if the current typing user is the one who stops typing
        if (
          state.chats[chatId].typing &&
          state.chats[chatId].typing === userId
        ) {
          state.chats[chatId].typing = null; // No one is typing
        }
      }
    },
    updateUserStatus: (state, action) => {
      const { userId, isOnline, lastSeen } = action.payload;
      const users = state.allUsers.map((user) =>
        user._id === userId
          ? { ...user, isOnline, lastSeen: lastSeen || user.lastSeen }
          : user
      );

      state.allUsers = users;
      if (isOnline) {
        // Ensure the userId is not already in the onlineUsers array
        if (!state.onlineUsers.includes(userId)) {
          state.onlineUsers.push(userId);
        }
      } else {
        // Remove the userId from onlineUsers if present
        state.onlineUsers = state.onlineUsers.filter((id) => id !== userId);
      }
    },

    setChatHistory: (state, action) => {
      const {
        messages,
        chatId,
        currentUser,
        unreadCount,
        tempChatId,
        lastMessage,
        firstUnreadMessageId,
        lastMessageTimestamp,
        isNewChat,

        conversationInfo, // Assuming this now includes isGroup, groupInfo, and lastMessage info
      } = action.payload;
      let newChat;
      // Initialize the chat history for the chatId if it doesn't exist
      if (isNewChat && tempChatId && state.chats[tempChatId]) {
        // Migrate all messages and data from the temporary chat to the new chatId
        const tempIdsInNew = messages.map((msg) => msg.tempId);
        const oldMessges = [...state.chats[tempChatId].messages].filter(
          (oldMsg) => {
            return !tempIdsInNew.includes(oldMsg.tempId);
          }
        );
        // Combine new messages with old, excluding old messages with tempIds present in new messages

        const combinedMessages = [...oldMessges];

        newChat = {
          // ...state.chats[tempChatId],
          chatId,
          lastMessageTimestamp,
          conversationInfo,
          typing: {},
          messages: combinedMessages,
        };
        state.chats[chatId] = newChat;
        delete state.chats[tempChatId]; // Remove the temporary chat session
      } else {
        newChat = {
          messages: [],
          chatId,
          unreadCount,
          lastMessageTimestamp,
          conversationInfo,
          firstUnreadMessageId,
          typing: {},
          lastMessage,
        };
      }

      // Add messages to the chat history
      messages?.forEach((message) => {
        //  state.chats[chatId].messages.push(message);

        // Check if the message is read or sent by the currentUser
        if (!message.isRead && message.sender?._id !== currentUser) {
          // If the message is unread and not sent by currentUser, add to unreadMessages
          if (!state.unreadMessages[chatId]) {
            state.unreadMessages[chatId] = [];
          }
          state.unreadMessages[chatId].push(message);
        } else {
          newChat.messages.push(message);
        }
      });
      newChat.lastMessageTimestamp = lastMessageTimestamp;
      state.chats[chatId] = newChat;
    },
    updateChatData: (state, action) => {
      const { chatId, updatedData } = action.payload;
      if (updatedData.hasOwnProperty("messages")) {
        state.chats[chatId] = updatedData;
      } else {
        // Spread existing chat data and override with updatedData, but keep the original messages array.
        state.chats[chatId] = {
          ...state.chats[chatId],
          ...updatedData,
          messages: state.chats[chatId]?.messages || [],
        };
      }
    },
    replaceTempMessage: (state, action) => {
      const { chatId, tempId, finalMessage } = action.payload;
      const chat = state.chats[chatId];
      if (chat) {
        const index = chat.messages.findIndex((m) => m.tempId === tempId);
        if (index !== -1) {
          chat.messages[index] = finalMessage; // Replace temp message with final one
        }
      }
    },
    removeMessage: (state, action) => {
      const { chatId, tempId } = action.payload;
      console.log("removeMessage", chatId, tempId);
      const oldMessges = state.chats[chatId].messages;

      state.chats[chatId].messages = oldMessges.filter(
        (msg) => msg.tempId !== tempId
      );
    },
    addMessage: (state, action) => {
      const { chatId, message, participants } = action.payload;
      if (!state.chats[chatId]) {
        // Initialize chat if not existent
        state.chats[chatId] = {
          messages: [],
          chatId,
          lastMessageTimestamp: new Date().toISOString(),
          conversationInfo: { participants },
          typing: {},
        };
      }
      state.chats[chatId].messages.push(message);
    },
    setMessages: (state, action) => {
      const { chatId, messages, pageInfo, currentUser } = action.payload;
      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          messages: [],
          typing: {},
          pageInfo: {},
        };
      } else {
        // Log existing chat details if already initialized
        console.log(
          "Existing chat details for chatId:",
          chatId,
          state.chats[chatId]
        );
      }

      const newMsgs = [...messages, ...state.chats[chatId].messages];
      newMsgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      state.chats[chatId].messages = newMsgs;
      state.chats[chatId].pageInfo = pageInfo;
      state.chats[chatId].firstUnreadMessageId = pageInfo.firstUnreadMessageId;
    },
    removeChat: (state, action) => {
      const chatId = action.payload;
      if (state.chats[chatId]) {
        delete state.chats[chatId];
        // Optionally, handle any related cleanup, such as removing from the lastMessageTimestamps if necessary
      } else {
        console.warn(`Chat with ID ${chatId} not found and cannot be removed.`);
      }
    },

    setLoadingChatMessges: (state, action) => {
      const { chatId, loading } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].loading = loading;
        // Optionally, handle any related cleanup, such as removing from the lastMessageTimestamps if necessary
      }
    },
    // Add other reducers as necessary
  },
});

export const {
  setOnlineUsers,
  setActiveChat,
  receiveMessage,
  setChatHistory,
  setLoadingChatMessges,
  updateUserStatus,
  removeChat,
  setAllUsers,
  setSelectTarget,
  addMessage,
  removeMessage,
  updateChatData,
  replaceTempMessage,
  setMessages,
  markChatAsRead,
  setSearchTerm,
  setUserTyping,
  setFoundMessge,
  setSearchResults,
} = chatSlice.actions;

export default chatSlice.reducer;
