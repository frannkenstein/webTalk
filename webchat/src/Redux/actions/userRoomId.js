import { userRoomID } from "../constants/constantsTypes.ts";

export const setUserRoomID = (data) => {
  return {
    type: userRoomID.ADD_ROOM_ID,
    payload: data,
  };
};
