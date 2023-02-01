<script setup>
</script>

<template>
  <v-container >
    <v-row >
      <v-col cols="3" class="labelMove">
        <div class="labelclass">Lobby ID: {{ this.lobbyId }}</div>
        <div class="labelclass">
          Owner: {{ this.lobbyleader }}
        </div>
        <div class="labelclass">
          Players: 8/8
        </div>
      </v-col>
      <v-col cols="3" class="buttonMove">
        <button class="seatButton" @click="selectMode" :disabled="!this.isLobbyOwner">Select Mode</button>
        <button class="seatButton">Invite</button>
        <button
          class="seatButton"
          @click="start"
          :disabled="!this.isLobbyOwner"
        >
          Start Game
        </button>
      </v-col>
      <v-col cols="3" class="buttonMove">
        <button class="seatButton">Options</button>
        <div class="dropdown">
          <button class="seatButton" @click="addBot" :disabled="!this.isLobbyOwner">Add Bot</button>
        </div>
        <button class="seatButton" @click="leave">Leave</button>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      playerData: this.players,
      lobbyleader: this.lobbyleader,
      maxSlots: 8,
      seats: this.slots,
      gameModes: this.gameModesProp,
    };
  },
  props: {
    lobbyId: Number,
    lobbyleader: String,
    currentPlayer: Number,
    slots: Array,
    modeProp: Number,
    gameModesProp: Array,
    isLobbyOwner: Boolean
  },
  methods: {
    addBot() {
      this.$emit("update:bot");
    },
    start() {
      this.$emit("open:game");
    },
    selectMode() {
      this.$emit("open:mode");
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
  width: 197px;
  min-height: 61px;
  margin: 15px;
  border-radius: 15px;
  color: white;
  font-size: 20px;
  transition-duration: 0.4s;
  background-image: url("@/assets/elements/button.png");
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

</style>
