// ChatItem.js
import React from "react";
import Avatar from "../../UI/Avatar";

const UserItem = ({ user, isActive, onClick, isOnline }) => {
  return (
    <div
      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 ${
        isActive ? "bg-gray-600" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="relative">
          <Avatar imageUrl={user.profileImg} size="8" />
          {isOnline && (
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" />
          )}
        </div>
        <div className="flex-1 min-w-0 ml-4">
          <p className="text-sm font-semibold truncate">{user.name}</p>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
