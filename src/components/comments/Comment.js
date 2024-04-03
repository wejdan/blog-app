import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize"; // You can install react-textarea-autosize for auto resizing textarea
import { useLikeComment } from "../../hooks/comments/useLikeComment";
import { FaThumbsUp } from "react-icons/fa";
const Comment = ({ commentData, onDelete, onUpdate, postId }) => {
  const { user, userData } = useSelector((state) => state.auth);
  const isAdmin = userData && userData.role === "admin";
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState(commentData.body);
  const [isLiked, setIsLiked] = useState(commentData.likes.includes(user?.uid));
  const likeCommentMutation = useLikeComment();

  useEffect(() => {
    setIsLiked(commentData.likes.includes(user?.uid));
  }, [commentData.likes, user?.uid]);

  const handleLikeToggle = () => {
    likeCommentMutation.mutateAsync({
      postId,
      commentId: commentData._id,
      like: !isLiked,
    });
    setIsLiked(!isLiked); // Optimistically update the UI
  };
  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    onUpdate({ body: editedComment });
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedComment(commentData.body); // Reset to original comment if cancelled
    setEditMode(false);
  };

  return (
    <div className="flex items-start space-x-4 p-4">
      <img
        src={commentData.author.profileImg}
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="text-sm font-semibold">{commentData.author.name}</div>
        {editMode ? (
          <>
            <TextareaAutosize
              className="w-full px-4 py-2   bg-gray-700 text-white rounded-md focus:border-pink-500 focus:outline-none"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={handleSave}
                className="text-blue-600 hover:text-blue-800"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-red-600 hover:text-red-800"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700">{commentData.body}</p>
            <div className="flex items-center text-gray-500 text-xs mt-2">
              <span>
                {new Date(commentData.createdAt).toLocaleDateString()}
              </span>
              {user && (
                <button
                  onClick={handleLikeToggle}
                  className="ml-4 flex items-center"
                >
                  {" "}
                  <span>{commentData.likes.length}</span>
                  <FaThumbsUp
                    className={`ml-1 ${
                      isLiked ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                </button>
              )}
              {(isAdmin || commentData.author._id === user?.uid) && (
                <>
                  <button onClick={handleEdit} className="ml-2">
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(commentData._id);
                    }}
                    className="ml-2"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
