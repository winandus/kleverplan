import { create } from "apisauce";

// define the api
export const api = create({
  baseURL: " http://127.0.0.1:14134",
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});
