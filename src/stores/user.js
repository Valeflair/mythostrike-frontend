import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: [],
    status: false,
  }),
  getters: {
    getUserData() {
      return this.user;
    },
  },
  actions: {
    setUserData(user) {
      this.user = user;
      this.status = true;
    },
    getStatus() {
      return this.status;
    },
  },
});
