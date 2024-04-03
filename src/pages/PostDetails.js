import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/UI/Loader";
import parse from "html-react-parser"; // You might need to install this package
import { useGetPost } from "../hooks/posts/useGetPostDetails";
import { usePost } from "../context/PostContext";
import { useEffect } from "react";
import CommentSection from "../components/comments/CommentSection";
import { useGetPostComments } from "../hooks/comments/useGetPostComments";
import { useSelector } from "react-redux";
import Comment from "../components/comments/Comment";
import ConfirmModal from "../components/UI/ConfirmModal";
import { useDeleteComment } from "../hooks/comments/useDeleteComment";
import { useEditComment } from "../hooks/comments/useEditComment";

function PostDetails() {
  const { slug } = useParams();
  const { user, userData } = useSelector((state) => state.auth);
  const [showConfirmation, setShowCofirmation] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const deleteCommentMutation = useDeleteComment();
  const updateCommentMutation = useEditComment();

  const { isLoading, data, error } = useGetPost("slug", slug);
  const { setPost } = usePost();
  const { data: commentsList, isLoading: isLoadingComments } =
    useGetPostComments(data?.id);
  useEffect(() => {
    if (data) {
      setPost(data); // Setting the post data in context
    }
    return () => {
      setPost(null); // Cleanup function to reset post data when navigating away
    };
  }, [data, setPost]);
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Failed to load post details.
      </div>
    );
  }

  if (!data) {
    return <div className="text-center">Post not found.</div>;
  }

  return (
    <div>
      {/* Cover image with title and category */}
      <div
        className="relative bg-cover bg-center bg-no-repeat h-96 w-full"
        style={{ backgroundImage: `url(${data.coverImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-2 text-white text-center">
            {data.title}
          </h1>
          <p className="text-md text-gray-300 text-center">{data.category}</p>
        </div>
      </div>

      {/* Post content */}
      <div className="max-w-4xl mx-auto p-6 mt-8 mb-5 ">
        <div dangerouslySetInnerHTML={{ __html: data.body }} />
      </div>
      {userData && user && <CommentSection postId={data.id} />}
      {commentsList && (
        <div className="max-w-2xl mx-auto my-4">
          <h3 className="font-bold mb-3">
            {`${commentsList.comments.length} ${
              commentsList.comments.length > 1 ? "Comments" : "Comment"
            }`}
          </h3>
          {commentsList.comments.length > 0 ? (
            commentsList.comments.map((comment) => (
              <Comment
                key={comment._id}
                postId={data.id}
                commentData={comment}
                onDelete={(comment) => {
                  setSelectedComment(comment);
                  setShowCofirmation(true);
                }}
                onUpdate={(updatedCommentData) => {
                  updateCommentMutation.mutateAsync({
                    postId: data.id,
                    commentId: comment._id,
                    updatedCommentData,
                  });
                }}
              />
            ))
          ) : (
            <div className="text-gray-500 mt-2">No comments yet.</div>
          )}
        </div>
      )}

      <ConfirmModal
        onConfirm={async () => {
          try {
            await deleteCommentMutation.mutateAsync({
              postId: data.id,
              commentId: selectedComment,
            });
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

export default PostDetails;
