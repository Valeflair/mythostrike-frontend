import { defineStore } from "pinia";

export const useLobbyStore = defineStore("lobby", {
  state: () => ({
    lobby: [],
    identity:"",
    selectableChampions:[],
    stompClient:[]
  }),
  getters: {
    getLobby() {
      return this.lobby;
    }
  },
  actions: {
    setLobby(lobbyData) {
      this.lobby = lobbyData;
    },
    setChampions(championsData){
      this.selectableChampions = championsData;
    },
    getChampions(){
      return this.selectableChampions;
    },
    setIdentity(identity){
      this.identity = identity;
    },
    getIdentity(){
      return this.identity;
    },
    setStompClient(client){
      this.stompClient = client;
    },
    getStompClient(){
      return this.stompClient;
    },
    reset(){
      this.lobby = [];
      this.selectableChampions = [];
    }
  },
});
