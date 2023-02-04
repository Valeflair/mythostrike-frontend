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
          data:{
            modeId: 2
          },
          headers: service.AUTH_HEADER
        });
    },
    joinLobby(lobbyId) {
        return axios({
          method: "POST",
          url: service.JOIN_LOBBY_URL,
          data:{
            lobbyId: lobbyId
          },
          headers: service.AUTH_HEADER
        });
    },
    addBot(lobbyId) {
      return axios({
        method: "POST",
        url: service.ADD_BOT_LOBBY_URL,
        data:{
          lobbyId: lobbyId
        },
        headers: service.AUTH_HEADER
      });
  },
  start(lobbyId) {
    return axios({
      method: "POST",
      url: service.START_LOBBY_URL,
      data:{
        lobbyId: lobbyId
      },
      headers: service.AUTH_HEADER
    });
},
leave(lobbyId) {
  return axios({
    method: "POST",
    url: service.LEAVE_LOBBY_URL,
    data:{
      lobbyId: lobbyId
    },
    headers: service.AUTH_HEADER
  });
},
changeMode(lobbyId,newModeId) {
  return axios({
    method: "PUT",
    url: service.CHANGE_MODE_LOBBY_URL,
    data:{
      lobbyId: lobbyId,
      newModeId: newModeId
    },
    headers: service.AUTH_HEADER
  });
},
  };