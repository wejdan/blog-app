import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to access the auth token from the Redux store

import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { updateUserPassword } from "../services/auth";

function UpdatePasswordPage() {
  const { isAuthenticating, userData, user, accessToken } = useSelector(
    (state) => state.auth
  );
  const [loading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const isDisabled =
    loading ||
    !currentPassword.trim() ||
    !newPassword.trim() ||
    newPassword !== confirmNewPassword;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords don't match.");
      return;
    }
    setIsLoading(true);
    toast.dismiss();
    try {
      await updateUserPassword(accessToken, currentPassword, newPassword);
      toast.success("Your password has been updated successfully.");
      navigate("/"); // Redirect the user to a safe page, e.g., the home page
    } catch (error) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center mx-auto w-full max-w-md px-6">
      <form onSubmit={onSubmit}>
        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          placeholder="Enter current password"
          className="mb-2"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          className="mb-2"
          label="New Password"
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          className="mb-2"
          label="Confirm New Password"
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <Button
          variant="solid"
          className="w-full mt-3"
          isLoading={loading}
          isDisabled={isDisabled}
        >
          Update Password
        </Button>
        <div className="flex justify-between items-center mt-6">
          <NavLink
            to="/profile"
            className="text-sm text-gray-400 hover:underline"
          >
            Return to Profile
          </NavLink>
        </div>
      </form>
    </div>
  );
}

export default UpdatePasswordPage;
