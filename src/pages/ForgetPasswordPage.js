import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../components/UI/Button";

import { toast } from "react-hot-toast";
// Import the service function for requesting a password reset
// Assuming it's named requestPasswordReset and available in your auth services
import { requestPasswordReset } from "../services/auth";
import Input from "../components/UI/Input";

function ForgetPasswordPage() {
  const [loading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const isDisabled = loading || !email.trim();

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    setIsLoading(true);
    toast.dismiss(); // Dismiss any existing toasts before showing a new one
    try {
      await requestPasswordReset(email);
      toast.success("Password reset link sent. Check your email.");
      // Optionally, redirect the user to the login page or show further instructions
    } catch (error) {
      toast.error(error.message || "Failed to request password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 flex flex-col justify-center mx-auto w-full max-w-md px-6">
      <form onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={onChange}
        />
        <Button
          variant="solid"
          className="w-full mt-3"
          isLoading={loading}
          isDisabled={isDisabled}
        >
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}

export default ForgetPasswordPage;
