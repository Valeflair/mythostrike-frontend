const AUTH_TOKEN = localStorage.getItem("token");
const AUTH_HEADER = {
  Authorization: "Bearer " + AUTH_TOKEN,
};
const BASE_URL = "http://localhost:8080";
const LOBBY_URL = BASE_URL + "/lobbies";
const RES_URL = BASE_URL + "/resources";
const MODES_URL = RES_URL + "/modes";
const LOGIN_URL = BASE_URL + "/users/login";
const REGISTER_URL = BASE_URL + "/users/register";
const AUTH_URL = BASE_URL + "/users/data";
const JOIN_LOBBY_URL = LOBBY_URL + "/join";
const ADD_BOT_LOBBY_URL = LOBBY_URL + "/bot";
const CHANGE_MODE_LOBBY_URL = LOBBY_URL + "/mode";
const START_LOBBY_URL = LOBBY_URL + "/start";
const LEAVE_LOBBY_URL = LOBBY_URL + "/leave";

export default {
  LOGIN_URL,
  REGISTER_URL,
  AUTH_HEADER,
  AUTH_URL,
  LOBBY_URL,
  JOIN_LOBBY_URL,
  ADD_BOT_LOBBY_URL,
  CHANGE_MODE_LOBBY_URL,
  START_LOBBY_URL,
  LEAVE_LOBBY_URL,
  MODES_URL
};
