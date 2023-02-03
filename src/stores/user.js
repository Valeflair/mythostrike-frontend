import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: [],
    status: false,
    currentLobby: null
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
    joinLobby(lobbyId){
      this.currentLobby = lobbyId;
    },
    leaveLobby(){
      this.currentLobby = null;
    },
    getLobby(){
      return this.currentLobby;
    }
  },
});
