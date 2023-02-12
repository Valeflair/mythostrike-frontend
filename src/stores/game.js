import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => ({
    game: [],
  }),
  getters: {
    getGameData() {
      return this.game;
    },
  },
  actions: {
    setGameData(gameData) {
      this.game = gameData;
    },
  },
});