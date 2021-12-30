import { SocketAction } from "../constants/constantsTypes";

var INITIAL_STATE = {
  socketVal: "",
};

export const socketValue = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SocketAction.ADD_SOCKET:
      return {
        socketVal: action.payload.data,
      };

    default:
      return state;
  }
};
