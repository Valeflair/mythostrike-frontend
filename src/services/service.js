const AUTH_TOKEN = localStorage.getItem("token");
const AUTH_HEADER = {
  Authorization: "Bearer " + AUTH_TOKEN,
};
const BASE_URL = "http://localhost:8080";
const LOGIN_URL = BASE_URL + "/users/login";
const REGISTER_URL = BASE_URL + "/users/register";
const AUTH_URL = BASE_URL + "/users/data";

export default {
  LOGIN_URL,
  REGISTER_URL,
  AUTH_HEADER,
  AUTH_URL,
};
