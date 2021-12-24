import { NewMessages } from "../constants/constantsTypes";

let data = JSON.parse(localStorage.getItem("unread")) ?? [];
let d;

if (data?.ids?.length) {
  d = data.ids;
} else {
  d = [];
}
var initial = {
  ids: d,
};

export const newMessageList = (state = initial, action) => {
  switch (action.type) {
    case NewMessages.ADD_NEW_MESSAGE: {
      let mess = { ids: [...state.ids, action.payload.data.roomId] };

      localStorage.setItem("unread", JSON.stringify(mess));
      return mess;
    }

    case NewMessages.CLEAR_NEW_MESSAGE: {
      let mess = state;

      let filtered = mess.ids.filter((ids) => ids !== action.payload.data);

      mess.ids = filtered;
      state.ids = mess.ids;

      localStorage.setItem("unread", JSON.stringify(mess));
      return state;
    }

    default:
      return state;
  }
};
