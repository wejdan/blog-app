import {
  CameraIcon,
  DocumentTextIcon,
  MicrophoneIcon,
  PaperClipIcon,
  PhotographIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import React, { forwardRef } from "react";

const AttachmentMenu = forwardRef(({ show, onClose, items }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute bottom-0 right-0 transform transition-opacity ease-out ${
        show
          ? "scale-100 opacity-100 -translate-y-10"
          : "scale-0 opacity-0 translate-y-0"
      } origin-bottom`}
      style={{
        // Separate transition properties with individual durations
        transition: `transform 300ms ease-out, opacity 100ms ease-out`,
        willChange: "transform, opacity",
      }}
    >
      <ul className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              item.action();
              onClose();
            }}
            className={`${item.bgClass} w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${item.hoverClass} transition-colors`}
          >
            <item.icon className="h-6 w-6 text-white" />
          </div>
        ))}
        {/* ... more items */}
      </ul>
    </div>
  );
});

export default AttachmentMenu;
