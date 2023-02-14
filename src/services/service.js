const AUTH_TOKEN = localStorage.getItem("token");
const AUTH_HEADER = {
  Authorization: "Bearer " + AUTH_TOKEN,
};
const BASE_URL = "http://localhost:8080";

const LOBBY_URL = BASE_URL + "/lobbies";
const RES_URL = BASE_URL + "/resources";
const USER_URL = BASE_URL + "/users";
const GAME_URL = BASE_URL + "/games/play";

const CHANGE_AVATAR_URL = USER_URL + "/avatar";

const LOGIN_URL = USER_URL + "/login";
const REGISTER_URL = USER_URL + "/register";
const AUTH_URL = USER_URL + "/data";

const MODES_URL = RES_URL + "/modes";
const CARDS_URL = RES_URL + "/cards";
const CHAMPIONS_URL = RES_URL + "/champions";

const JOIN_LOBBY_URL = LOBBY_URL + "/join";
const ADD_BOT_LOBBY_URL = LOBBY_URL + "/bot";
const CHANGE_MODE_LOBBY_URL = LOBBY_URL + "/mode";
const START_LOBBY_URL = LOBBY_URL + "/start";
const LEAVE_LOBBY_URL = LOBBY_URL + "/leave";
const SEAT_LOBBY_URL = LOBBY_URL + "/seats";

const SELECT_CHAMPION_URL = GAME_URL + "/champion";

const WS_URL = BASE_URL + "/updates";

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
  MODES_URL,
  SEAT_LOBBY_URL,
  WS_URL,
  SELECT_CHAMPION_URL,
  CARDS_URL,
  CHAMPIONS_URL,
  CHANGE_AVATAR_URL
};
