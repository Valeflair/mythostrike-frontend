<script setup></script>

<template>
  <v-row>
    <v-col cols="2" class="buttonMove">
      <button class="seatButton" @click="selectMode">Select Mode</button>
      <button class="seatButton">Invite</button>
      <button class="seatButton" @click="start" :disabled="!this.isLobbyOwner">
        Start Game
      </button>
    </v-col>
    <v-col cols="2" class="buttonMove">
      <button class="seatButton">Options</button>
      <div class="dropdown">
        <button
          class="seatButton"
          @click="addBot"
          :disabled="!this.isLobbyOwner"
        >
          Add Bot
        </button>
      </div>
      <button class="seatButton" @click="leave">Leave</button>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    isLobbyOwner: Boolean,
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
    leave() {
      this.$emit("update:leave");
    },
  },
};
</script>

<style scoped>
.labelclass {
  text-align: center;
  font-size: 150%;
  color: yellow;
  margin-top: 2vh;
  margin-bottom: 2vh;
}

.buttonMove {
  margin-left: 3vh;
  margin-right: 13vh;
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
  font-size: 17px;
  transition-duration: 0.4s;
  background-image: url("@/assets/elements/button.png");
}

.seatButton:hover {
  color: #f9fd06;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
  font-size: 18px;
  font-weight: bold;
}
</style>
