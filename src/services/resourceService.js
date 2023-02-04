import axios from "axios";
import service from "@/services/service.js";

export default {
    getModes() {
        return axios({
          method: "GET",
          url: service.MODES_URL,
        });
    },
  
};
