<template>
  <div class="bg-image">
    
     <Mode-selection 
    v-if="isModeShown"
    @close:Mode="toggleModeSelection"
    @confirm:Mode="confirmMode"
    :isLobbyOwner= "this.isLobbyOwner"
    :modes="this.gameModes"
    :currentModeId="this.currentModeId"
  />



<div class="slotStyle">

    <SlotView
      :lobbyId="this.lobbyID"
      :lobbyLeader="this.currentLeader"
      :isLobbyOwner= "this.isLobbyOwner"
      :slotsProp="this.slots"
      :gameModeName="this.currentModeName"
      @confirm:Mode="confirmMode"
      @update:Mode="toggleModeSelection"
      @update:leave="leave"
      @open:game="start"
      @update:bot="addBot"
    />
    </div>
  </div>
</template>

<script>
import SlotView from "../components/SlotField.vue";
import ModeSelection from "../components/ModeSelection.vue"
import axios from "axios";
export default {
  data() {
    return {
      slots: [
        { id: 0, username: "A1" },
        { id: 1, username: "C2" },
        { id: 2, username: "B3" },
        { id: 3, username: "D4" },
        { id: 4, username: "G5" },
        { id: 5, username: "T6" },
        { id: 6, username: "Y7" },
        { id: 7, username: "R8" },
      ],
      gameModes:[],
      currentModeName:"",
      currentLeader: "Holder",
      currentModeId: 0,
      lobbyID: 5045,
      isModeShown: false,
      isLobbyOwner: false
    };
  },
  components: {
    SlotView,
    ModeSelection,
  },
  methods: {
    addBot() {
      console.log("add Bot");
    },
    start(){
      this.$router.push({ path: "./championselection" });
    },
    confirmMode(newMode) {
      this.currentModeId = newMode;
      console.log("newMode" + newMode);
    },
    toggleModeSelection(){
      this.isModeShown=!this.isModeShown;
    },
    leave(){
        console.log("leave");
    },
    async initModes(){
      await axios
        .get("http://localhost:8080/resources/modes")
        .then(
          (response) => {
            console.log("erfolgreich, mode data initialisiert");
            this.gameModes = response.data;
            console.log(response.data); 
            this.$nextTick(() => {
              this.currentModeName = this.gameModes[this.currentModeId].name;
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
  },
  watch: {
    currentModeId(){
      this.currentModeName= this.gameModes[this.currentModeId].name;
    }
  }
};
</script>

<style scoped>
.bg-image {
  background: url("@/assets/backgrounds/lobby_background.png");
  height: 100vh;
  background-size:cover;
  background-repeat: no-repeat;
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
