import React from "react";
import { Outlet } from "react-router-dom";

function PageLayout() {
  return (
    <div className=" container flex flex-col text-white  flex-grow  max-w-6xl mx-auto px-4 py-2">
      <Outlet />
    </div>
  );
}

export default PageLayout;
