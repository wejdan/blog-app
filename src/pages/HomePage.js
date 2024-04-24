import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  authenticate,
  fetchUserData,
  setIsAuthenticating,
} from "../store/authSlice";
import { useDispatch } from "react-redux";
import PostCard from "../components/posts/PostCard";
import { useGetRecentPosts } from "../hooks/posts/useGetRecentPosts";
import Loader from "../components/UI/Loader";

const RecentPostsSection = () => {
  const { data, isLoading } = useGetRecentPosts();

  return (
    <div className="bg-gray-900 p-10">
      <h2 className="text-3xl text-white font-bold mb-5">Recent Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-stretch grid-rows-1">
        {isLoading ? (
          <Loader />
        ) : (
          data?.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};
function HomePage() {
  // Setting default address as selected address
  return (
    <div className="container mx-auto ">
      <header className="py-32 px-20">
        <h1 className="text-5xl font-bold mb-6">Welcome to my Blog</h1>
        <p className="text-md text-gray-400 mb-6">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to="/posts"
          className="text-blue-500 hover:text-blue-700  font-bold py-2  rounded"
        >
          View all posts
        </Link>
      </header>
      <section className="py-32 px-20 bg-gray-600">
        <h2 className="text-3xl font-bold mb-6">
          Want to learn HTML, CSS and JavaScript by building fun and engaging
          projects?
        </h2>
        <p className="mb-6">
          Check out our 100 js projects website and start building your own
          projects
        </p>
        <a
          href="#"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          100 JS Projects Website
        </a>
      </section>
      <RecentPostsSection />
    </div>
  );
}

export default HomePage;
