import socketService from "../../services/socketService";
import { receiveMessage, setOnlineUsers } from "../chatSlice";
// Function to setup event listeners
const setupSocketEventListeners = (dispatch, user) => {
  const onMessageReceived = (msg) => {
    dispatch(receiveMessage(msg));
  };

  const onUsersUpdated = (users) => {
    console.log("user", user);
    const filteredUsers = users.filter((onlineUser) => onlineUser._id !== user);
    dispatch(setOnlineUsers(filteredUsers));
  };

  socketService.setupListeners(onMessageReceived, onUsersUpdated);
};

// Function to initiate socket connection and setup listeners
const initiateSocketConnection = (dispatch, accessToken, user) => {
  if (accessToken && !socketService.isConnected()) {
    socketService.connect(accessToken);
    setupSocketEventListeners(dispatch, user);
  }
};

export function socketMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    switch (action.type) {
      case "INIT_APP":
      case "auth/authenticate":
      case "auth/setTokens": {
        const accessToken =
          action.type === "INIT_APP"
            ? getState().auth.accessToken
            : action.payload.user?.accessToken || action.payload.accessToken;

        initiateSocketConnection(dispatch, accessToken, getState().auth.user);
        break;
      }
      case "auth/logoutAction": {
        socketService.disconnect();
        break;
      }
      // Handle other actions or default behavior
      default:
        break;
    }

    return next(action);
  };
}
