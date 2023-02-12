import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: [],
    status: false,
  }),
  getters: {
    getUser() {
      return this.user;
    },
  },
  actions: {
    setUser(user) {
      this.user = user;
      this.status = true;
    },
    getStatus() {
      return this.status;
    },
  },
});
