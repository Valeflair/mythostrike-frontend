<script setup></script>

<template>
  <v-row>
    <v-col cols="2" class="buttonMove">
      <button class="commandButton" @click="selectMode">Select Mode</button>
      <button class="commandButton">Invite</button>
      <button class="commandButton" @click="start" :disabled="!this.isLobbyOwner">
        Start Game
      </button>
    </v-col>
    <v-col cols="2" class="buttonMove">
      <button class="commandButton">Options</button>
      <div class="dropdown">
        <button
          class="commandButton"
          @click="addBot"
          :disabled="!this.isLobbyOwner"
        >
          Add Bot
        </button>
      </div>
      <button class="commandButton" @click="leave">Leave</button>
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

.commandButton {
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

.commandButton:hover {
  color: white;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
  font-weight: bold;
  font-size:20px;
}

.commandButton:disabled{
  opacity: 0.4;
}

.commandButton:disabled:hover{
  font-weight: normal;
  font-size: 17px;
}
</style>
