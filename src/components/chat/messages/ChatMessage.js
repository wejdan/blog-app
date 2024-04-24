import React, { useState } from "react";
import Avatar from "../../UI/Avatar";
import Loader from "../../UI/Loader"; // Assuming Loader is a component that renders a loading indicator
import ImageViewer from "./ImageViewer";
import { useSelector } from "react-redux";
import { DocumentIcon } from "@heroicons/react/outline";

const ChatMessage = React.forwardRef(
  (
    {
      content,
      type,
      imageUrl,
      timestamp,
      sender,
      id,
      height,
      isLoading,
      isLastMsg,
      fileMetadata,
      handleImageLoaded,
    },
    ref
  ) => {
    const { user, userData } = useSelector((state) => state.auth);
    const isCurrentUser = sender?._id === user;

    const [showImageViewer, setShowImageViewer] = useState(false);
    const date = new Date(timestamp);
    const formattedTimestamp = `${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}, ${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    const toggleImageViewer = () => {
      setShowImageViewer(!showImageViewer);
    };
    // const handleImageLoad = () => {
    //   window.dispatchEvent(new CustomEvent("image-loaded"));
    // };
    const downloadFile = (event) => {
      event.preventDefault();
      window.open(fileMetadata.url, "_blank");
    };

    // Define message content rendering, with conditional loading overlay for images

    const fileContent =
      type === "file" ? (
        <div
          onClick={downloadFile}
          className="cursor-pointer flex items-center space-x-2"
        >
          <DocumentIcon className="h-5 w-5 text-white" />
          <div>
            <div className="text-sm text-white">{fileMetadata.name}</div>
            <div className="text-xs text-gray-400">
              {(fileMetadata.size / 1024).toFixed(2)} KB
            </div>
          </div>
        </div>
      ) : null;
    const messageContent =
      type === "image" ? (
        <div
          className="relative cursor-pointer"
          onClick={toggleImageViewer}
          style={{ minHeight: `200px` }}
        >
          <img
            src={imageUrl}
            onLoad={handleImageLoaded}
            onError={handleImageLoaded}
            alt="Uploaded"
            className="max-w-full h-full rounded"
          />
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
              <Loader />
            </div>
          )}
        </div>
      ) : type === "text" ? (
        <div>{content}</div>
      ) : (
        fileContent
      );

    // Conditional rendering for the timestamp or loader
    const displayTimestampOrLoader =
      isLoading && (type === "text" || type === "file") ? (
        <div className="flex justify-end w-full">
          <Loader size={12} />{" "}
          {/* This ensures the loader is on the far right */}
        </div>
      ) : (
        <div className={`text-[10px] text-white text-right`}>
          {formattedTimestamp}
        </div>
      );

    return (
      <div ref={ref} style={{ height: `${height}px` }} id={id}>
        <div
          className={`p-2 rounded my-1 max-w-xs ${
            isCurrentUser ? "ml-auto bg-green-500" : "mr-auto bg-blue-500"
          }`}
          style={{ maxWidth: "300px", width: "100%" }}
        >
          {!isCurrentUser && sender && (
            <div className="flex items-center space-x-2">
              <Avatar imageUrl={sender.profileImg} size="4" />
              <span className="text-xs text-gray-400">{sender.name}</span>
            </div>
          )}
          {messageContent}
          {displayTimestampOrLoader}
        </div>
        {showImageViewer && (
          <ImageViewer imageUrl={imageUrl} onClose={toggleImageViewer} />
        )}
      </div>
    );
  }
);

export default ChatMessage;
