import React from "react";
import Modal from "react-modal";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
function BaseModal({ isOpen, onRequestClose, isLoading, onConfirm, children }) {
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
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={{
        base: customStyles.overlay.base,
        afterOpen: customStyles.overlay.afterOpen,
      }}
      className={{
        base: customStyles.content.base,
        afterOpen: customStyles.content.afterOpen,
      }}
    >
      {children}
    </Modal>
  );
}

export default BaseModal;
