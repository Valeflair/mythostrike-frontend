import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: [],
  }),
  getters: {
    getUserData() {
      return this.user;
    },
  },
  actions: {
    setUserData(user) {
      this.user = user;
    }
  },
});
