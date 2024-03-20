import axios, { AxiosError, isAxiosError } from "axios";
import { ISignupState } from "../data/interfaces";

export const addUser = async (signupObj: ISignupState) => {
  try {
    const response = await axios({
      method: "post",
      url: "http://localhost:3001/signup",
      data: signupObj,
    });

    if (response) return response;
  } catch (err) {
    // in axios everything except a 200 status response executes catch block
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError;

      if (axiosErr.response) {
        return axiosErr.response;
      }
    }

    console.error(err);
  }
};

export const verifyUser = async (otp: string, signupObj: ISignupState) => {
  try {
    const response = await axios({
      method: "post",
      url: "http://localhost:3001/signup/verify",
      data: {
        otp: otp,
        email: signupObj.email,
        password: signupObj.password,
        name: signupObj.name,
      },
    });

    if (response) return response;
  } catch (err) {
    // in axios everything except a 200 status response executes catch block
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError;

      if (axiosErr.response) {
        return axiosErr.response;
      }
    }

    console.error(err);
  }
};
