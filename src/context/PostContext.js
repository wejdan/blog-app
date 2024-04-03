// Create a context in a separate file, e.g., PostContext.js
import { createContext, useContext, useState } from "react";

const PostContext = createContext();

export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [post, setPost] = useState(null);

  return (
    <PostContext.Provider value={{ post, setPost }}>
      {children}
    </PostContext.Provider>
  );
};
