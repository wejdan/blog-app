// This example uses a "Load More" button for simplicity.
import React, { useState } from "react";
import { useGetAllMedia } from "../../hooks/media/useGetAllMedia";
import ImageGrid from "../UI/ImageGrid";
import { useEffect } from "react";
import { useRef } from "react";
import { useUploadPostImg } from "../../hooks/users/useUploadPostImg";

function Media() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useGetAllMedia(40);
  console.log("hasNextPage", hasNextPage);
  const imgsList = data?.pages.flatMap((page) => page.images);

  const lastImgRef = useRef();

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

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No media found</div>;

  return (
    <>
      <ImageGrid lastImgRef={lastImgRef} images={imgsList} />
    </>
  );
}

export default Media;
