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


  <v-row >
    <v-col  cols="12">
        <div class="field">
      <command-field 
    :lobbyId="this.lobbyID"
    :lobbyleader="this.lobbyLeader"
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
    // slotButton,
    CommandField,
  },
  data() {
    return {
      slots: this.slotsProp,
      lobbyID: this.lobbyId,
      isModeShown: false,
      currentMode: this.currentModeProp,
      gameModes:this.gameModesProp,
      lobbyLeader: this.lobbyLeader
    };
  },
  props: {
    lobbyId: Number,
    currentModeProp: Number,
    lobbyLeader:String,
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
    toggleModeSelection() {
      this.isModeShown = !this.isModeShown;
      this.$emit('update:Mode',this.isModeShown);
    },
    leave(){
        this.$emit('update:leave');
    }
  },
  mounted() {
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
