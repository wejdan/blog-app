import React from "react";
import { Link } from "react-router-dom";

const PostCard = React.forwardRef(({ post }, ref) => {
  return (
    <div
      ref={ref}
      className="relative p-2 max-w-[320px] group  rounded-lg  cursor-pointer overflow-hidden hover:shadow-lg hover:border-blue-300 border-2 border-transparent transition duration-500 ease-in-out transform hover:-translate-y-2"
    >
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-[300px] h-[200px] rounded-lg object-cover"
      />
      {/* Dark overlay element */}
      <div className="mb-8 p-5 flex flex-col justify-between  transition-opacity duration-500 ease-in-out">
        <div>
          <h3 className="text-lg text-blue-300 font-semibold">{post.title}</h3>
          <p className="text-gray-400 text-sm">{post.category}</p>
        </div>
        <Link
          to={`/posts/${post.slug}`}
          className="absolute bottom-2.5 left-0 right-0 mx-auto transition duration-500 opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transform translate-y-6 group-hover:translate-y-0"
        >
          Read article
        </Link>
      </div>
    </div>
  );
});

export default PostCard;
