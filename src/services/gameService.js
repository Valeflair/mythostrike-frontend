import axios from "axios";
import service from "@/services/service.js";

export default {
    selectChampion(lobbyId, selectedChampionId) {
        return axios({
          method: "POST",
          url: service.SELECT_CHAMPION_URL,
          data: {
            lobbyId: lobbyId,
            selectedChampionId: selectedChampionId
          },
          headers: service.AUTH_HEADER,
        });
    },
}