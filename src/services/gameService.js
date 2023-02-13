import axios from "axios";
import service from "@/services/service.js";

export default {
  useCard(lobby,cardsUsed) {
    return axios({
      method: "POST",
      url: service.USE_CARD_URL,
      data: {
        lobbyId:lobby,
        cardIds: cardsUsed,
      },
      headers: service.AUTH_HEADER,
    });
  },
  pickPlayer(lobby,players) {
    return axios({
      method: "POST",
      url: service.SELECT_TARGETS_URL,
      data: {
        lobbyId:lobby,
        targets: players,
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
        skillId: skillID,
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
  selectChampion(lobbyId, selectedChampionId) {
    return axios({
      method: "POST",
      url: service.SELECT_CHAMPION_URL,
      data: {
        lobbyId: lobbyId,
        championId: selectedChampionId
      },
      headers: service.AUTH_HEADER,
    });
}
  
  
};
