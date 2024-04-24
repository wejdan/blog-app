import React from "react";
import { useSelector } from "react-redux";
import { constructMessage } from "../../../utils/chat";

const SystemNotification = React.forwardRef(({ msg }, ref) => {
  const { user } = useSelector((state) => state.auth);

  const content = constructMessage(msg, user);

  return (
    <div
      ref={ref}
      className="text-center select-none text-sm text-gray-400 bg-gray-800 rounded-lg py-2 px-2 mx-auto my-2 max-w-sm"
    >
      {content}
    </div>
  );
});

export default SystemNotification;
