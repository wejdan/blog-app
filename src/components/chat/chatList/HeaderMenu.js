import React from "react";
import Menu from "../../UI/Menu";
import { DotsVerticalIcon } from "@heroicons/react/outline";

function HeaderMenu({ onCreateGroup }) {
  return (
    <Menu>
      <Menu.Open>
        <DotsVerticalIcon className="h-6 w-6 cursor-pointer" />
      </Menu.Open>
      <Menu.MenuItems>
        <Menu.Item onClick={onCreateGroup}>
          <span> Create Group </span>
        </Menu.Item>
      </Menu.MenuItems>
    </Menu>
  );
}

export default HeaderMenu;
