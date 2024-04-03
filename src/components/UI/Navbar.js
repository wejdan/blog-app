import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import GradientText from "./GradientText";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import Menu from "./Menu";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../hooks/auth/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import { usePost } from "../../context/PostContext";
import { debounce } from "lodash";
import { useCallback } from "react";

const SearchInput = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  // Debounced function
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`, {
        replace: true,
      });
    }, 500), // 500ms delay
    []
  );

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);

    debouncedSearch(value.trim());
  };

  return (
    <Input
      type="text"
      placeholder="Search..."
      value={inputValue}
      onChange={handleInputChange}
    />
  );
};
const Navbar = () => {
  const navigate = useNavigate();
  const { user, userData } = useSelector((state) => state.auth);

  const { post } = usePost(); // Access post data from context
  const { logout } = useAuth();
  const isAdmin = userData && userData.role === "admin";
  const location = useLocation(); // Hook to access the current location
  const isPostPage = location.pathname.startsWith("/posts/");
  const isEditPage = location.pathname.includes("/edit-post/");

  // Show the edit button if the user is an admin and the current page is either the post details or the edit page.
  const showEditButton =
    isAdmin && (isPostPage || isEditPage) && post && post.author === user;
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-semibold">
          <Link to="/">
            {" "}
            <h1 className="text-2xl font-bold">
              <GradientText className="text-2xl">Sahand's</GradientText>
              <span>Blog</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {showEditButton && (
            <Button
              variant={"outline"}
              onClick={() => {
                const editPageUrl = isEditPage
                  ? location.pathname
                  : `/edit-post/${post.id}`;
                navigate(editPageUrl);
              }} // Use post.slug or post.id as needed
            >
              Edit Post
            </Button>
          )}
          <div className="hidden sm:block">
            <SearchInput />
          </div>

          <Link to="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link to="/projects" className="hover:text-gray-300">
            Projects
          </Link>
          {!userData ? (
            <Button
              onClick={() => {
                navigate("/login");
              }}
              variant={"outline"}
            >
              Sign In
            </Button>
          ) : (
            <Menu>
              <Menu.Open>
                <span>
                  <Avatar imageUrl={userData.profileImg} size="8" />
                </span>
              </Menu.Open>
              <Menu.MenuItems>
                {isAdmin && (
                  <Menu.Item
                    onClick={() => navigate("/dashboard?tab=dashboard")}
                  >
                    <div className="hover:text-gray-600 dark:hover:text-gray-300 flex items-center">
                      Dashboard
                    </div>
                  </Menu.Item>
                )}
                <Menu.Item onClick={() => navigate("/profile")}>
                  <div className="hover:text-gray-600 dark:hover:text-gray-300 flex items-center">
                    Profile
                  </div>
                </Menu.Item>

                <Menu.Item onClick={logout}>
                  <div className="hover:text-gray-600 dark:hover:text-gray-300 w-full flex items-center">
                    Logout
                  </div>
                </Menu.Item>
              </Menu.MenuItems>
            </Menu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
