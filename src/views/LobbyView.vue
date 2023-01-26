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
      @confirm:Mode="confirmMode"
      @update:Mode="toggleModeSelection"
      @update:leave="leave"
      @update:players="updatePlayers"
    />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    confirmMode(newMode) {
      this.currentMode = newMode;
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
          .get("https://92f6dac7-672e-4bc6-b445-d8221dd9156b.mock.pstmn.io/lobbies")
          .then(
            (response) => {
              console.log(response.data);
              console.log("nice");
              this.$router.push({ path: "./lobbyoverview" });
            },
            (error) => {
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
