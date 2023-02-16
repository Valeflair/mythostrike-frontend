import axios from "axios";
import service from "@/services/service.js";

export default {
  useCard(lobby, cardsUsed, playersPicked) {
    return axios({
      method: "POST",
      url: service.USE_CARD_URL,
      data: {
        lobbyId: lobby,
        cardIds: cardsUsed,
        targets: playersPicked,
      },
      headers: service.AUTH_HEADER,
    });
  },
  end(lobby) {
    return axios({
      method: "POST",
      url: service.END_TURN_URL,
      data: {
        lobbyId: lobby,
      },
      headers: service.AUTH_HEADER,
    });
  },
  useSkill(lobbyId, skillId, playersPicked) {
    return axios({
      method: "POST",
      url: service.USE_SKILL_URL,
      data: {
        lobbyId: lobbyId,
        skillId: skillId,
        targets: playersPicked,
      },
      headers: service.AUTH_HEADER,
    });
  },
  cancel(lobby) {
    return axios({
      method: "POST",
      url: service.CANCEL_URL,
      data: {
        lobbyId: lobby,
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
        championId: selectedChampionId,
      },
      headers: service.AUTH_HEADER,
    });
  },


};
