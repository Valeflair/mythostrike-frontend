<script setup>

</script>

<template>
  <v-container >
    <v-row >
      <v-col cols="3" class="labelMove">
        <div class="labelclass">{{ labelLobbyID }}: {{ this.lobbyId }}</div>
        <div class="labelclass">
          {{ labelHost }}: {{ lobbyLeader.name }}
        </div>
        <div class="labelclass">
          {{ labelPlayers }}: {{ playerData.length }}/{{ this.seats.length }}
        </div>
      </v-col>
      <v-col cols="3" class="buttonMove">
        <button class="seatButton" @click="selectMode">{{ labelModes }}</button>
        <button class="seatButton">{{ labelInvite }}</button>
        <!-- :disabled="this.cPlayer !== this.lobbyLeader.id" überprüfung ob der spieler lobby leader ist -->
        <button
          class="seatButton"
          @click="start"
        >
          {{ labelStart }}
        </button>
      </v-col>
      <v-col cols="3" class="buttonMove">
        <button class="seatButton" @click="openOptions">{{ labelOptions }}</button>
        <div class="dropdown">
          <button class="seatButton" @click="addBot">{{ labelAddBot }}</button>
        <!--  <div class="dropdown-content">
            <a href="#">Link 1</a>
            <a href="#">Link 2</a>
            <a href="#">Link 3</a>
          </div>-->
        </div>
        <button class="seatButton" @click="leave">{{ labelLeave }}</button>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      labelLobbyID: "LobbyID",
      labelHost: "Host",
      labelPlayers: "Playes",
      labelModes: "Select Mode",
      labelInvite: "Invite",
      labelStart: "Start Game",
      labelOptions: "Options",
      labelAddBot: "Add Bot",
      labelLeave: "Leave",
      playerData: this.players,
      lobbyLeader: this.Lobbyleader,
      seats: this.slots,
      currentMode: this.modeProp,
      gameModes: this.gameModesProp,
    };
  },
  props: {
    players: {
      player: Object,
    },
    lobbyId: Number,
    Lobbyleader: Object,
    currentPlayer: Number,
    slots: Array,
    modeProp: Object,
    gameModesProp: Array,
  },
  methods: {
    start() {
      this.$emit('open:game');  
    },
    selectMode() {
      this.$emit("open:Mode");
    },
    leave(){
      this.$emit("update:leave");
    }
  },
};
</script>

<style scoped>
.labelclass{
  text-align: center;
  font-size: 150%;
  color:yellow;
  margin-top: 2vh;
  margin-bottom: 2vh;
} 


.buttonMove{
  margin-left: 3vh;
  margin-right: 5vh;

}

.seatButton {
  border: none;
  color: white;
  padding: 14px 40px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: 12vw;
  border-radius: 12px;
  margin-top: 5px;
  margin-bottom: 5px;
  transition-duration: 0.4s;
  background-image: url("@/assets/ModeSelectionAssets/commandButton.png");
  
}

.seatButton:hover {
  background-color: red;
  color: #4caf50;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .seatButton {
}
</style>
