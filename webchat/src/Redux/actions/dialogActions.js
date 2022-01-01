import { dialogs } from "../constants/constantsTypes";

export const logOutAction = (data) => {
  return {
    type: dialogs.DIALOG,
    payload: data,
  };
};
