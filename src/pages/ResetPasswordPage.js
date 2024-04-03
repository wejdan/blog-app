import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Button from "../components/UI/Button";
import { toast } from "react-hot-toast";
import { resetPassword } from "../services/auth"; // This service needs to be implemented
import { useNavigate } from "react-router-dom";
import Input from "../components/UI/Input";

function ResetPasswordPage() {
  const [loading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams(); // Assuming the URL is /reset/:token
  const isDisabled =
    loading || !password.trim() || password !== confirmPassword;

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    toast.dismiss();
    try {
      await resetPassword(token, password);
      toast.success("Your password has been reset successfully.");
      navigate("/login"); // Redirect the user to the login page
    } catch (error) {
      toast.error(error.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-60 flex flex-col justify-center mx-auto w-full max-w-md px-6">
      <form onSubmit={onSubmit}>
        <Input
          className="mb-2"
          label="New Password"
          type="password"
          name="password"
          placeholder="Enter new password"
          value={password}
          onChange={onChangePassword}
        />
        <Input
          className="mb-2"
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />
        <Button
          variant="solid"
          className="w-full "
          isLoading={loading}
          isDisabled={isDisabled}
        >
          Reset Password
        </Button>
        <div className="flex justify-between items-center mt-6">
          <NavLink
            to="/login"
            className="text-sm text-gray-400 hover:underline"
          >
            Back to Sign In
          </NavLink>
          <NavLink
            to="/signup"
            className="text-sm text-gray-400 hover:underline"
          >
            Sign Up
          </NavLink>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
