import { ISignupState } from "../data/interfaces";

const initialState: ISignupState = {
  email: "",
  name: "",
  password: "",
  showVerify: false,
};

type actionType = { type: string; payload?: string };

export const signupReducer = (state = initialState, action: actionType) => {
  switch (action.type) {
    case "signup/name":
      return { ...state, name: action.payload! };
    case "signup/email":
      return { ...state, email: action.payload! };
    case "signup/password":
      return { ...state, password: action.payload! };
    case "signup/verify":
      return { ...state, showVerify: !state.showVerify };
    default:
      return state;
  }
};
