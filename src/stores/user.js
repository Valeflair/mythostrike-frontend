import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: [],
    status: false,
    currentLobbyId: null
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
      this.currentLobbyId = lobbyId;
    },
    leaveLobby(){
      this.currentLobbyId = null;
    },
    getLobbyId(){
      return this.currentLobbyId;
    }
  },
});
