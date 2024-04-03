import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Users from "../components/admin/Users";
import Posts from "../components/admin/Posts";
import Comments from "../components/admin/Comments";
import Media from "../components/admin/Media";
import { useSelector } from "react-redux";

// Mock components for different tabs
const ProfileContent = () => <div>Profile Content</div>;
const DashboardContent = () => <div>Dashboard Content</div>;

// Main dashboard component
const DashboardPage = () => {
  const auth = useSelector((state) => state.auth);
  console.log("------------------------------------", auth);
  // State to hold the current tab content
  const [content, setContent] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get the tab query param
    const tab = searchParams.get("tab");

    // Set the content based on the current tab
    switch (tab) {
      case "profile":
        setContent(<ProfileContent />);
        break;
      case "users":
        setContent(<Users />);
        break;
      case "posts":
        setContent(<Posts />);
        break;
      case "comments":
        setContent(<Comments />);
        break;
      case "media":
        setContent(<Media />);
        break;
      default:
        setContent(<DashboardContent />);
    }
  }, [searchParams]);

  return (
    <div className="flex ">
      <Sidebar /> {/* This is your sidebar component */}
      <main className="flex-1">
        <div className="p-10">{content}</div>
      </main>
    </div>
  );
};

export default DashboardPage;
