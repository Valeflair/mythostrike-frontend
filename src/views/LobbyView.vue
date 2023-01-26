<script setup>
import slotView from "../components/lobbyComponents/SlotField.vue";
import modes from "../data/modes.json";
import ModeSelection from "../components/lobbyComponents/ModeSelection.vue"
import playerDatas from "@/data/players.json";
import axios from "axios";
</script>

<template>
  <div class="bg-image">
    
     <mode-selection 
    v-if="isModeShown"
    @close:Mode="toggleModeSelection"
    @confirm:Mode="confirmMode"
    :lobbyleader="checkPlayer(this.currentLeader)"
    :currentplayer="currentPlayer"
    :currentModeProp="currentMode"
  />



<div class="slotStyle">
  <header><h1>{{this.gameModes[this.currentMode].name}}</h1></header>

    <slotView
      :lobbyId="this.lobbyID"
      :currentModeProp="this.currentMode"
      :playersProp="this.players"
      :currentPlayerProp="this.currentPlayer"
      :lobbyLeaderProp="checkPlayer(this.currentLeader)"
      :slotsProp="this.slots"
      @confirm:Mode="confirmMode"
      @update:Mode="toggleModeSelection"
      @update:leave="leave"
      @update:players="updatePlayers"
      @open:game="start"
      @update:bot="addBot"
      @update:slots="changeSeat"
    />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slots: [
        { id: 0, playerId: -1 },
        { id: 1, playerId: -1 },
        { id: 2, playerId: -1 },
        { id: 3, playerId: -1 },
        { id: 4, playerId: -1 },
        { id: 5, playerId: -1 },
        { id: 6, playerId: -1 },
        { id: 7, playerId: -1 },
      ],
      currentLeader:0,
      currentPlayer: 0,
      currentMode: 0,
      gameModes: modes,
      lobbyID: 5045,
      isModeShown:false,
      players: playerDatas,
      playerAxios: Array,
     // lobbyLeader:Object,
      defaultPlayer: {
        id: -1,
        name: "Empty",
        occupation: "Bot",
        seat: -1,
      },
    };
  },
  components: {
    slotView,
    ModeSelection,
  },
  methods: {
    async changeSeat(newSlots){
      this.slots = newSlots;
      await axios
          .put("https://92f6dac7-672e-4bc6-b445-d8221dd9156b.mock.pstmn.io/lobbies/seats",{
            newSeatId: seatID,
            lobbyId : this.lobbyID
          })
          .then(
            (response) => {
              console.log(response.status);
              console.log("erfolreich platz gewechselt");
            },
            (error) => {
              console.log("fehler, seat wechseln");
              console.log(error);
            }
          );
    },

    async addBot() {
      await axios
          .put("https://92f6dac7-672e-4bc6-b445-d8221dd9156b.mock.pstmn.io/lobbies/bot",{
            id : this.lobbyID
          })
          .then(
            (response) => {
              console.log(response.status);
              console.log("erfolreich bot geadded");
            },
            (error) => {
              console.log("fehler, bot adden");
              console.log(error);
            }
          );


    },
    
    async start(){
      await axios
          .post("https://92f6dac7-672e-4bc6-b445-d8221dd9156b.mock.pstmn.io/lobbies/start",{
            id:this.lobbyID
          })
          .then(
            (response) => {
              console.log(response.status);
              console.log("erfolgreich game gestartet");
            },
            (error) => {
              console.log("fehler, game starten");
              console.log(error);
            }
          );
    },
    async confirmMode(newMode) {
      this.currentMode = newMode;
      await axios
          .put("https://92f6dac7-672e-4bc6-b445-d8221dd9156b.mock.pstmn.io/lobbies/mode",{
            newModeId: this.currentMode,
            lobbyId : this.lobbyID
          })
          .then(
            (response) => {
              console.log(response.status);
              console.log("erfolreich mode gewechselt");
            },
            (error) => {
              console.log("fehler, mode wechseln");
              console.log(error);
            }
          );


    },
    toggleModeSelection(){
      this.isModeShown=!this.isModeShown;
    },
    checkPlayer(playerId) {
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id === playerId) return this.players[i];
      }
      return this.defaultPlayer;
    },
    updatePlayers(newPlayers){
      this.players = newPlayers;
    },
    async leave(){
      await axios
          .post("https://92f6dac7-672e-4bc6-b445-d8221dd9156b.mock.pstmn.io/lobbies/leave",{
            id:this.lobbyID,
          })
          .then(
            (response) => {
              console.log(response.status);
              console.log("erfolgreich lobby verlassen");
              this.$router.push({ path: "./lobbyoverview" });
            },
            (error) => {
              console.log("fehler, lobby verlassen");
              console.log(error);
            }
          );

    /*  if(this.currentPlayer===this.currentLeader){
        let i=0;
        while(i<this.players.length && this.currentLeader===this.currentPlayer ){
            if(this.players[i].id!==this.currentPlayer){
              if(this.players[i].occupation!=='Bot'){
                this.currentLeader=this.players[i].id;
              }
            }
            i++;
        }
      }
      this.players = this.players.filter(player => player.id !== this.currentPlayer);
      */
     

    }
    
  },
  mounted(){
  
  let link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '@/assets/backgrounds/modeselect_background.png';
  document.head.appendChild(link);
  // you can repeat the above code for multiple images
}
};
</script>

<style scoped>
.bg-image {
  background: url("@/assets/backgrounds/start_background.png");
  height:100%;
  width: 100%;
}
.slotStyle{
  position: relative;   
  height:100%;
  width: 100%;
}

header h1{
  text-align: center;
  
}
</style>
