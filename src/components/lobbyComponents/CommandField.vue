<template>
  <v-container >
    <v-row >
      <v-col cols="3">
        <button :disabled="true">{{ labelLobbyID }}: {{ this.lobbyId }}</button>
        <button :disabled="true">
          {{ labelHost }}: {{ lobbyLeader.name }}
        </button>
        <button :disabled="true">
          {{ labelPlayers }}: {{ playerData.length }}/{{ maxSlots }}
        </button>
      </v-col>
      <v-col cols="3">
        <button class="seatButton" @click="selectMode">{{ labelModes }}</button>
        <button class="seatButton">{{ labelInvite }}</button>
        <button
          :disabled="this.cPlayer !== this.lobbyLeader.id"
          class="seatButton"
          @click="start"
        >
          {{ labelStart }}
        </button>
      </v-col>
      <v-col cols="3">
        <button class="seatButton">{{ labelOptions }}</button>
        <div class="dropdown">
          <button class="seatButton" @click="addBot">{{ labelAddBot }}</button>
          <div class="dropdown-content">
            <a href="#">Link 1</a>
            <a href="#">Link 2</a>
            <a href="#">Link 3</a>
          </div>
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
      cPlayer: this.currentPlayer,
      playerData: this.players,
      lobbyLeader: this.Lobbyleader,
      maxSlots: 8,
      seats: this.slots,
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
  },
  methods: {
    addBot() {
      if (this.currentPlayer !== this.Lobbyleader.id) return;
      if (this.playerData.length < this.maxSlots) {
        this.$emit("update:Bot", this.playerData.length + 1);
      }
    },
    start() {
      console.log("startet");
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


button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 14px 40px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 24px;
  width: 300px;
  border-radius: 12px;
  margin: 5px;
}
.seatButton {
  transition-duration: 0.4s;
}

.seatButton:hover {
  background-color: white;
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
  background-color: #3e8e41;
}
</style>
