<script setup>
import slotView from "../components/lobbyComponents/SlotField.vue";
import ModeSelection from "../components/lobbyComponents/ModeSelection.vue"
import axios from "axios";
</script>

<template>
  <div class="bg-image">
     <mode-selection 
    v-if="isModeShown"
    @close:Mode="toggleModeSelection"
    @confirm:Mode="confirmMode"
    :lobbyleader="this.currentLeader"
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
      :lobbyLeaderProp="this.currentLeader"
      :slotsProp="this.slots"
      :gameModesProp="this.gameModes"
      @update:Mode="toggleModeSelection"
      @update:leave="leave"
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
      currentLeader:'Number',
      currentMode: 'Number',
      gameModes: 'Array',
      lobbyID: 'Lobbyid',
      isModeShown:false,
      players: 'Array',
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
              this.$router.push({ path: "./championselect" });
            },
            (error) => {
              console.log("fehler, game starten");
              console.log(error);
              this.$router.push({ path: "./championselect" });
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
    },
    async initModes(){
      await axios
        .get("https://d9dcb8ef-9e92-41b7-952b-8af025909aa0.mock.pstmn.io/resources/modes")
        .then(
          (response) => {
            console.log("erfolgreich, mode data initialisiert");
            this.gameModes = response.data;
            console.log(response.data); 
            this.$nextTick(() => {
                    // Your DOM update code here
                });
          },
          (error) => {
            console.log("fehler, mode data initialisieren");
            console.log(error);
          }
          )
    }
  },
  created(){
    this.initModes();
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
