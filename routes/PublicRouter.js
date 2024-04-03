import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/Singup";
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";
import PostDetails from "../pages/PostDetails";
import PostsByCategory from "../pages/PostsByCategory";

const PublicRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:slug" element={<PostDetails />} />
        <Route path="/category/:categoryId" element={<PostsByCategory />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* Additional shared routes */}
      </Routes>
    </Router>
  );
};

export default PublicRouter;
