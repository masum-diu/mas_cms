import axios from "axios";
const instance = axios.create({
  baseURL: "https://tst.etherstaging.xyz/api",
  // baseURL: "https://msb.etherstaging.xyz/api",

  headers: {
    "Content-Type": "application/json",
    timeout: 1000,
  },
});

export default instance;
