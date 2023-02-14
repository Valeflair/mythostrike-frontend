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
        modeId: 0,
      },
      headers: {Authorization: "Bearer " + localStorage.getItem("token")}
    });
  },
  joinLobby(lobbyId) {
    return axios({
      method: "POST",
      url: service.JOIN_LOBBY_URL,
      data: {
        lobbyId: lobbyId,
      },
      headers: {Authorization: "Bearer " + localStorage.getItem("token")}
    });
  },
  addBot(lobbyId) {
    return axios({
      method: "POST",
      url: service.ADD_BOT_LOBBY_URL,
      data: {
        lobbyId: lobbyId,
      },
      headers: {Authorization: "Bearer " + localStorage.getItem("token")}
    });
  },
  start(lobbyId) {
    return axios({
      method: "POST",
      url: service.START_LOBBY_URL,
      data: {
        lobbyId: lobbyId,
      },
      headers: {Authorization: "Bearer " + localStorage.getItem("token")}
    });
  },
  leave(lobbyId) {
    return axios({
      method: "POST",
      url: service.LEAVE_LOBBY_URL,
      data: {
        lobbyId: lobbyId,
      },
      headers: {Authorization: "Bearer " + localStorage.getItem("token")}
    });
  },
  changeMode(lobbyId, newModeId) {
    return axios({
      method: "PUT",
      url: service.CHANGE_MODE_LOBBY_URL,
      data: {
        lobbyId: lobbyId,
        newModeId: newModeId,
      },
      headers: {Authorization: "Bearer " + localStorage.getItem("token")}
    });
  },
  changeSeat(lobbyId, newSeatId) {
    return axios({
      method: "PUT",
      url: service.SEAT_LOBBY_URL,
      data: {
        lobbyId: lobbyId,
        newSeatId: newSeatId,
      },
      headers: {Authorization: "Bearer " + localStorage.getItem("token")}
    });
  },
};
