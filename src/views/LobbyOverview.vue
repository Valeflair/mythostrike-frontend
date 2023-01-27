<template>
  <div class="d-flex justify-center">
    <v-col cols="3" id="left-bar" class="text-center">
      <div class="text-h4 pa-4">
        <span id="text">Join lobby</span>
        <v-text-field
          class="text-field pt-5"
          label="LobbyID"
          variant="outlined"
          clearable
        ></v-text-field>
        <v-btn class="lobbyButton">Join</v-btn>
      </div>

      <div class="text-h4 pt-16">
        <span id="text">Create lobby</span>
        <v-text-field
          class="text-field pt-5"
          label="LobbyID"
          variant="outlined"
          clearable
        ></v-text-field>
        <v-btn class="lobbyButton">Create</v-btn>
      </div>
    </v-col>
    <v-col cols="9" id="right-bar"> Test </v-col>
  </div>
</template>

<style scoped>
#left-bar {
  background-color: #9c3b33;
  height: 100vh;
}

#right-bar {
  background-color: #1d1d1f;
  height: 100vh;
}

#text {
  color: white;
  text-decoration-line: underline;
  text-decoration-color: white;
  text-decoration-thickness: 2px;
}

.text-field {
  color: white;
}

.lobbyButton {
  width: 197px;
  min-height: 61px;
  color: white;
  font-size: 20px;
  border-radius:15px;
  background: url("@/assets/elements/start_button.png");
}

</style>
