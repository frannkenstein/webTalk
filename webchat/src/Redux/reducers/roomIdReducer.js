import { AddRoomId } from "../constants/constantsTypes";

export const INITIAL_STATE = {
  roomId: undefined,
};

export const roomIdReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AddRoomId.ADD_ROOM_ID: {
      JSON.stringify(localStorage.setItem("roomId", action.payload.data));
      let a = { roomId: undefined };

      a.roomId = action.payload.data;
      state.roomId = localStorage.getItem("roomid");

      return state;
    }
    default:
      return state;
  }
};
