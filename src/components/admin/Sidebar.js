import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaComments,
  FaUsers,
  FaNewspaper,
  FaSignOutAlt,
  FaImages,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  // Helper function to determine if the link is active based on the current tab
  const isActiveTab = (tabName) => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") === tabName;
  };

  return (
    <aside className="w-64 " aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 bg-gray-800 h-full min-h-screen">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard?tab=dashboard"
              className={({ isActive }) =>
                `flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 ${
                  isActiveTab("dashboard") ? "bg-gray-700" : ""
                }`
              }
            >
              <FaTachometerAlt className="text-white text-lg mr-3" />
              Dashboard
            </NavLink>
          </li>
          {/* Other navigation items */}
          <li>
            <NavLink
              to="/dashboard?tab=profile"
              className={({ isActive }) =>
                `flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 ${
                  isActiveTab("profile") ? "bg-gray-700" : ""
                }`
              }
            >
              <FaUser className="text-white text-lg mr-3" />
              Profile
              <span className="bg-red-500 text-xs rounded-full px-2 ml-auto">
                Admin
              </span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard?tab=comments"
              className={({ isActive }) =>
                `flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 ${
                  isActiveTab("comments") ? "bg-gray-700" : ""
                }`
              }
            >
              <FaComments className="text-white text-lg mr-3" />
              Comments
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard?tab=users"
              className={({ isActive }) =>
                `flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 ${
                  isActiveTab("users") ? "bg-gray-700" : ""
                }`
              }
            >
              <FaUsers className="text-white text-lg mr-3" />
              Users
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard?tab=posts"
              className={({ isActive }) =>
                `flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 ${
                  isActiveTab("posts") ? "bg-gray-700" : ""
                }`
              }
            >
              <FaNewspaper className="text-white text-lg mr-3" />
              Posts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard?tab=media"
              className={({ isActive }) =>
                `flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 ${
                  isActiveTab("media") ? "bg-gray-700" : ""
                }`
              }
            >
              <FaImages className="text-white text-lg mr-3" />
              Media
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/signout"
              className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700"
            >
              <FaSignOutAlt className="text-lg mr-3" />
              Sign out
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
