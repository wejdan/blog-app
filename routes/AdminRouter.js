// AdminRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import PostDetails from "./pages/PostDetails";

const AdminRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/posts/create" element={<CreatePostPage />} />
        <Route path="/posts/edit/:postId" element={<EditPostPage />} />
        <Route path="/posts/:slug" element={<PostDetails />} />
        {/* Add other admin-specific routes here */}
      </Routes>
    </Router>
  );
};

export default AdminRouter;
