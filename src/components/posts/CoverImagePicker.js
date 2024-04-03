import Loader from "../UI/Loader";

function CoverImagePicker({ onImageSelected, isLoading }) {
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageSelected(file);
    }
  };

  return (
    <label className="block w-full text-center border-2 border-dashed border-blue-500 p-4 cursor-pointer">
      <input
        type="file"
        className="hidden"
        onChange={handleImageSelect}
        accept="image/*"
      />
      <div className="flex items-center justify-center">
        {isLoading ? (
          <>
            <Loader className="mr-2" />
            <span>Loading...</span>
          </>
        ) : (
          <span>Choose file</span>
        )}
      </div>
    </label>
  );
}

export default CoverImagePicker;
