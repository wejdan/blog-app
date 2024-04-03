import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetInfinitePosts } from "../hooks/posts/useGetInfinitePosts";
import { useState } from "react";
import Loader from "../components/UI/Loader";
import PostCard from "../components/posts/PostCard";

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Extract the search query parameter
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");
  const { data, isLoading, fetchNextPage, hasNextPage } = useGetInfinitePosts(
    query,
    9
  );

  const posts = data?.pages.flatMap((page) => page.posts);

  const lastPostRef = useRef();
  useEffect(() => {
    // If there is no search query, navigate to the home page
    if (!query) {
      navigate("/");
    }
  }, [query, navigate]);
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY + 1 >= document.body.offsetHeight &&
      !isLoading &&
      hasNextPage
    ) {
      console.log("Reached end of page");
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isLoading]);
  return (
    <div>
      {!isLoading && query && posts.length === 0 ? (
        <div className="w-full h-full mt-24 flex items-center justify-center ">
          <h1>No Results where found for {query}</h1>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="w-full h-screen  flex items-center justify-center ">
              <Loader />
            </div>
          ) : (
            <>
              <h1 className="mb-10 mt-24">Search Results for {query}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post, index) => (
                  <PostCard
                    ref={index === posts.length - 1 ? lastPostRef : null}
                    key={post._id}
                    post={post}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SearchPage;
