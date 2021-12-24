import { AddRoomId } from "../constants/constantsTypes.ts";

export const setRoomId = (data) => {
  return {
    type: AddRoomId.ADD_ROOM_ID,
    payload: { data },
  };
};
