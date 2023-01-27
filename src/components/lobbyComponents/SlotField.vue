<script setup>
import axios from 'axios';
//import slotButton from './SlotButton.vue'
import CommandField from "./CommandField.vue";
</script>

<template>
 
  
  <v-container class="SeatCommandContainer">
   <v-row class="d-flex justify-center">
    <div  v-for="(slot,i) in slots.filter((slot,i)=>i<slots.length/2)" :key="i">
      <!-- <slot-button :seat="this.slots[slot.id]" :currentplayer="this.currentPlayer" @update:Seat="updateSeats"/> --->
      <v-col col="3">
        <button
          class="seatButton"
          @click="changeSeat(slot.id)"
        >
          <p>Name: {{ searchPlayer(slot.playerId).name }}</p> 
          <p> Player: {{ searchPlayer(slot.playerId).occupation }} </p>
        </button>
      </v-col>
    </div>
  </v-row>


  <v-row >
    <v-col  cols="12">
        <div class="field">
      <command-field 
    :players="getPlayers"
    :lobbyId="this.lobbyID"
    :currentPlayer="getCurrentPlayer"
    :Lobbyleader="getLobbyLeader"
    :slots="this.slots"
    :modeProp="getCurrentMode"
    :gameModesProp="this.gameModes"
    @update:Bot="addBot"
    @open:Mode="toggleModeSelection"
    @update:leave="leave"
    @open:game="start"
    />
        </div>
    </v-col>
  </v-row>

  <v-row class="d-flex justify-center">
    <div v-for="(slot,i) in slots.filter((slot,i)=>i>=slots.length/2)" :key="i">
      <!-- <slot-button :seat="this.slots[slot.id]" :currentplayer="this.currentPlayer" @update:Seat="updateSeats"/> --->
      <v-col col="3">
        <button
          class="seatButton"
          @click="changeSeat(slot.id)"
        >
          <p>Name: {{ searchPlayer(slot.playerId).name }}</p> 
          <p> Player: {{ searchPlayer(slot.playerId).occupation }} </p>
        </button>
      </v-col>
    </div>
  </v-row>
</v-container>


</template>

<script>
export default {
  components: {
    // slotButton,
    CommandField,
  },
  data() {
    return {
      slots: this.slotsProp,
      lobbyID: this.lobbyId,
      //players: this.playersProp,
      //currentPlayer: this.currentPlayerProp,
      isModeShown: false,
      //lobbyLeader:this.lobbyLeaderProp,
      currentMode: this.currentModeProp,
      gameModes:this.gameModesProp,
      defaultPlayer: {
        id: -1,
        name: "Empty",
        occupation: "Bot",
        seat: -1,
      },
    };
  },
  props: {
    currentPlayerProp:Number,
    lobbyId: Number,
    currentModeProp: Number,
    playersProp:Array,
    lobbyLeaderProp:Object,
    slotsProp:Array,
    gameModesProp:Array,
  },
  methods: {
    start(){
      this.$emit("open:game");
    },
    confirmMode(newMode) {
      this.currentMode = newMode;
      this.$emit("confirm:Mode", newMode);
    },
    searchPlayer(playerID) {
      const players = this.getPlayers;
      for (let i = 0; i < players.length; i++) {
        if (players[i].id === playerID) return players[i];
      }
      return this.defaultPlayer;
    },
    checkPlayer(playerId) {
      const players = this.getPlayers;
      for (let i = 0; i < players.length; i++) {
        if (players[i].id === playerId) return players[i];
      }
      return this.defaultPlayer;
    },
    updateSeats(newSeatId) {
      for (let i = 0; i < this.slots.length; i++) {
        if (this.slots[i].playerId === this.getCurrentPlayer) {
          this.slots[i].playerId = -1;
        }
      }
      this.slots[newSeatId].playerId = this.getCurrentPlayer;
      const players = this.getPlayers;
      for (let i = 0; i < players.length; i++) {
        if (players[i].id === this.getCurrentPlayer) {
          players[i].seat = newSeatId;
        }
      }      
      this.$emit('update:players',players);

      
    },
    async changeSeat(seatID) {
      
      
      if (this.slots[seatID].playerId === -1) {
        for (let i = 0; i < this.slots.length; i++) {
          if (this.slots[i].playerId === this.getCurrentPlayer)
            this.slots[i].playerId = -1;
        }
        this.slots[seatID].playerId = this.getCurrentPlayer;
        this.$emit('update:slots');
      }
    },
    addBot(botId) {
      const bot = {
        id: botId,
        name: "Bot" + botId,
        seat: -1,
        occupation: "Bot",
      };

      console.log(bot.seat);
      let i = 0;
      while (i < this.slots.length && bot.seat === -1) {
        if (this.slots[i].playerId === -1) {
          this.slots[i].playerId = bot.id;
          bot.seat = this.slots[i].id;
        }
        i++;
      }
      const players = this.getPlayers;
      players.push(bot);
      this.$emit('update:players',players);
      this.$emit('update:bot');

    },
    toggleModeSelection() {
      this.isModeShown = !this.isModeShown;
      this.$emit('update:Mode',this.isModeShown);
    },
    leave(){
        this.$emit('update:leave');
    }
  },
  mounted() {
    const players = this.getPlayers;
    for (let i = 0; i < players.length; i++) {
      this.slots[players[i].seat].playerId = players[i].id;
    }
  },
  computed:{
    getPlayers(){
      return this.playersProp;
    },
    getCurrentPlayer(){
        return this.currentPlayerProp;
    },
    getLobbyLeader(){
      return this.lobbyLeaderProp;
    },
    getCurrentMode(){
      return this.currentModeProp;
    }
  }
};
</script>

<style scoped>
.SeatCommandContainer {
 position: relative;
  top:10vh;
}

.field {
    background-color: darkblue;
    position: relative;
    left:20vw;
    width: 50vw;
}

.seatButton {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 150%;
  width: 15vw;
  height: 19vh;
  border-radius: 12px;
  margin-left: 1vh;
  margin-right: 1vh;
  
  transition-duration: 0.4s;
}


.seatButton:hover {
  background-color: white;
  color: #4caf50;
}

button:hover {
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}
</style>
