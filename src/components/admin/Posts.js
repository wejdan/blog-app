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
import { useGetPosts } from "../../hooks/posts/useGetPosts";
import Pagination from "../UI/Pagination";

function Posts() {
  const navigate = useNavigate();
  const [showConfirmation, setShowCofirmation] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [page, setPage] = useState(1);
  const deletePostMutation = useDeletePost();
  const { isLoading, data: postsList } = useGetPosts("", page);
  const columns = [
    {
      Header: "Date Updated",
      accessor: "updatedAt", // accessor is the "key" in the data
    },
    {
      Header: "Post Image",
      accessor: "coverImage",
      Cell: ({ cell: { value } }) => (
        <img src={value} alt="Post" className="w-10 h-10 rounded" />
      ),
    },
    {
      Header: "Post Title",
      accessor: "title",
    },
    {
      Header: "Category",
      accessor: "category",
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
                navigate(`/posts/${row.original.slug}`);
              }}
              icon={<HiEye className="text-gray-500" />}
            >
              <span> View</span>
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                navigate(`/edit-post/${row.original.id}`);
              }}
              icon={<FiEdit className="text-gray-500" />}
            >
              <span> Edit</span>
            </Menu.Item>

            <Menu.Item
              onClick={() => {
                setShowCofirmation(true);
                setSelectedPost(row.original.id);
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

  const posts = postsList?.posts || [];
  // ...rest of your component

  return (
    <div className="w-full flex flex-col ">
      <Button
        className={"mb-5 self-end"}
        variant={"outline"}
        onClick={() => {
          navigate("/create-post");
        }}
      >
        Create Post
      </Button>
      {isLoading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <>
          <Table columns={columns} data={posts} />
          <Pagination
            currentPage={page}
            setPage={setPage}
            totalPages={postsList?.totalPages}
          />
        </>
      )}

      <ConfirmModal
        onConfirm={async () => {
          try {
            await deletePostMutation.mutateAsync(selectedPost);
            setSelectedPost(false);
            setShowCofirmation(null);
          } catch (error) {}
        }}
        isLoading={deletePostMutation.isPending}
        isOpen={showConfirmation}
        onRequestClose={() => {
          setShowCofirmation(false);
          setSelectedPost(null);
        }}
      />
    </div>
  );
}

export default Posts;
