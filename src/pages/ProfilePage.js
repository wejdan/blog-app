import React, { useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "../components/UI/Avatar";
import Input from "../components/UI/Input";
import ImagePicker from "../components/UI/ImagePicker";
import Button from "../components/UI/Button";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useUpdateProfileImg } from "../hooks/users/useUpdateProfileImg";
import toast from "react-hot-toast";
import { uploadImageToStorage } from "../services/imgs";
import { useUpdateUser } from "../hooks/users/useUpdateUser";

const ProfilePage = () => {
  const { user, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(userData.profileImg);
  const updateUserMutation = useUpdateUser();
  const { handleImageUpload, loading } = useUpdateProfileImg();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: userData.name,
      email: userData.email,
    },
  });
  const watchedFields = watch();

  // Determine if any field is empty
  const isAnyFieldEmpty = Object.values(watchedFields).some(
    (field) => field.trim() === ""
  );

  const onSubmit = (formData) => {
    console.log(formData);
    updateUserMutation.mutateAsync({ userId: user.uid, data: formData });
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      //  setValue("imageFile", file); // Update form value for image file
      setImagePreview(URL.createObjectURL(file)); // Update image preview
      handleImageUpload(file);
    }
  };
  return (
    <div className=" p-5 flex flex-col space-y-5 mt-12 items-center text-white min-w-[450px] md:min-w-[650px] mx-auto">
      <ImagePicker
        imagePreview={imagePreview}
        height={"120px"}
        width={"120px"}
        rounded={true}
        loading={loading}
        onImageChange={(e) => {
          handleImageChange(e);
          //  onChange(e.target.files[0]); // Update form value
        }}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex-col space-y-2"
      >
        <div className="mb-6 flex flex-col space-y-2 w-full">
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <Input
                label="Name"
                placeholder="Jeff Winger"
                error={errors.name?.message}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <Input
                disabled={true}
                label="Email"
                placeholder="name@compney.com"
                error={errors.name?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="w-full flex flex-wrap justify-around items-center">
          <Button
            type="submit"
            variant={"solid"}
            isDisabled={
              !isDirty || updateUserMutation.isPending || isAnyFieldEmpty
            }
            isLoading={updateUserMutation.isPending}
          >
            Update
          </Button>

          <button
            onClick={() => {
              navigate("/update-password");
            }}
            type="button"
            className=" bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 rounded text-white font-bold shadow-lg hover:shadow-xl transition-shadow s"
          >
            Update Password
          </button>
          <button
            type="button"
            className="text-red-500 hover:text-red-700 transition-colors "
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
