import axios from "axios";
import service from "@/services/service.js";

export default {
  getLobbies() {
    return axios({
      method: "GET",
      url: service.LOBBY_URL,
    });
  },
  createLobby() {
    return axios({
      method: "POST",
      url: service.LOBBY_URL,
      data: {
        modeId: 2,
      },
      headers: service.AUTH_HEADER,
    });
  },
  joinLobby(lobbyId) {
    return axios({
      method: "POST",
      url: service.JOIN_LOBBY_URL,
      data: {
        lobbyId: lobbyId,
      },
      headers: service.AUTH_HEADER,
    });
  },
};
