import { useRef, useState, useCallback, useLayoutEffect } from "react";

export function useScroll(
  messages,
  loadMoreMessages,
  loadPrevMessages,
  hasNextPage,
  scrollToBottom,

  checkForNewMessages
) {
  const listInnerRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleScroll = useCallback(() => {
    const isAtTop = listInnerRef.current.scrollTop === 0;
    const scrollAtBottom =
      listInnerRef.current.scrollHeight - listInnerRef.current.scrollTop <=
      listInnerRef.current.clientHeight + 10;

    setIsAtBottom(scrollAtBottom);
    const loadPrevPage =
      listInnerRef.current.scrollHeight - listInnerRef.current.scrollTop <=
      listInnerRef.current.clientHeight + 600;
    if (isAtTop && !loading && hasNextPage) {
      console.log("At toop");

      prevScrollHeight.current = listInnerRef.current.scrollHeight;
      setLoading(true);
      loadMoreMessages(() => {
        const currentScrollHeight = listInnerRef.current.scrollHeight;
        const scrollOffset = currentScrollHeight - prevScrollHeight.current;
        listInnerRef.current.scrollTop = scrollOffset;
        setLoading(false);
      });
    }
    if (loadPrevPage && !loading) {
      console.log("near bottom");
      const scrollPositionBeforeLoad = listInnerRef.current.scrollTop;

      //setLoading(true);
      loadPrevMessages(() => {
        // listInnerRef.current.scrollTop = scrollPositionBeforeLoad;
        // setLoading(false);
      });
    }
  }, [hasNextPage, loadMoreMessages, loading]);
  const lastMessage = messages[messages.length - 1];

  useLayoutEffect(() => {
    if (isAtBottom) {
      if (lastMessage?.type === "image") {
        const img = new Image();
        img.onload = () => {
          scrollToBottom();
        };
        img.src = lastMessage.imageUrl;
      } else {
        scrollToBottom();
      }
    } else {
      checkForNewMessages();
    }
  }, [lastMessage, scrollToBottom, checkForNewMessages]);
  return { listInnerRef, isAtBottom, handleScroll, loading };
}
