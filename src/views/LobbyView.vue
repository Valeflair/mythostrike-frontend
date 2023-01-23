<script setup>
import slotView from "../components/lobbyComponents/SlotField.vue";
import modes from "../data/gameMode.json";
import ModeSelection from "../components/lobbyComponents/ModeSelection.vue"
import playerDatas from "@/data/players.json";

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


<header><h1>{{this.gameModes[this.currentMode].name}}</h1></header>

<div class="slotStyle">
    <slotView
      :lobbyId="this.lobbyID"
      :currentModeProp="this.currentMode"
      :playersProp="this.players"
      :currentPlayerProp="this.currentPlayer"
      :lobbyLeaderProp="checkPlayer(this.currentLeader)"
      @confirm:Mode="confirmMode"
      @update:Mode="toggleModeSelection"
      @update:leave="leave"
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
    leave(){
      if(this.currentPlayer===this.currentLeader){
        console.log("same leader and curr player");
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
      
    }
    
  },
};
</script>

<style scoped>
.bg-image {
  background: url("@/assets/backgrounds/start_background.png");
  height: 100vh;
}
.slotStyle{
  position: relative;   
  height:94.8%;
  
}

header h1{
  text-align: center;
  
}
</style>
