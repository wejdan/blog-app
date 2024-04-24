import React from "react";
import Modal from "react-modal";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";

const CustomModal = ({
  isOpen,
  onRequestClose,
  isLoading,
  onConfirm,
  children,
}) => {
  const customStyles = {
    overlay: {
      base: "fixed inset-0 flex justify-center items-center",
      afterOpen:
        "bg-black bg-opacity-30 transition-opacity duration-300 ease-in-out backdrop-filter backdrop-blur-sm",
      beforeClose: "bg-black bg-opacity-0",
    },
    content: {
      base: "w-11/12 md:max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl flex flex-col items-center opacity-0 transition-opacity duration-300 transform transition ease-in-out",
      afterOpen: "opacity-100",
      beforeClose: "opacity-0 translate-y-4",
      height: "80vh", // Set a fixed height for the modal
      overflowY: "auto", // Allow vertical scrolling
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          position: "relative",
          inset: "auto",
          margin: "auto",
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
          width: "80%",
          maxWidth: "500px",
          height: "80vh", // Fixed height
        },
      }}
      overlayClassName={{
        base: customStyles.overlay.base,
        afterOpen: customStyles.overlay.afterOpen,
        beforeClose: customStyles.overlay.beforeClose,
      }}
      className={{
        base: customStyles.content.base + " overflow-y-auto", // Added overflow-y-auto here for scrolling
        afterOpen: customStyles.content.afterOpen,
        beforeClose: customStyles.content.beforeClose,
      }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
