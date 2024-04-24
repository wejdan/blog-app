// ChatItem.js
import React from "react";
import Avatar from "../../UI/Avatar";
import Menu from "../../UI/Menu";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import { useSocketContext } from "../../../context/SocketContext";

const GroupChatItem = ({
  chat,
  isActive,
  onClick,

  unreadMessageCount,
  onClickGroupInfo,
  typing,
}) => {
  const handleMenuItemClick = () => {
    onClickGroupInfo(chat.groupId);
  };

  const { user } = useSelector((state) => state.auth);
  const { exitGroup } = useSocketContext();
  return (
    <div
      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 ${
        isActive ? "bg-gray-600" : ""
      }`}
    >
      <div onClick={onClick} className="flex items-center">
        <div className="relative">
          <Avatar imageUrl={chat.groupImage} size="8" />
        </div>
        <div className="flex-1 min-w-0 ml-4">
          <p className="text-sm font-semibold truncate">{chat.name}</p>
          <p className="text-xs h-2">{typing ? typing : chat.lastMessage}</p>
        </div>
      </div>

      <div className="flex">
        {unreadMessageCount > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-500 rounded-full">
            {unreadMessageCount}
          </span>
        )}
        <Menu>
          <Menu.Open>
            <DotsVerticalIcon className="h-6 w-6 cursor-pointer" />
          </Menu.Open>
          <Menu.MenuItems>
            {user === chat.admin._id && (
              <Menu.Item onClick={handleMenuItemClick}>
                <span> Edit Group </span>
              </Menu.Item>
            )}
            <Menu.Item>
              <span> Group Info </span>
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                exitGroup({ groupId: chat.groupId });
              }}
            >
              <span> Exit Chat </span>
            </Menu.Item>
          </Menu.MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default GroupChatItem;
