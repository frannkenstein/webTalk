import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { usersList } from "./Redux/reducers/usersReducers.js";
import { messageList } from "./Redux/reducers/messageReducer.js";
import { myReply } from "./Redux/reducers/replyReducer.js";
import { detailsReducer } from "./Redux/reducers/friendDetailsReducer.js";
import { showProfileReducer } from "./Redux/reducers/profileReducer.js";
import { showOnlineUsers } from "./Redux/reducers/onlineReducer.js";
import { newMessageList } from "./Redux/reducers/newMessageReducer.js";
import { roomIdReducer } from "./Redux/reducers/roomIdReducer.js";
import { friendReducer } from "./Redux/reducers/friendReducer.js";
import { loadReplyList } from "./Redux/reducers/loadReplyReducer.js";
import { socketValue } from "./Redux/reducers/socketReducer.js";
import { groupsList } from "./Redux/reducers/groupsReducer.js";
import { userRoomIdReducer } from "./Redux/reducers/userRoomReducer.js";
export const reducer = combineReducers({
  users: usersList,
  messages: messageList,
  reply: myReply,
  friendDetails: detailsReducer,
  showProfile: showProfileReducer,
  showOnlineUsers: showOnlineUsers,
  newMessages: newMessageList,
  roomId: roomIdReducer,
  friends: friendReducer,
  loadReply: loadReplyList,
  socketValue: socketValue,
  groups: groupsList,
  userRoomIdReducer: userRoomIdReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,

  composeEnhancer(applyMiddleware(thunk))
);

export default store;
