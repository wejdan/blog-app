import React, { useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { useUploadPostImg } from "../hooks/users/useUploadPostImg";
import Loader from "../components/UI/Loader";
import { useCreatePost } from "../hooks/posts/useCreatePost";
import toast from "react-hot-toast";
import CoverImagePicker from "../components/posts/CoverImagePicker";
import Autocomplete from "../components/UI/Autocomplete";
import { useGetAllCategories } from "../hooks/posts/useGetAllCategories";
import "react-quill/dist/quill.snow.css"; // import styles

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");

  // ... other state variables as needed
  const { loading, handleImageUpload } = useUploadPostImg();
  const createPostMutation = useCreatePost();
  const { data: options, isLoading: isLoadingCategories } =
    useGetAllCategories();
  const categoryOpts = options?.map((category) => {
    return { value: category, label: category };
  });
  const [isCoverImageLoading, setIsCoverImageLoading] = useState(false);
  const handleCoverImageSelect = async (file) => {
    setIsCoverImageLoading(true);
    try {
      // Assuming you have a function to handle the file upload
      const imageUrl = await handleImageUpload(file);

      setCoverImage(imageUrl);
    } catch (error) {
      console.error("Error uploading cover image:", error);
    } finally {
      setIsCoverImageLoading(false);
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handlCategoryChange = (value) => {
    setCategory(value);
  };
  const handleCreateCategory = (inputValue) => {
    console.log("New category created:", inputValue);
    // Here you set the new value to the category field in your form
    setCategory({ value: inputValue, label: inputValue });
    // Optionally, you might want to update your category options state here if needed
  };

  const handleSubmit = async () => {
    console.log(title);
    console.log(coverImage);

    console.log(content);
    const postData = {
      title,
      body: content,
      category: category.value,
      coverImage,
    };
    try {
      await createPostMutation.mutateAsync(postData);
    } catch (error) {}
    // ... submit logic
    // Content will be in HTML format, you can send it to your server
  };
  const quillRef = useRef(); // the solution
  const imageHandler = () => {
    const editor = quillRef.current.getEditor();
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUrl = e.target.result;
          const range = editor.getSelection(true);

          // Generate a unique ID for the image
          const id = `uploading-${Date.now()}`;

          // Insert an image with the data URL and a unique class or ID
          editor.insertEmbed(range.index, "image", dataUrl);
          const quillEditor = editor.container.querySelector(".ql-editor");
          const images = quillEditor.getElementsByTagName("img");
          for (let img of images) {
            if (img.getAttribute("src") === dataUrl) {
              img.setAttribute("id", id); // Set unique ID
              break;
            }
          }

          try {
            const imageUrl = await handleImageUpload(file);
            // Replace the temporary image with the uploaded image
            const uploadedImage = document.getElementById(id);
            if (uploadedImage) {
              uploadedImage.setAttribute("src", imageUrl);
              uploadedImage.removeAttribute("id"); // Remove the ID
              editor.insertText(range.index + 1, "\n"); // Insert a newline after the image
              // Optionally remove the loading overlay class
            }
          } catch (error) {
            console.error("Error uploading image: ", error);
            // Handle upload failure (e.g., remove the image)
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          [{ size: ["small", false, "large", "huge"] }], // Here are the font sizes          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["image", "code-block"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );
  const isPublishDisabled =
    !title ||
    !coverImage ||
    !content ||
    !category ||
    loading ||
    isCoverImageLoading;
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-dark rounded-lg shadow-lg p-5 max-w-2xl w-full">
        <h2 className="text-2xl text-white font-bold mb-4">Create a post</h2>
        <form>
          <div className="flex items-center mb-3 ">
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
              className="w-full mr-2  rounded text-gray-700"
            />{" "}
            <Autocomplete
              options={categoryOpts}
              className=" w-60"
              placeholder="Search categories"
              onChange={handlCategoryChange} // Pass the selected option back to react-hook-form's onChange
              value={category} // Pass the current value from react-hook-form to Autocomplete
              onCreateOption={handleCreateCategory}
            />
          </div>
          {/* Rich text editor for content */}
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-64 object-cover mb-3"
            />
          )}
          <CoverImagePicker
            isLoading={isCoverImageLoading}
            onImageSelected={handleCoverImageSelect}
          />
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            modules={modules}
            onChange={handleContentChange}
          />
          <Button
            isDisabled={isPublishDisabled}
            isLoading={createPostMutation.isPending}
            variant={"solid"}
            type="button"
            onClick={handleSubmit}
            className="w-full mt-3"
          >
            Publish
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
