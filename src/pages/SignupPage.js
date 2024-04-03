import React, { useState } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import GradientText from "../components/UI/GradientText";
import toast from "react-hot-toast";
import OtpInput from "../components/UI/OtpInput";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";
import { requestOtp, verifyOtp } from "../services/auth";

const SignupPage = () => {
  const {
    signup,
    isSignupLoading,
    isSignupError,
    signupError,
    requestOtp,
    isRequestOtpLoading,
    isRequestOtpError,
    verifyOtp,
    isVerifyOtpLoading,
    isVerifyOtpError,
  } = useAuth();

  const [otpKey, setOtpKey] = useState(Date.now()); // Initialize otpKey state

  const [currentStep, setCurrentStep] = useState("requestOtp"); // 'requestOtp', 'verifyOtp', 'completeSignup'
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const isDisabled =
    isVerifyOtpLoading ||
    Object.values(formData).some((value) => value.trim() === "") ||
    formData.password !== formData.confirmPassword;

  const onChange = (e) => {
    const { name, value } = e.target;
    // If the input field is 'email', convert its value to lowercase
    const updatedValue = name === "email" ? value.toLowerCase() : value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    signup({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });
  };
  const onRequestOtp = async (e) => {
    e.preventDefault();
    setOtp("");

    try {
      await requestOtp(
        { email: formData.email },
        {
          onSuccess: (data) => {
            // Handle success
            toast.success("OTP has been sent to your email.");

            setCurrentStep("verifyOtp");
            setOtpKey(Date.now());
          },
        }
      );
    } catch (error) {
      //  toast.error(error.message || "An error occurred while requesting OTP.");
      toast.error(error.message || "An error occurred while requesting OTP.");
    }
  };
  const onVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(
        { email: formData.email, otp },
        {
          onSuccess: (data) => {
            // Handle success
            toast.success("OTP verified.");
            setCurrentStep("completeSignup");
          },
        }
      );
    } catch (error) {
      toast.error(error.message || "An error occurred while requesting OTP.");
    }
  };
  const requestOtpForm = (
    <form onSubmit={onRequestOtp}>
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="example@gmail.com"
        value={formData.email}
        onChange={onChange}
      />
      <Button
        variant="solid"
        className="w-full mt-3"
        isLoading={isRequestOtpLoading}
        isDisabled={formData.email.trim() === ""}
      >
        Request OTP
      </Button>
    </form>
  );
  const verifyOtpForm = (
    <form onSubmit={onVerifyOtp}>
      <OtpInput
        key={otpKey} // Use otpKey state as the key
        length={6}
        onComplete={(otpValue) => {
          console.log("otpValue", otpValue);
          setOtp(otpValue); // Set the otp state when all inputs are filled
        }}
      />
      <Button
        variant="solid"
        className="w-full mt-3"
        isLoading={isVerifyOtpLoading}
        isDisabled={otp.length !== 6}
      >
        {isRequestOtpLoading ? "Requesting a new OTP" : " Verify OTP"}
      </Button>
    </form>
  );

  return (
    <div className="flex flex-col items-center justify-center  mt-20 text-white p-4">
      <div className=" max-w-xl">
        {currentStep === "requestOtp" && requestOtpForm}
        {currentStep === "verifyOtp" && verifyOtpForm}
        {currentStep === "completeSignup" && (
          <form onSubmit={onSubmit} className="mt-8 md:mt-0 w-[450px]">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-bold mb-2">
                Name
              </label>
              <Input
                placeholder={"name@company.com"}
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-bold mb-2"
              >
                Your password
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold mb-2"
              >
                Your password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={onChange}
                required
              />
            </div>
            <div className="flex flex-col   ">
              <Button
                isLoading={isSignupLoading}
                type="submit"
                variant="solid"
                className="mb-4 "
              >
                Sign Up
              </Button>
            </div>
            <div className="mt-4">
              <p>
                Already have an account??
                <NavLink
                  to="/login"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Sign in
                </NavLink>
              </p>
            </div>
          </form>
        )}
        {currentStep === "verifyOtp" && (
          <Button onClick={onRequestOtp} variant={"link"}>
            Resend Token
          </Button>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
