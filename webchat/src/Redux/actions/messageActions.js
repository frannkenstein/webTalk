import { Messages } from "../constants/constantsTypes";

export const loadMesages = (data) => {
  return {
    type: Messages.LOAD_MESSAGES,
    payload: { data: data },
  };
};

export const addMessage = (data) => {
  return {
    type: Messages.ADD_MESSAGES,
    payload: { data: data },
  };
};

export const clearMessages = () => {
  return {
    type: Messages.CLEAR_MESSAGES,
  };
};
