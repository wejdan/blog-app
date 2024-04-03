import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authenticate,
  fetchUserData,
  logout,
  logoutAction,
  setIsAuthenticating,
} from "./store/authSlice";

// Importing components and pages
import PageLayout from "./components/UI/PageLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import PostDetails from "./pages/PostDetails";
import PostsByCategory from "./pages/PostsByCategory";
import NotFoundPage from "./pages/NotFoundPage";
import Loader from "./components/UI/Loader";
import { useScrollToTop } from "./hooks/common/useScrollToTop";
import SearchPage from "./pages/SearchPage";
import PublicRoute from "./components/routes/PublicRoute";
import AdminRoute from "./components/routes/AdminRoute";
import Navbar from "./components/UI/Navbar";
import ReadUserData from "./pages/ReadUserData";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AllPostsPage from "./pages/AllPostsPage";
import ChatPage from "./pages/ChatPage";

function ScrollToTopWrapper({ children }) {
  useScrollToTop(); // Call the custom hook inside a child component of Router
  return <>{children}</>;
}

function Main() {
  const { isAuthenticating, userData, user, accessToken } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch(); // Use useHistory hook to get access to history object
  useEffect(() => {
    if (user) {
      dispatch(fetchUserData());
    } else {
      //  dispatch(logoutAction());
    }
  }, [user, dispatch]);

  if (isAuthenticating || (user && !userData)) {
    return (
      <div className="flex bg-gray-900 justify-center items-center  min-h-screen text-white">
        <Loader />
      </div>
    );
  }

  const isAdmin = userData?.role === "admin";

  return (
    <Router>
      <ScrollToTopWrapper>
        <div className="bg-gray-900 flex flex-col  min-h-screen text-white">
          <Navbar />
          <Routes>
            <Route index element={<HomePage />} />

            <Route element={<PageLayout />}>
              <Route
                path="/category/:categoryId"
                element={<PostsByCategory />}
              />
              <Route path="/posts" element={<AllPostsPage />} />
              <Route path="/chat" element={<ChatPage />} />

              <Route path="/search" element={<SearchPage />} />
              <Route path="/auth" element={<ReadUserData />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-password"
                element={
                  <ProtectedRoute>
                    <UpdatePasswordPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgetPasswordPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset/:token"
                element={
                  <PublicRoute>
                    <ResetPasswordPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/posts/:slug" element={<PostDetails />} />

            {isAdmin && (
              <>
                {/* Admin-specific routes */}
                <Route
                  path="/dashboard"
                  element={
                    <AdminRoute>
                      <DashboardPage />
                    </AdminRoute>
                  }
                ></Route>
                <Route
                  path="/create-post"
                  element={
                    <AdminRoute>
                      <CreatePostPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/edit-post/:postId"
                  element={
                    <AdminRoute>
                      <EditPostPage />
                    </AdminRoute>
                  }
                />
              </>
            )}
          </Routes>
        </div>
      </ScrollToTopWrapper>
    </Router>
  );
}

export default Main;
