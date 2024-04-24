import UserCard from "../../user/UserCard";
import Input from "../../UI/Input";
import Autocomplete from "../../UI/AutoSuggust";
import { useSelector } from "react-redux";
import Button from "../../UI/Button";
import { useState } from "react";
import { useSocketContext } from "../../../context/SocketContext";
import ImagePicker from "../../UI/ImagePicker";
import { useUpdateGroupChatImg } from "../../../hooks/users/useUpdateGroupChatImg";
import { useUploadChatImg } from "../../../hooks/users/useUploadChatImg";

const EditGroupForm = ({ onSubmit, groupId }) => {
  const { chats } = useSelector((state) => state.chat);
  const { updateGroupImg } = useSocketContext();

  const groupData = chats[groupId];

  const adminId = groupData?.conversationInfo.admin?._id;

  // Define initial values for groupName and selectedUsers based on groupData
  const initialGroupName = groupData?.conversationInfo.groupName;
  const initialSelectedUsers = groupData?.conversationInfo.participants
    .filter((participant) => participant._id !== adminId)
    .map((user) => ({
      value: user._id,
      label: user.name,
      image: user.profileImg,
    }));
  // State hooks for groupName and selectedUsers
  const [groupName, setGroupName] = useState(initialGroupName);
  const [selectedUsers, setSelectedUsers] = useState(initialSelectedUsers);
  const [imagePreview, setImagePreview] = useState(
    groupData?.conversationInfo.groupImage
  );

  const formValuesChanged = () => {
    const groupNameChanged = groupName !== initialGroupName;
    const selectedUsersChanged =
      JSON.stringify(selectedUsers.map(({ value }) => ({ value }))) !==
      JSON.stringify(initialSelectedUsers?.map(({ value }) => ({ value })));

    return groupNameChanged || selectedUsersChanged;
  };

  // Function to check for empty values
  const hasEmptyValues = () => {
    return groupName.trim() === "" || selectedUsers.length === 0;
  };

  const isFormDisabled = !formValuesChanged() || hasEmptyValues();
  const { user } = useSelector((state) => state.auth);
  // const { handleImageUpload, loading } = useUpdateGroupChatImg(groupId);
  const { handleImageUpload, loading } = useUploadChatImg();

  const handleSubmit = (e) => {
    e.preventDefault();
    //  console.log(groupName, selectedUsers);
    const participantIds = selectedUsers.map((user) => user.value);
    //   console.log("participantIds", participantIds);

    onSubmit({ groupId, groupName, participantIds });
    // Reset form
    setGroupName("");
    setSelectedUsers([]);
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      //  setValue("imageFile", file); // Update form value for image file
      setImagePreview(URL.createObjectURL(file)); // Update image preview
      const url = await handleImageUpload(file);
      updateGroupImg({ groupId, url });
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full pt-11 flex-col justify-between space-y-4"
    >
      <div className="flex h-full flex-col justify-start space-y-4">
        <div>
          <label
            htmlFor="groupName"
            className="block text-sm font-medium text-gray-700"
          >
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mt-1 bg-white  block w-full  rounded-md border-2 border-gray-400 shadow-sm  focus:ring-indigo-500 sm:text-sm px-4 py-2    text-gray-900 focus:border-pink-500 focus:outline-none"
            required
          />
        </div>
        <div className="self-center">
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
        </div>
        <div className=" ">
          <Autocomplete
            placeholder="Search users"
            exclude={[user]}
            isMulti={true}
            className="w-64 h-full"
            value={selectedUsers}
            onChange={setSelectedUsers} // Update selected actor state
          />
        </div>
      </div>
      <Button
        className={""}
        variant={"solid"}
        isDisabled={isFormDisabled} // Disable the button based on the form state
        type="submit"
      >
        Edit Group
      </Button>
    </form>
  );
};

export default EditGroupForm;
