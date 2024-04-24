import React, { useState, useEffect } from "react";
import UserCard from "../../user/UserCard";
import Input from "../../UI/Input";
import Autocomplete from "../../UI/AutoSuggust";
import { useSelector } from "react-redux";
import Button from "../../UI/Button";

const CreateGroupForm = ({ onSubmit }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const isFormDisabled = groupName.trim() === "" || selectedUsers.length === 0;
  const { user, userData } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(groupName, selectedUsers);
    const participantIds = selectedUsers.map((user) => user.value);
    console.log("participantIds", participantIds);

    onSubmit({ groupName, participantIds });
    // Reset form
    setGroupName("");
    setSelectedUsers([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-around space-y-4"
    >
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
      <div className="flex-grow">
        <Autocomplete
          placeholder="Search users"
          exclude={[user]}
          isMulti={true}
          className="w-64 h-full"
          value={selectedUsers}
          onChange={setSelectedUsers} // Update selected actor state
        />
      </div>
      <Button
        variant={"solid"}
        isDisabled={isFormDisabled} // Disable the button based on the form state
        type="submit"
      >
        Create Group
      </Button>
    </form>
  );
};

export default CreateGroupForm;
