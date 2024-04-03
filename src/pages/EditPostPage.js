import React from "react";
import { useParams } from "react-router-dom";
import { useGetPost } from "../hooks/posts/useGetPostDetails";
import Loader from "../components/UI/Loader";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import ReactQuill from "react-quill";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useUploadPostImg } from "../hooks/users/useUploadPostImg";
import { useCreatePost } from "../hooks/posts/useCreatePost";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useUpdatePost } from "../hooks/posts/useUpdatePost";
import toast from "react-hot-toast";
import CoverImagePicker from "../components/posts/CoverImagePicker";
import { useGetAllCategories } from "../hooks/posts/useGetAllCategories";
import Autocomplete from "../components/UI/Autocomplete";
import "react-quill/dist/quill.snow.css"; // import styles

// const Quill = ReactQuill.Quill; // Access the Quill module from ReactQuill
// const SizeStyle = Quill.import("attributors/style/size");
// SizeStyle.whitelist = [
//   "10px",
//   "12px",
//   "14px",
//   "16px",
//   "18px",
//   "20px",
//   "24px",
//   "30px",
//   "36px",
// ];
// Quill.register(SizeStyle, true);

function EditPostPage() {
  const { postId } = useParams();
  const { isLoading, data, error } = useGetPost("id", postId);
  const formOptions = useMemo(
    () => ({
      defaultValues: {
        title: "",
        coverImage: "",
        body: "",
        category: { value: "", label: "" },
      },
    }),
    []
  );
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors, isDirty },
  } = useForm(formOptions);

  const { loading, handleImageUpload } = useUploadPostImg();
  const updatePostMutation = useUpdatePost(); // Assuming you have this hook
  const title = watch("title");
  const coverImage = watch("coverImage");
  const body = watch("body");
  const category = watch("category");
  const [isCoverImageLoading, setIsCoverImageLoading] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  const { data: options, isLoading: isLoadingCategories } =
    useGetAllCategories();
  console.log("options", options);
  const categoryOpts = options?.map((category) => {
    return { value: category, label: category };
  });
  // This effect sets the form values when the post data is loaded.
  useEffect(() => {
    if (data && !formInitialized) {
      setValue("title", data.title, { shouldDirty: false });
      setValue("coverImage", data.coverImage, { shouldDirty: false });
      setValue("body", data.body, { shouldDirty: false });
      setValue(
        "category",
        { value: data.category, label: data.category },
        { shouldDirty: false }
      );
      setFormInitialized(true); // Prevents further setValue calls on re-renders
    }
  }, [data, setValue, formInitialized]);
  // ... other code remains unchanged

  // Submit function updated to use react-hook-form
  const onSubmit = async (formData) => {
    // Destructure the form data
    const { title, body, coverImage, category } = formData;

    // Construct your post data
    const postData = {
      title,
      body,
      coverImage,
      category: category.value,
      // this needs to be managed if you're allowing image updates
      // ...other post data fields
    };

    try {
      await updatePostMutation.mutateAsync({ postId, postData });
    } catch (error) {}
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
  console.log("isDirty", isDirty);
  const handleCreateCategory = (inputValue) => {
    console.log("New category created:", inputValue);
    // Here you set the new value to the category field in your form
    setValue("category", { value: inputValue, label: inputValue });
    // Optionally, you might want to update your category options state here if needed
  };
  const isPublishDisabled =
    !isDirty ||
    !title.trim() ||
    !coverImage.trim() ||
    !body.trim() ||
    !category?.value;
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Failed to load post details.
      </div>
    );
  }

  if (!data) {
    return <div className="text-center">Post not found.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-dark rounded-lg shadow-lg p-5 max-w-2xl w-full">
        <h2 className="text-2xl text-white font-bold mb-4">Edit a post</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center mb-3 ">
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Title"
              className="w-full mr-2  rounded text-gray-700"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Autocomplete
                  options={categoryOpts}
                  className=" w-60"
                  error={errors.category?.message}
                  placeholder="Search categories"
                  onChange={(selectedOption) => onChange(selectedOption)} // Pass the selected option back to react-hook-form's onChange
                  onBlur={onBlur} // Inform react-hook-form when the field is touched
                  value={value} // Pass the current value from react-hook-form to Autocomplete
                  ref={ref} // Pass the ref for react-hook-form to register the input
                  onCreateOption={handleCreateCategory}
                />
              )}
            />
          </div>

          {/* Rich text editor for content */}
          {coverImage && <img src={coverImage} alt="Cover" className="mb-3" />}
          <CoverImagePicker
            isLoading={isCoverImageLoading}
            onImageSelected={async (file) => {
              setIsCoverImageLoading(true);
              try {
                const imageUrl = await handleImageUpload(file);
                setValue("coverImage", imageUrl, { shouldDirty: true });
              } catch {
                toast.error("Failed to upload image");
              } finally {
                setIsCoverImageLoading(false);
              }
            }}
          />
          <ReactQuill
            ref={quillRef}
            theme="snow"
            modules={modules}
            value={watch("body")}
            onChange={(content) =>
              setValue("body", content, { shouldDirty: true })
            }
          />
          <Button
            isDisabled={isPublishDisabled}
            isLoading={updatePostMutation.isPending}
            variant={"solid"}
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-3"
          >
            Publish
          </Button>
        </form>
      </div>
    </div>
  );
}

export default EditPostPage;
