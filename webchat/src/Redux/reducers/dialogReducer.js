import { dialogs } from "../constants/constantsTypes";

export const INITIAL_STATE = {
  logoutDialog: false,
};

export const dialogsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case dialogs.DIALOG:
      return {
        ...state,
        logoutDialog: action.payload,
      };

    default:
      return state;
  }
};

//User Details will be saved later
