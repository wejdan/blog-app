import React from "react";
import Button from "../UI/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaCheck } from "react-icons/fa";

import Table from "../UI/Table";
import Menu from "../UI/Menu";
import { FiCopy, FiEdit, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { BiLinkExternal, BiLogOut, BiSolidCheckCircle } from "react-icons/bi";
import { HiEye } from "react-icons/hi2";
import Loader from "../UI/Loader";
import { useState } from "react";
import ReactModal from "react-modal";
import ConfirmModal from "../UI/ConfirmModal";
import { useDeleteUser } from "../../hooks/users/useDeleteUser";
import { useGetAllUsers } from "../../hooks/users/useGetAllusers";

function Users() {
  const navigate = useNavigate();
  const [showConfirmation, setShowCofirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const deleteUserMutation = useDeleteUser();
  const { isLoading, data: usersList } = useGetAllUsers();
  const columns = [
    {
      Header: "Date Created",
      accessor: "signUpDate", // accessor is the "key" in the data
    },
    {
      Header: "User Image",
      accessor: "profileImg",
      Cell: ({ cell: { value } }) => (
        <img src={value} alt="User" className="w-10 h-10 rounded" />
      ),
    },
    {
      Header: "USER NAME",
      accessor: "name",
    },
    {
      Header: "email",
      accessor: "email",
    },
    {
      Header: "admin",
      accessor: "role",
      Cell: ({ row }) =>
        row.original.role === "admin" ? (
          <FaCheck className="text-green-500" />
        ) : (
          <FaTimes className="text-red-500" />
        ),
    },

    {
      Header: "", // This is for the action icons/buttons
      accessor: "actions",
      Cell: ({ row }) => (
        <Menu>
          <Menu.Open>
            <FiMoreVertical scale={2} className="cursor-pointer text-white" />
          </Menu.Open>
          <Menu.MenuItems>
            <Menu.Item
              onClick={() => {
                setShowCofirmation(true);
                setSelectedUser(row.original._id);
              }}
              icon={<FiTrash2 className="text-gray-500" />}
            >
              <span> Delete </span>
            </Menu.Item>
          </Menu.MenuItems>
        </Menu>
      ),
    },
  ];

  // Sample data
  // Sample dummy data

  const users = usersList?.users || [];
  // ...rest of your component
  return (
    <div className="w-full flex flex-col pt-12 ">
      {isLoading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <Table columns={columns} data={users} />
      )}

      <ConfirmModal
        onConfirm={async () => {
          try {
            await deleteUserMutation.mutateAsync(selectedUser);
            setSelectedUser(null);
            setShowCofirmation(null);
          } catch (error) {}
        }}
        isLoading={deleteUserMutation.isPending}
        isOpen={showConfirmation}
        onRequestClose={() => {
          setShowCofirmation(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}

export default Users;
