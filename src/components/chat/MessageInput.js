import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUploadChatImg } from "../../hooks/users/useUploadChatImg";
import { useSocketContext } from "../../context/SocketContext";
import {
  ChatIcon,
  PhotographIcon,
  EmojiHappyIcon,
  PaperClipIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CameraIcon,
} from "@heroicons/react/outline";
import EmojiPicker from "emoji-picker-react";
import AttachmentMenu from "./AttachmentMenu";
function MessageInput() {
  const typingTimeoutRef = useRef(null);
  const documentInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null); // Ref for the file input
  const [typing, setTyping] = useState(false);
  const { sendMessage, updateTypingStatus } = useSocketContext();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const { activeChat, selectedTarget } = useSelector((state) => state.chat);
  const { handleImageUpload, loading } = useUploadChatImg();
  const handleSendMessage = useCallback(
    (message, type) => {
      if (message && (activeChat || selectedTarget)) {
        sendMessage(message, type, selectedTarget);
      }
    },
    [activeChat, sendMessage, selectedTarget]
  );
  const onBlurHandler = () => {
    clearTimeout(typingTimeoutRef.current);
    setTyping(false);
    updateTypingStatus(false);
  };
  const onSend = (e) => {
    e.preventDefault();
    handleSendMessage(message, "text");
    setMessage("");
    // Stop typing as message is sent
    clearTimeout(typingTimeoutRef.current);
    setTyping(false);
    updateTypingStatus(false);
  };

  const onFileChange = async (e) => {
    // Handle the file upload logic here
    const file = e.target.files[0];
    if (file) {
      //const url = await handleImageUpload(file);
      //  handleSendMessage(file, "image");
      //updateGroupImg({ groupId, url });

      const fileUrl = URL.createObjectURL(file);

      // Create an image element
      const img = new Image();
      img.onload = () => {
        // Access image properties
        console.log("Image Height: ", img.height);
        console.log("Image Width: ", img.width);

        // Optionally, continue with your upload or message sending logic
        handleSendMessage(
          { file: file, height: img.height, width: img.width },
          "image"
        );

        // Revoke the object URL after use
        URL.revokeObjectURL(fileUrl);
      };
      img.src = fileUrl;
      // Process the file or pass it to handleSendMessage as needed
    }
  };
  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Process the document file here
      console.log("Document uploaded:", file);
      handleSendMessage({ file }, "file");
    }
  };
  const triggerFileInput = () => {
    // Trigger the hidden file input onClick of button
    fileInputRef.current.click();
  };
  const onChangeHandler = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      updateTypingStatus(true);
    }
    // Reset the typing timeout every time the user presses a key
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      updateTypingStatus(false);
    }, 2000); // Adjust the timeout duration as needed (2000 ms is typical)
  };

  const onEmojiClick = (emojiObject) => {
    console.log("emojiObject", emojiObject);
    setMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    if (!activeChat && !selectedTarget) return;

    setShowEmojiPicker(!showEmojiPicker);
  };
  const toggleAttachmentMenu = () => {
    if (!activeChat && !selectedTarget) return;

    setShowAttachmentMenu(!showAttachmentMenu);
  };
  const attachmentMenuRef = useRef(null);
  const paperClipIconRef = useRef(null);
  const closeAttachmentMenu = () => setShowAttachmentMenu(false);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        paperClipIconRef.current &&
        paperClipIconRef.current.contains(event.target)
      ) {
        // Click on the paper clip icon, ignore
        return;
      }
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target)
      ) {
        // Click outside the attachment menu, close it
        closeAttachmentMenu();
      }
    }

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Existing setup...

  const menuItems = [
    {
      icon: CameraIcon,
      bgClass: "bg-blue-500",
      hoverClass: "hover:bg-blue-600",
      action: triggerFileInput,
    },
    {
      icon: VideoCameraIcon,
      bgClass: "bg-pink-500",
      hoverClass: "hover:bg-pink-600",
      action: () => console.log("Video action"),
    },
    {
      icon: MicrophoneIcon,
      bgClass: "bg-green-500",
      hoverClass: "hover:bg-green-600",
      action: () => console.log("Microphone action"),
    },
    {
      icon: DocumentTextIcon,
      bgClass: "bg-yellow-500",
      hoverClass: "hover:bg-yellow-600",
      action: () => documentInputRef.current.click(),
    },
    // Add more items as needed
  ];

  return (
    <div className="border-t border-gray-700 bg-gray-800  relative w-full ">
      {showEmojiPicker && (
        <div className="absolute bottom-14 left-2 z-10">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <form
        className=" flex items-center justify-between space-x-3 p-3 border-t border-gray-700"
        onSubmit={onSend}
      >
        <EmojiHappyIcon
          className="h-7 w-7 text-gray-400 cursor-pointer"
          onClick={toggleEmojiPicker}
        />
        <div className="relative ">
          <PaperClipIcon
            ref={paperClipIconRef}
            className="h-7 w-7 text-gray-400 cursor-pointer"
            onClick={toggleAttachmentMenu}
          />
          <AttachmentMenu
            onClose={() => {
              setShowAttachmentMenu(false);
            }}
            show={showAttachmentMenu}
            ref={attachmentMenuRef}
            items={menuItems}
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: "none" }} // Hide the file input
          accept="image/*"
        />
        <input
          type="file"
          ref={documentInputRef}
          style={{ display: "none" }}
          onChange={handleDocumentUpload}
          accept=".pdf,.doc,.docx,.txt"
        />
        {/* <button
          type="button"
          onClick={triggerFileInput}
          className=" mr-5 bg-blue-500 p-2 rounded-full hover:bg-blue-600"
          disabled={!activeChat && !selectedTarget}
        >
          <PhotographIcon className="h-5 w-5 text-white" />
        </button> */}
        <input
          type="text"
          className="flex-1 rounded-full p-2 pl-12 bg-gray-700 text-white outline-none"
          value={message}
          onChange={onChangeHandler}
          placeholder="Type a message..."
          disabled={!activeChat && !selectedTarget}
          onBlur={onBlurHandler}
        />
        <button
          className="bg-green-500 rounded-full p-3 hover:bg-green-600"
          type="submit"
        >
          <ChatIcon className="h-5 w-5 text-white" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
