import axios from "axios";
import service from "@/services/service.js";

export default {
  getLobbies() {
    return axios({
      method: "GET",
      url: service.RES_LOBBY_URL,
    });
  },
};
