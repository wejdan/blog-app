import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import MovieDetails from "../pages/MovieDetails";
import MovieReview from "../pages/MovieReview";
import MoviesCategory from "../pages/MoviesCategory";
import NotFoundPage from "../pages/NotFoundPage";

const UserRouter = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
        <Route path="/movie/review/:movieId" element={<MovieReview />} />
        <Route path="/category/:id" element={<MoviesCategory />} />
        {/* More authenticated user routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default UserRouter;
