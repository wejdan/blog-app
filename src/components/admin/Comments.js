import React from "react";
import Button from "../UI/Button";
import { Link, useNavigate } from "react-router-dom";
import Table from "../UI/Table";
import Menu from "../UI/Menu";
import { FiCopy, FiEdit, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { BiLinkExternal, BiLogOut, BiSolidCheckCircle } from "react-icons/bi";
import { HiEye } from "react-icons/hi2";
import Loader from "../UI/Loader";
import { useState } from "react";
import ReactModal from "react-modal";
import ConfirmModal from "../UI/ConfirmModal";
import { useDeletePost } from "../../hooks/posts/useDeletePost";
import { useDeleteComment } from "../../hooks/comments/useDeleteComment";
import { useGetAllComments } from "../../hooks/comments/useGetAllComments";

function Comments() {
  const navigate = useNavigate();
  const [showConfirmation, setShowCofirmation] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const deleteCommentMutation = useDeleteComment();
  const { isLoading, data: commentsList } = useGetAllComments();
  const columns = [
    {
      Header: "Date Updated",
      accessor: "updatedAt", // accessor is the "key" in the data
    },
    {
      Header: "Comment Content",
      accessor: "body",
    },
    {
      Header: "Number of likes",
      accessor: "likes",
      Cell: ({ row }) => <span>{row.original.likes.length}</span>,
    },
    {
      Header: "post id",
      accessor: "post.title",
    },
    {
      Header: "user id",
      accessor: "author.name",
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
                setSelectedComment({
                  postId: row.original.post._id,
                  commentId: row.original._id,
                });
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

  const comments = commentsList?.comments || [];
  // ...rest of your component
  return (
    <div className="w-full flex flex-col pt-12 ">
      {isLoading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <Table columns={columns} data={comments} />
      )}

      <ConfirmModal
        onConfirm={async () => {
          try {
            await deleteCommentMutation.mutateAsync(selectedComment);
            setSelectedComment(false);
            setShowCofirmation(null);
          } catch (error) {}
        }}
        isLoading={deleteCommentMutation.isPending}
        isOpen={showConfirmation}
        onRequestClose={() => {
          setShowCofirmation(false);
          setSelectedComment(null);
        }}
      />
    </div>
  );
}

export default Comments;
