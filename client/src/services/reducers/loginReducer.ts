import { ILoginState, IResponseData } from "../data/interfaces";
// fetch from local storage if the user exists, this enables stay logged in feature
const val: IResponseData = JSON.parse(localStorage.getItem("user")!);

const initialState: ILoginState = {
  email: val ? val.user_data.email : "",
  password: val ? val.user_data.password : "",
  isAuthenticated: val ? true : false,
};

type actionType = { type: string; payload?: string };

export const loginReducer = (state = initialState, action: actionType) => {
  switch (action.type) {
    case "login/email":
      return { ...state, email: action.payload! };
    case "login/password":
      return { ...state, password: action.payload! };
    case "login/authenticate":
      return { ...state, isAuthenticated: !state.isAuthenticated };
    default:
      return state;
  }
};
