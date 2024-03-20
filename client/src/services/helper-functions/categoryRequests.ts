import axios from "axios";
import { AxiosError, isAxiosError } from "axios";
import { IResponseData } from "../data/interfaces";

export const addCategory = async (key: string) => {
  try {
    const data: IResponseData = JSON.parse(localStorage.getItem("user")!);
    const tokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };

    axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.stringify(
      tokens
    )}`;

    const response = await axios({
      method: "post",
      url: "http://localhost:3001/category/add",
      data: { category: key },
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

export const removeCategory = async (id: number) => {
  try {
    const data: IResponseData = JSON.parse(localStorage.getItem("user")!);
    const tokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };

    axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.stringify(
      tokens
    )}`;

    const response = await axios({
      method: "post",
      url: "http://localhost:3001/category/remove",
      data: { id: id },
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
