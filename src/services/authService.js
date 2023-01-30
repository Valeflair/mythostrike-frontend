import axios from "axios";
import service from "@/services/service.js";

export default {
  login(user) {
    return axios({
      method: "POST",
      url: service.LOGIN_URL,
      data: {
        username: user.username,
        password: user.password,
      },
    });
  },
  register(user) {
    return axios({
      method: "POST",
      url: service.REGISTER_URL,
      data: {
        username: user.username,
        password: user.password,
      },
      headers: service.AUTH_HEADER,
    });
  },
  auth() {
    return axios({
      method: "POST",
      url: service.AUTH_URL,
      headers: service.AUTH_HEADER,
    });
  },
};
