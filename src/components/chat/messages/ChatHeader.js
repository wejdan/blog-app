import React, { useMemo } from "react";
import Avatar from "../../UI/Avatar";
import {
  formatLastSeen,
  formatParticipantNames,
  getChatData,
} from "../../../utils/chat";
import { useSelector } from "react-redux";

function ChatHeader({ chat }) {
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers, allUsers } = useSelector((state) => state.chat);

  const chatInfo = useMemo(() => {
    return getChatData(chat, user, allUsers);
  }, [chat, user, allUsers]);

  const status = useMemo(() => {
    if (!chat || !chatInfo) return '';
    if (chatInfo.isGroup) {
      return chatInfo.typingStatus ? chatInfo.typingStatus : formatParticipantNames(chatInfo.participants);
    } else {
      if (chatInfo.typing) {
        return "Typing...";
      }
      if (onlineUsers.includes(chatInfo._id)) {
        return "Online";
      }
      return formatLastSeen(chatInfo.lastSeen);
    }
  }, [chatInfo, onlineUsers]);


  if (!chat) return;

  return (
    <div
      className={`flex items-center justify-between p-3 cursor-pointer bg-gray-800 `}
    >
      <div className="flex items-center">
        <div className="relative">
          <Avatar imageUrl={chatInfo.profileImg} size="8" />
        </div>
        <div className="flex-1 min-w-0 ml-4">
          <p className="text-xs font-semibold truncate">{chatInfo.name}</p>
          <p className="text-[10px]">{status}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
