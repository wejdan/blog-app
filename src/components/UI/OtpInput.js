import React, { useState, useRef, useEffect } from "react";
import Input from "./Input";

function OtpInput({ length, onComplete }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputsRef = useRef(new Array(length).fill(null));

  useEffect(() => {
    inputsRef.current[0].focus();
  }, []);

  const handleKeyDown = (event, index) => {
    // Handle backspace
    if (event.keyCode === 8 && index > 0) {
      setOtp(otp.map((value, idx) => (idx === index ? "" : value)));
      inputsRef.current[index - 1].focus();
      return;
    }

    // Allow only numbers
    const number = Number(event.key);
    if (!Number.isNaN(number) && event.key !== " ") {
      setOtp(otp.map((value, idx) => (idx === index ? event.key : value)));

      if (index < length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };
  useEffect(() => {
    onComplete(otp.join(""));
  }, [otp, onComplete]);
  return (
    <div className="flex justify-center space-x-2">
      {otp.map((item, index) => (
        <Input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          maxLength="1"
          value={item}
          onChange={() => {}} // Keep for controlled component
          onKeyDown={(e) => handleKeyDown(e, index)}
          inputStyles="w-10 mx-1 text-center  border rounded focus:outline-none focus:border-blue-500 transition-colors duration-300"
          pattern="\d*"
        />
      ))}
    </div>
  );
}

export default OtpInput;
