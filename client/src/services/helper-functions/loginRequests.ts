import axios from "axios";
import { ILoginState } from "../data/interfaces";
import { isAxiosError, AxiosError } from "axios";

export const fetchUser = async (loginObj: ILoginState) => {
  try {
    const response = await axios({
      method: "post",
      url: "http://localhost:3001/login",
      data: loginObj,
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
