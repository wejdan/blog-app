import "./App.css";
import "./quill.css"; // import styles

import toast, { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./Main";
import { PostProvider } from "./context/PostContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents queries from refetching on window focus
    },
    onError: (error, query) => {
      if (query.meta.errorMessage) {
        toast.error(query.meta.errorMessage);
      }
    },
  },
});

function App() {
  return (
    <PostProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Main />
      </QueryClientProvider>{" "}
    </PostProvider>
  );
}

export default App;
