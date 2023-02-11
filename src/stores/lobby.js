import { defineStore } from "pinia";

export const useLobbyStore = defineStore("lobby", {
  state: () => ({
    lobby: [],
  }),
  getters: {
    getLobbyData() {
      return this.lobby;
    },
  },
  actions: {
    setLobbyData(lobbyData) {
      this.lobby = lobbyData;
    },
  },
});
