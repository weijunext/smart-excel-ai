import Axios from "axios";

export const axios = Axios.create({
  baseURL: "/",
});

axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    // toast.error(message);
    console.log(message);
    return Promise.reject(error);
  }
);