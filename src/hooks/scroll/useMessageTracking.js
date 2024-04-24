import { useState, useEffect, useRef } from "react";

export function useMessageTracking(messages, scrollTo) {
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const firstUnreadMessageRef = useRef(null);
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState(scrollTo);

  const messageEndRef = useRef(null);

  useEffect(() => {
    const lastMessageId = messages[messages.length - 1]?._id;
    if (lastMessageId && lastMessageId !== lastSeenMessageId) {
      setLastSeenMessageId(lastMessageId);
    }
  }, [messages, lastSeenMessageId]);

  return {
    firstUnreadMessageRef,
    messageEndRef,
    newMessagesCount,
    setNewMessagesCount,
    lastSeenMessageId,
    firstUnreadMessageId,
    setFirstUnreadMessageId,
  };
}
