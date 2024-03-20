import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "./services/reducers/loginReducer";
import { signupReducer } from "./services/reducers/signupReducer";
import { userReducer } from "./services/reducers/userReducer";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    signup: signupReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
