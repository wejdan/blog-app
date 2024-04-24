export function formatLastMessage(lastMessage, isGroup, currentUser) {
  if (!lastMessage) return "";

  let displayMessage = "";

  // Check if the message is an image

  if (lastMessage.type === "image") {
    displayMessage = "📷 Photo";
  } else if (lastMessage.type === "file") {
    displayMessage = lastMessage.fileMetadata.name;
  } else if (lastMessage.type === "system") {
    displayMessage = constructMessage(lastMessage, currentUser);
  } else {
    // It's a text message or other non-image type
    displayMessage = lastMessage.content;
  }

  // If it's a group, prepend the sender's name
  if (isGroup && lastMessage.sender && lastMessage.type !== "system") {
    displayMessage = `${
      lastMessage.sender._id === currentUser ? "You " : lastMessage.sender.name
    }: ${displayMessage}`;
  }

  return displayMessage;
}

export function formatParticipantNames(participants) {
  if (!participants || participants.length === 0) {
    return "No participants";
  }

  // Join all names with a comma and space, but you can modify the logic to add "and" before the last name, etc.
  const names = participants.map((participant) => participant.name);

  // If the list is too long, you might want to truncate it to the first few and add something like "and X more..."
  if (names.length > 3) {
    const visibleNames = names.slice(0, 3);
    const moreCount = names.length - 3;
    return `${visibleNames.join(", ")} and ${moreCount} more...`;
  } else {
    return names.join(", ");
  }
}
export function getFirstMessageOfCurrentPage(currentChat) {
  if (!currentChat || !currentChat.messages || !currentChat.pageInfo) {
    console.log("Chat data is incomplete.");
    return null;
  }
  const pageSize = 20; // The number of messages per page
  const currentPage = currentChat.pageInfo.currentPage;
  if (currentPage === 1) {
    return;
  }
  // Calculate the ending index of the current page in normal order
  const endIndex = currentChat.messages.length - (currentPage - 1) * pageSize;

  // Calculate the starting index in reversed list
  const startIndex = Math.max(0, endIndex - pageSize);

  // Check if the start index is within the bounds of the messages array
  if (startIndex < currentChat.messages.length) {
    return currentChat.messages[startIndex]?._id;
  } else {
    console.log("No message at the calculated start index.");
    return null;
  }
}

// Example usage

// Helper to find the typing user's name for group chats
function getTypingStatus(chat, currentUser) {
  if (chat.typing) {
    const typingUser = chat.conversationInfo.participants.find(
      (p) => p._id === chat.typing
    );
    if (typingUser && typingUser._id !== currentUser) {
      return `${typingUser.name} is typing...`;
    }
  }
  return "";
}

// Helper to find the other participant in a non-group chat
function getOtherParticipant(chat, currentUser) {
  return chat.conversationInfo.participants.find((p) => p._id !== currentUser);
}

// Helper to find user's last seen status
function getLastSeen(allUsers, userId) {
  const user = allUsers?.find((u) => u._id === userId);
  return user ? user.lastSeen : undefined;
}
export function formatLastMessageTimestamp(timestamp) {
  if (!timestamp) return "";

  const lastMessageDate = new Date(timestamp);
  const now = new Date();

  const dayDiff = (now - lastMessageDate) / (1000 * 60 * 60 * 24);

  if (dayDiff < 1 && now.getDate() === lastMessageDate.getDate()) {
    // Same day
    return `${lastMessageDate.getHours()}:${String(
      lastMessageDate.getMinutes()
    ).padStart(2, "0")}`;
  } else if (dayDiff < 2 && now.getDate() - lastMessageDate.getDate() === 1) {
    // Yesterday
    return "Yesterday";
  } else {
    // Other days
    return `${lastMessageDate.getDate()}/${
      lastMessageDate.getMonth() + 1
    }/${lastMessageDate.getFullYear()}`;
  }
}
export const constructMessage = (msg, currentUser) => {
  const isUsersList = msg.effect.isUser;
  const effect = isUsersList
    ? msg.effect.users.map((u) =>
        u._id === currentUser ? "You " : u.name + " "
      )
    : msg.effect.data;
  const content = `${
    msg.sender._id === currentUser ? "You" : msg.sender.name
  } ${msg.action} ${effect}`;
  return content;
};
export const getChatData = (chat, currentUser, allUsers) => {
  if (!chat) return null;
  const lastMessage =
    chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]
      : chat.lastMessage;
  const formattedLastMessage = formatLastMessage(
    lastMessage,
    chat.conversationInfo.isGroup,
    currentUser
  );
  const lastMessageTime = formatLastMessageTimestamp(chat.lastMessageTimestamp);
  if (chat.conversationInfo.isGroup) {
    const typingStatus = getTypingStatus(chat, currentUser);

    return {
      name: chat.conversationInfo.groupName,
      groupImage: chat.conversationInfo.groupImage, // Assuming group chats have a `groupImage`.
      isGroup: true,
      participants: chat.conversationInfo.participants,
      groupId: chat.chatId,
      admin: chat.conversationInfo.admin,
      unreadCount: chat.unreadCount,
      typingStatus,
      lastMessage: formattedLastMessage,
      lastMessageTime,
    };
  } else {
    const otherParticipant = getOtherParticipant(chat, currentUser);
    const typing = chat.typing === otherParticipant._id;
    const lastSeen = getLastSeen(allUsers, otherParticipant._id);

    return {
      ...otherParticipant,
      isGroup: false,
      unreadCount: chat.unreadCount,
      typing,
      lastSeen,
      lastMessage: formattedLastMessage,
      lastMessageTime,
    };
  }
};

export function formatLastSeen(lastSeenTimestamp) {
  if (!lastSeenTimestamp) return "Unavailable";

  const lastSeenDate = new Date(lastSeenTimestamp);
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const dayDiff = (now - lastSeenDate) / (1000 * 60 * 60 * 24);

  if (dayDiff < 1 && now.getDate() === lastSeenDate.getDate()) {
    // Same day
    return `Today at ${formatter.format(lastSeenDate)}`;
  } else if (dayDiff < 2 && now.getDate() - lastSeenDate.getDate() === 1) {
    // Yesterday
    return `Yesterday at ${formatter.format(lastSeenDate)}`;
  } else {
    // Other days
    const dayOfWeekFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    });
    return `${dayOfWeekFormatter.format(lastSeenDate)} at ${formatter.format(
      lastSeenDate
    )}`;
  }
}
