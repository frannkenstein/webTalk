import { userRoomID } from "../constants/constantsTypes";

export const UserRoomID = {};

export const userRoomIdReducer = (state = UserRoomID, action) => {
  switch (action.type) {
    case userRoomID.ADD_ROOM_ID:
      return (state = {
        ...state,
        [action.payload.friendId]: action.payload.userRoomId,
      });

    default:
      return state;
  }
};
