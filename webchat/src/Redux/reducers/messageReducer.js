import { Messages } from "../constants/constantsTypes";

var initialState = {};
export const messageList = (state = initialState, action) => {
  switch (action.type) {
    case Messages.LOAD_MESSAGES:
      return {
        [action.payload.data.receiverId]: action.payload.data.messages,
      };

    case Messages.ADD_MESSAGES:
      let a = action.payload.data.message;
      var message = state[action.payload.data.receiverId];

      message.push(a);
      return {
        ...state,
        [action.payload.data.receiverId]: message,
      };
    case Messages.CLEAR_MESSAGES: {
      return (state = {});
    }
    default:
      return state;
  }
};
