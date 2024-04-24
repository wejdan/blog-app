import { useState, useCallback, useEffect, useLayoutEffect } from "react";

export function useImageLoad(messages) {
  const [loadedImages, setLoadedImages] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const handleImageLoaded = useCallback(() => {
    setLoadedImages((prev) => prev + 1);
  }, []);

  useLayoutEffect(() => {
    if (!isInitialLoaded && messages.length > 0) {
      const totalImg = messages.reduce((count, msg) => {
        if (msg.type === "image") return count + 1;
        return count;
      }, 0);

      setTotalImages(totalImg);
      setLoadedImages(0); // Reset the loaded images count
      setIsInitialLoaded(true); // Ensure this block won't run again unless component is remounted
    }
  }, [messages, isInitialLoaded]);

  return { totalImages, isInitialLoaded, loadedImages, handleImageLoaded };
}
