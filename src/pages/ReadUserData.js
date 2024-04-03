import React, { useEffect } from "react";
import Loader from "../components/UI/Loader";
import {
  authenticate,
  fetchUserData,
  setIsAuthenticating,
} from "../store/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function ReadUserData() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useHistory hook to get access to history object

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");
    const refreshToken = queryParams.get("refreshToken");
    const uid = queryParams.get("uid");
    if (accessToken && refreshToken && uid) {
      dispatch(setIsAuthenticating(true));
      const authData = { uid, accessToken, refreshToken };
      // Call the createOrder endpoint with the session ID

      dispatch(authenticate({ user: authData }));
      dispatch(fetchUserData(accessToken));
      navigate("/", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [dispatch, location.search, location.pathname, navigate]);
  return (
    <div className="flex bg-gray-900 justify-center items-center  min-h-screen text-white">
      <Loader />
    </div>
  );
}

export default ReadUserData;
