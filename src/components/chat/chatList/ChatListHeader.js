import { SearchIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import HeaderMenu from "./HeaderMenu";
import Avatar from "../../UI/Avatar";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../UI/Input"; // Assuming Input is a styled input component
import { setFoundMessge, setSearchTerm } from "../../../store/chatSlice";
import { useSocketContext } from "../../../context/SocketContext";

function ChatListHeader({ onCreateGroup }) {
  const { userData } = useSelector((state) => state.auth);
  const { searchTerm } = useSelector((state) => state.chat);
  const { searchMessages } = useSocketContext();

  const dispatch = useDispatch();

  const clearSearch = () => {
    dispatch(setSearchTerm(""));
    dispatch(setFoundMessge(null));
  };
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    dispatch(setSearchTerm(searchTerm));
    searchMessages(searchTerm);
  };
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800">
      <div className="flex items-center space-x-3">
        <Avatar imageUrl={userData.profileImg} size="8" />
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <div className="relative flex items-center space-x-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search"
            className="pl-10"
            style={{ minWidth: "200px" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {/* {searchTerm ? (
            <ArrowLeftIcon
              className="h-6 w-6 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-300 cursor-pointer"
              onClick={clearSearch}
            />
          ) : (
            <SearchIcon className="h-6 w-6 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-300" />
          )} */}
          <SearchIcon
            className={`absolute left-2 top-1/2 transform -translate-y-1/2  h-6 w-6 transition-transform  duration-300 ${
              searchTerm ? "scale-0" : "scale-100"
            }`}
            style={{
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          />
          <ArrowLeftIcon
            className={`absolute left-2 top-1/2 transform -translate-y-1/2  h-6 w-6 cursor-pointer transition-transform  duration-300 ${
              searchTerm ? "scale-100" : "scale-0"
            }`}
            onClick={clearSearch}
            style={{
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </div>

        <HeaderMenu onCreateGroup={onCreateGroup} />
      </div>
    </div>
  );
}

export default ChatListHeader;
