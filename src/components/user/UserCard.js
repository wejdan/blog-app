import React from "react";
import Avatar from "../UI/Avatar";

function UserCard({ user, onClick, isSelected }) {
  return (
    <div
      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 ${
        isSelected ? "border-2 border-blue-500" : ""
      }`} // Conditionally apply a border if selected
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="relative">
          <Avatar imageUrl={user.profileImg} size="8" />
        </div>
        <div className="flex-1 min-w-0 ml-4">
          <p className="text-sm font-semibold truncate">{user.name}</p>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
