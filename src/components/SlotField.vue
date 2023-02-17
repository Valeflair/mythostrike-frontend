<script setup>
import CommandField from "@/components/CommandField.vue";
</script>

<template>
  <v-container class="SeatCommandContainer">
    <v-row class="d-flex justify-center">
      <div
        v-for="(slot, id) in slots.filter((slot, id) => id < slots.length / 2)"
        :key="id"
      >
        <v-col col="3">
          <div v-if="slot.identity != 'None' && slot.username != null">
            <button
              class="seatButton"
              id="teamRed"
              v-bind:style="{
                backgroundImage:
                  'url(' +
                  '../src/assets/avatars/avatar' +
                  slot.avatarNumber +
                  '.png' +
                  ')',
              }"
            >
              <p>{{ slot.username }}</p>
            </button>
          </div>
          <div v-else-if="slot.username == null">
            <button
              class="emptySeat"
              v-bind:style="{
                backgroundImage:
                  'url(' + '../src/assets/avatars/changeseat.png' + ')',
              }"
              @click="changeSeat(id)"
            ></button>
          </div>
          <div v-else-if="slot.username != null">
            <button
              class="seatButton"
              v-bind:style="{
                backgroundImage:
                  'url(' +
                  '../src/assets/avatars/avatar' +
                  slot.avatarNumber +
                  '.png' +
                  ')',
              }"
            >
              <p>{{ slot.username }}</p>
            </button>
          </div>
        </v-col>
      </div>
    </v-row>

    <v-row class="ma-8">
      <v-col cols="3"></v-col>
      <v-col cols="3">
        <div class="label">
          <p class="labelText">Lobby ID: {{ this.lobbyId }}</p>
          <p class="labelText">Owner: {{ this.lobbyOwner }}</p>
          <p class="labelText">Mode: {{ this.gameModeName }}</p>
        </div>
      </v-col>
      <v-col cols="4">
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
      <div
        v-for="(slot, id) in slots.filter((slot, id) => id >= slots.length / 2)"
        :key="id"
      >
        <v-col col="3">
          <div v-if="slot.identity != 'None' && slot.username != null">
            <button
              class="seatButton"
              id="teamBlue"
              v-bind:style="{
                backgroundImage:
                  'url(' +
                  '../src/assets/avatars/avatar' +
                  slot.avatarNumber +
                  '.png' +
                  ')',
              }"
            >
              <p>{{ slot.username }}</p>
            </button>
          </div>
          <div v-else-if="slot.username == null">
            <button
              class="emptySeat"
              v-bind:style="{
                backgroundImage:
                  'url(' + '../src/assets/avatars/changeseat.png' + ')',
              }"
              @click="changeSeat(id + slots.length / 2)"
            ></button>
          </div>
          <div v-else-if="slot.username != null">
            <button
              class="seatButton"
              v-bind:style="{
                backgroundImage:
                  'url(' +
                  '../src/assets/avatars/avatar' +
                  slot.avatarNumber +
                  '.png' +
                  ')',
              }"
            >
              <p>{{ slot.username }}</p>
            </button>
          </div>
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
      isModeShown: false,
    };
  },
  props: {
    lobbyId: Number,
    lobbyOwner: String,
    slotsProp: Array,
    isLobbyOwner: Boolean,
    gameModeName: String,
  },
  methods: {
    addBot() {
      this.$emit("update:bot");
    },
    start() {
      this.$emit("open:game");
    },
    toggleModeSelection() {
      this.isModeShown = !this.isModeShown;
      this.$emit("update:Mode", this.isModeShown);
    },
    leave() {
      this.$emit("update:leave");
    },
    changeSeat(newSeatId) {
      console.log(newSeatId);
      this.$emit("update:seat", newSeatId);
    },
  },
  watch: {
    slotsProp() {
      this.slots = this.slotsProp;
    },
  },
};
</script>

<style scoped>
.labelText {
  font-size: 165%;
  color: black;
  margin-top: 4vh;
  margin-bottom: 2vh;
  font-weight: bold;
  margin-left: 1vh;
}

.label {
  background-color: rgba(255, 255, 255, 0.3);
}

.SeatCommandContainer {
  position: relative;
  top: 10vh;
}

.field {
  background-color: rgba(255, 255, 255, 0.2);
}

.seatButton {
  border: 4px solid black;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 2.5vh;
  font-size: 1.5vw;
  text-shadow: #fc0 1px 0 10px;
  font-weight: bold;
  border-radius: 12px;
  margin-left: 1vh;
  margin-right: 1vh;
  transition-duration: 0.4s;
  width: 11vw;
  height: 11vw;
  background-size: cover;
}

.seatButton:hover {
  color: black;
  cursor: default;
}

.emptySeat {
  border: 4px solid black;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: 11vw;
  height: 11vw;
  border-radius: 12px;
  margin-left: 1vh;
  margin-right: 1vh;
  transition-duration: 0.4s;
  background-size: cover;
  opacity: 0.4;
}

.emptySeat:hover {
  opacity: 1;
}

button:hover {
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

#teamRed {
  border: 3px solid red;
}

#teamBlue {
  border: 3px solid blue;
}
</style>
