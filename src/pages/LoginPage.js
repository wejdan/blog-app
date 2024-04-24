import React, { useState } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import GradientText from "../components/UI/GradientText";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoginLoading, isLoginError, loginError } = useAuth();
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
    console.log({ email, password });

    login({ email, password });
  };
  const handleGoogleSignIn = (e) => {
    window.open("http://localhost:5000/auth/google", "_self");
  };
  return (
    <div className="flex flex-col items-center justify-center  mt-20 text-white p-4">
      <div className="flex md:flex-row md:space-x-10  flex-col items-start md:items-center md:justify-between w-full max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold">
            <GradientText>Sahand's</GradientText>
            <span>Blog</span>
          </h1>
          <p className="text-gray-400 ">
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 md:mt-0 w-[450px]">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Your email
            </label>
            <Input
              placeholder={"name@company.com"}
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Your password
            </label>
            <Input
              placeholder={"***"}
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col   ">
            <Button
              isLoading={isLoginLoading}
              type="submit"
              variant="solid"
              className="mb-4 "
            >
              Sign In
            </Button>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              variant="outline"
            >
              Continue with Google
            </Button>
          </div>

          <div className="flex justify-between items-center mt-6">
            <NavLink
              to="/forgot-password"
              className="text-blue-500 hover:text-blue-700"
            >
              Forgot password?
            </NavLink>
            <NavLink to="/signup" className="text-blue-500 hover:text-blue-700">
              Sign Up
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
