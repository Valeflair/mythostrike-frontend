import axios from "axios";
import service from "@/services/service.js";

export default {
  useCard(lobby,cardsUsed) {
    return axios({
      method: "POST",
      url: service.USE_CARD_URL,
      data: {
        lobbyId:lobby,
        playedCards: cardsUsed,
      },
      headers: service.AUTH_HEADER,
    });
  },
  playerPicked(lobby,players) {
    return axios({
      method: "POST",
      url: service.SELECT_TARGETS_URL,
      data: {
        lobbyId:lobby,
        selectedTargets: players,
      },
      headers: service.AUTH_HEADER,
    });
  },
  end(lobby) {
    return axios({
      method: "POST",
      url: service.END_TURN_URL,
      data: {
        lobbyId:lobby,
      },
      headers: service.AUTH_HEADER,
    });
  },
  useSkill(lobby,skillID) {
    return axios({
      method: "POST",
      url: service.USE_CARD_URL,
      data: {
        lobbyId:lobby,
        activeSkillId: skillID,
      },
      headers: service.AUTH_HEADER,
    });
  },
  cancel(lobby) {
    return axios({
      method: "POST",
      url: service.CANCEL_URL,
      data: {
        lobbyId:lobby,
      },
      headers: service.AUTH_HEADER,
    });
  },
  
  
};
