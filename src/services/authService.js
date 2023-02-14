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
    });
  },
  auth() {
    return axios({
      method: "POST",
      url: service.AUTH_URL,
      headers: service.AUTH_HEADER,
    });
  },
  changeAvatar(newAvatarId) {
    return axios({
      method: "POST",
      url: service.CHANGE_AVATAR_URL,
      data: {
        avatarNumber: newAvatarId
      },
      headers: service.AUTH_HEADER,
    });
  },
};
