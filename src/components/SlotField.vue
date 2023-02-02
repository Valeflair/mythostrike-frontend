<script setup>
import CommandField from "@/components/CommandField.vue";
</script>

<template>
 
  
  <v-container class="SeatCommandContainer">
   <v-row class="d-flex justify-center">
    <div  v-for="(slot,i) in slots.filter((slot,i)=>i<slots.length/2)" :key="i">
      <!-- <slot-button :seat="this.slots[slot.id]" :currentplayer="this.currentPlayer" @update:Seat="updateSeats"/> --->
      <v-col col="3">
        <button
          class="seatButton"
        >
          <p>{{ slot.username }}</p>
        </button>
      </v-col>
    </div>
  </v-row>


  <v-row class="ma-8">
    <v-col cols="3"></v-col>
    <v-col cols="2">
      <div class="label">
        <p class="labelText">Lobby ID: {{ this.lobbyId }}</p>
        <p class="labelText">
          Owner: {{ this.lobbyLeader }}
        </p>
        <p class="labelText">
          Mode: {{this.gameModeName}}
        </p></div>
    </v-col>
    <v-col  cols="4">
        <div class="field">
      <command-field 
    :isLobbyOwner="this.isLobbyOwner"
    @open:mode="toggleModeSelection"
    @update:leave="leave"
    @update:bot="addBot"
    @open:game="start"
    />
        </div>
    </v-col>
  </v-row>

  <v-row class="d-flex justify-center">
    <div v-for="(slot,i) in slots.filter((slot,i)=>i>=slots.length/2)" :key="i">
      <v-col col="3">
        <button
          class="seatButton"
        >
          <p>{{ slot.username }}</p>
        </button>
      </v-col>
    </div>
  </v-row>
</v-container>


</template>

<script>
export default {
  components: {
    CommandField,
  },
  data() {
    return {
      slots: this.slotsProp,
      lobbyID: this.lobbyId,
      isModeShown: false
    };
  },
  props: {
    lobbyId: Number,
    lobbyLeader:String,
    slotsProp:Array,
    isLobbyOwner: Boolean,
    gameModeName:String
  },
  methods: {
    addBot() {
      this.$emit("update:bot");
    },
    start(){
      this.$emit("open:game");
    },
    toggleModeSelection() {
      this.isModeShown = !this.isModeShown;
      this.$emit('update:Mode',this.isModeShown);
    },
    leave(){
        this.$emit('update:leave');
    }
  }
};
</script>

<style scoped>

.labelText{
  font-size: 165%;
  color:black;
  margin-top: 4vh;
  margin-bottom: 2vh;
  font-weight: bold;
  margin-left: 1vh;
} 


.label{
  background-color: rgba(255,255,255,0.3);
}

.SeatCommandContainer {
 position: relative;
  top:10vh;
}

.field {
  background-color: rgba(255,255,255,0.2);
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
  color: #181d18;
}

button:hover {
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}
</style>
