import axios from "axios";
import service from "@/services/service.js";

export default {
  getModes() {
    return axios({
      method: "GET",
      url: service.MODES_URL,
    });
  },
  getCards() {
    return axios({
      method: "GET",
      url: service.CARDS_URL,
    });
  },
  getChampions() {
    return axios({
      method: "GET",
      url: service.CHAMPIONS_URL,
    });
  },
};
