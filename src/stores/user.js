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
    changeAvatar(newAvatarId){
      this.user.avatarNumber = newAvatarId;
    },
    getStatus() {
      return this.status;
    },
    reset(){
      this.user = [];
    }
  },
});
