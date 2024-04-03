import React, { useState } from "react";
import TextArea from "../UI/TextArea";
import Button from "../UI/Button";
import { useSelector } from "react-redux";
import Avatar from "../UI/Avatar";
import { useCreateComment } from "../../hooks/comments/useAddComment";

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState("");
  const { user, userData } = useSelector((state) => state.auth);
  const createCommentMutation = useCreateComment();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      createCommentMutation.mutateAsync({
        postId,
        commentData: { body: comment },
      });
      setComment("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto ">
      <div className="flex items-center mb-4">
        <span className="text-gray-500 mr-1  text-sm">Signed in as : </span>
        <Avatar imageUrl={userData.profileImg} size="5" />
        <span className="ml-1 text-blue-500 cursor-pointer">
          @{userData.name}
        </span>
      </div>
      <div className="rounded-md border border-blue-500  p-4">
        <div className="mb-4">
          <TextArea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={200}
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="text-right text-sm text-gray-500 mt-1">
            {200 - comment.length} characters remaining
          </div>
          <Button
            isLoading={createCommentMutation.isPending}
            variant={"outline"}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
