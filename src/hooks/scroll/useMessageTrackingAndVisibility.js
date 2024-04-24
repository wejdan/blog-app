import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";

export function useMessageTrackingAndVisibility(
  messages,
  scrollTo,
  totalImages,
  loadedImages,
  isInitialLoaded
) {
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);
  const [doneScrolling, setIsDoneScrolling] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState(scrollTo);

  const firstUnreadMessageRef = useRef(null);
  const messageEndRef = useRef(null);
  const lastMsgRef = useCallback(
    (node) => {
      if (!node) return;
      if (
        !doneScrolling &&
        (totalImages === loadedImages || totalImages === 0) &&
        isInitialLoaded
      ) {
        node.scrollIntoView({ behavior: "smooth" });
        setLastSeenMessageId(node.id);
        setIsDoneScrolling(true);
      }
    },
    [doneScrolling, totalImages, loadedImages, isInitialLoaded]
  );
  const checkForNewMessages = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastSeenMessageId !== lastMessage?._id && lastMessage?._id) {
      setNewMessagesCount((prevCount) => prevCount + 1);
      if (!firstUnreadMessageId || firstUnreadMessageId === scrollTo) {
        setFirstUnreadMessageId(lastMessage?._id);
      }
    }
  };
  useLayoutEffect(() => {
    const lastMessageId = messages[messages.length - 1]?._id;
    if (lastMessageId && lastMessageId !== lastSeenMessageId) {
      setLastSeenMessageId(lastMessageId);
    }
  }, [messages, lastSeenMessageId]);

  return {
    firstUnreadMessageRef,
    messageEndRef,
    lastMsgRef,
    newMessagesCount,
    setNewMessagesCount,
    firstUnreadMessageId,
    setFirstUnreadMessageId,
    lastSeenMessageId,
    doneScrolling,
    setIsDoneScrolling,

    checkForNewMessages,
  };
}
