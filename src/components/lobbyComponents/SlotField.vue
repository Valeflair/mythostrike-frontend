<script setup>
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
          <p>Seat: {{ slot.id }}</p> <p> Name: {{ getplayer(slot.playerId).name }}</p><p> Player:
          {{ getplayer(slot.playerId).occupation }}</p>
        </button>
      </v-col>
    </div>
  </v-row>


  <v-row >
    <v-col  cols="12">
        <div class="field">
      <command-field
    :players="this.players"
    :lobbyId="this.loobyID"
    :currentPlayer="this.currentPlayer"
    :Lobbyleader="this.lobbyLeader"
    :slots="this.slots"
    @update:Bot="addBot"
    @open:Mode="toggleModeSelection"
    @update:leave="leave"
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
          <p>Seat: {{ slot.id }}</p> <p> Name: {{ getplayer(slot.playerId).name }}</p><p> Player:
          {{ getplayer(slot.playerId).occupation }}</p>
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
      loobyID: this.lobbyId,
      players: this.playersProp,
      currentPlayer: this.currentPlayerProp,
      isModeShown: false,
      lobbyLeader:this.lobbyLeaderProp,
      currentMode: this.currentModeProp,
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
  },
  methods: {
    confirmMode(newMode) {
      this.currentMode = newMode;
      this.$emit("confirm:Mode", newMode);
    },
    getplayer(playerID) {
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id === playerID) return this.players[i];
      }
      return this.defaultPlayer;
    },
    checkPlayer(playerId) {
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id === playerId) return this.players[i];
      }
      return this.defaultPlayer;
    },
    updateSeats(newSeatId) {
      for (let i = 0; i < this.slots.length; i++) {
        if (this.slots[i].playerId === this.currentPlayer) {
          this.slots[i].playerId = -1;
        }
      }
      this.slots[newSeatId].playerId = this.currentPlayer;
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id === this.currentPlayer) {
          this.players[i].seat = newSeatId;
        }
      }
    },
    changeSeat(seatID) {
      if (this.slots[seatID].playerId === -1) {
        for (let i = 0; i < this.slots.length; i++) {
          if (this.slots[i].playerId === this.currentPlayer)
            this.slots[i].playerId = -1;
        }
        this.slots[seatID].playerId = this.currentPlayer;
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
      this.players.push(bot);
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
    for (let i = 0; i < this.players.length; i++) {
      this.slots[this.players[i].seat].playerId = this.players[i].id;
    }
  },
  computed:{
    players:{
        get(){
            return this.players;
        },
        set(value){
            this.players = value;
            console.log("players changed" );
        }
    },
    lobbyLeader:{
        get(){
            return this.lobbyLeader;
        },
        set(value){
            this.lobbyLeader=value;
        }
        
    }
  }
};
</script>

<style scoped>
.SeatCommandContainer {
 position: relative;

}

.field {
     position: relative;
    left:23%;
    width: 70%;
}

.seatButton {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  margin-left: 15px;
  margin-right: 15px;
  
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
