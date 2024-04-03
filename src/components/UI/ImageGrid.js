import React, { useState } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import Button from "./Button";
import CustomCheckbox from "./CustomCheckbox";
import BaseModal from "./BaseModal";
import { useDropzone } from "react-dropzone";
import { useUploadPostImg } from "../../hooks/users/useUploadPostImg";
import { useUploadMedia } from "../../hooks/media/useUploadMedia";
import { useDeleteMedia } from "../../hooks/media/useDeleteMedia";
import Loader from "./Loader";
import { ProgressBar } from "react-loader-spinner";
function ImageGrid({ images, lastImgRef, onUpload, onDeleteSelected }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const { loading, handleImageUpload } = useUploadMedia();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const deleteMediaMutaion = useDeleteMedia();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const imgUrl = await handleImageUpload(acceptedFiles[0]);
      if (imgUrl) {
        setShowUploadModal(false);
      }
    },
  });

  const handleUpload = () => {
    /// onUpload(); // This function needs to be defined in the parent component
    setShowUploadModal(true);
  };
  const handleSelectImage = (name) => {
    if (selectedImages.includes(name)) {
      setSelectedImages(selectedImages.filter((image) => image !== name));
    } else {
      setSelectedImages([...selectedImages, name]);
    }
  };

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map((image) => image.name));
    }
  };
  const handleDeleteSelected = async () => {
    await deleteMediaMutaion.mutateAsync(selectedImages); // This function needs to be defined in the parent component
    setSelectedImages([]); // Clear selection after deletion
  };
  const handleSelectAllToggle = (checked) => {
    if (checked) {
      setSelectedImages(images.map((image) => image.name));
    } else {
      setSelectedImages([]);
    }
  };
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <CustomCheckbox
            checked={
              selectedImages.length === images.length && images.length > 0
            }
            onChange={handleSelectAllToggle}
          />
          <label className="mx-2 text-sm text-white cursor-pointer">
            Select All
          </label>
          <Button onClick={handleUpload} className="hover:text-gray-200 mr-2">
            <FaPlus />
          </Button>
          {selectedImages.length > 0 && (
            <Button
              onClick={handleDeleteSelected}
              className=" text-red-500 font-bold py-2 px-4 rounded hover:text-red-700"
            >
              <FaTrashAlt />
            </Button>
          )}
        </div>
        {selectedImages.length > 0 && (
          <div className="text-blue-500">
            Selected Images: {selectedImages.length}
          </div>
        )}
      </div>
      <div className="grid grid-cols-6 gap-4">
        {images.map((image, index) => (
          <div
            ref={index === images.length - 1 ? lastImgRef : null} // Attach the ref to the last image
            onClick={() => handleSelectImage(image.name)}
            key={image.name}
            className="relative w-32 h-32 cursor-pointer rounded-lg overflow-hidden"
          >
            <img
              src={image.publicUrl}
              alt={image.name}
              className="w-full h-full object-cover  "
            />
            {selectedImages.includes(image.name) && (
              <>
                {deleteMediaMutaion.isPending ? ( // Assuming .isLoading is the correct property
                  <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <Loader size={"20"} />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gray-500 border-2 border-blue-500 bg-opacity-50 flex justify-center items-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <BaseModal
        onRequestClose={() => {
          setShowUploadModal(false);
        }}
        isOpen={showUploadModal}
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <ProgressBar
              visible={true}
              height="80"
              width="80"
              borderColor="#e24797"
              barColor="#0f162b"
              ariaLabel="progress-bar-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        )}
      </BaseModal>
    </div>
  );
}

export default ImageGrid;
