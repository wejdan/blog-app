// In components/UI/CustomPagination.js
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination = ({ currentPage, setPage, totalPages }) => {
  return (
    <div className="flex justify-between items-center py-2 px-4 bg-gray-700 rounded-bl-lg rounded-br-lg">
      {" "}
      <div className="flex space-x-6">
        <button
          className={`${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={currentPage === 1}
        >
          <div>Previous</div>
        </button>
        <button
          className={`${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() =>
            setPage((old) => (!totalPages || old < totalPages ? old + 1 : old))
          }
          disabled={currentPage === totalPages}
        >
          <div>Next</div>
        </button>
      </div>
      <span>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
