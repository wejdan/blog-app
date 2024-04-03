import React from "react";
import Modal from "react-modal";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
const ConfirmModal = ({ isOpen, onRequestClose, isLoading, onConfirm }) => {
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
      <FontAwesomeIcon
        icon={faExclamationCircle}
        className="text-5xl text-gray-300 mb-4"
      />
      <h2 className="text-xl text-gray-700 font-bold mb-4">
        Are you sure you want to delete this comment?
      </h2>
      <div className="flex justify-around w-full">
        <Button
          isLoading={isLoading}
          className="bg-red-700 text-white transition-color duration-300 font-bold py-2 px-4 rounded hover:bg-red-800 focus:outline-none focus:shadow-outline"
          onClick={onConfirm}
        >
          Yes, I'm sure
        </Button>
        <button
          className="bg-gray-300 text-black  transition-color duration-300 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:shadow-outline"
          onClick={onRequestClose}
        >
          No, cancel
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
