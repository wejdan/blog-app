import React, { useEffect, useRef } from "react";
import Loader from "../components/UI/Loader";
import PostCard from "../components/posts/PostCard";
import { useGetInfinitePosts } from "../hooks/posts/useGetInfinitePosts";
import Select from "../components/UI/Select";
import { useGetAllCategories } from "../hooks/posts/useGetAllCategories";
import { useState } from "react";

function AllPostsPage() {
  const [category, setCategory] = useState("All");
  const { data, isLoading, fetchNextPage, hasNextPage } = useGetInfinitePosts(
    "",
    9,
    category
  );

  const { data: options, isLoading: isLoadingCategories } =
    useGetAllCategories();
  const categoryOpts = ["All"].concat(options || []);
  const posts = data?.pages.flatMap((page) => page.posts);

  const lastPostRef = useRef();

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
    <div className=" p-10">
      <div className="mb-24 flex justify-between items-center">
        <h2 className="text-3xl text-gray-200 font-bold mb-10">All Posts</h2>
        <Select
          className="mb-4"
          label="Category"
          options={categoryOpts}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        />
      </div>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center ">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <PostCard
              ref={index === posts.length - 1 ? lastPostRef : null}
              key={post._id}
              post={post}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllPostsPage;
