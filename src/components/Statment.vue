<script setup>
import users from "../data/users.json";
</script>
<template>
  <div class="statment">
    <img
      class="bg-image"
      src="../assets/backgrounds/modeSelect_background.png"
      alt=""
    />
    <div id="table1">
      <v-table theme="dark" hover="true" tag="wattttt">
        <thead class="bg-blue-lighten-4">
          <tr id="head">
            <th class="text-left text-grey-darken-4">Team</th>
            <th class="text-left text-grey-darken-4">User</th>
            <th class="text-left text-grey-darken-4">User ID</th>
            <th class="text-left text-grey-darken-4">Identity</th>
            <th class="text-left text-grey-darken-4">Drachma</th>
            <th class="text-left text-grey-darken-4">Rank Points</th>
            <th class="text-left text-grey-darken-4">Has Won</th>
          </tr>
        </thead>
        <tbody id="body" v-for="user in users" :key="user.userId">
          <tr v-if="user.hasWon == true">
            <td>{{ user.team }}</td>
            <td>{{ user.userName }}</td>
            <td>{{ user.userId }}</td>
            <td>{{ user.identity }}</td>
            <td>{{ user.drachma }}</td>
            <td>{{ user.rankPoints }}</td>
            <td>YEAHH!</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div id="table2">
      <v-table theme="dark" hover="true" tag="wattttt">
        <thead class="bg-red-lighten-4">
          <tr id="head">
            <th class="text-left text-grey-darken-4">Team</th>
            <th class="text-left text-grey-darken-4">User</th>
            <th class="text-left text-grey-darken-4">User ID</th>
            <th class="text-left text-grey-darken-4">Identity</th>
            <th class="text-left text-grey-darken-4">Drachma</th>
            <th class="text-left text-grey-darken-4">Rank Points</th>
            <th class="text-left text-grey-darken-4">Has Won</th>
          </tr>
        </thead>
        <tbody id="body" v-for="user in users" :key="user.userId">
          <tr v-if="user.hasWon == false">
            <td>{{ user.team }}</td>
            <td>{{ user.userName }}</td>
            <td>{{ user.userId }}</td>
            <td>{{ user.identity }}</td>
            <td>{{ user.drachma }}</td>
            <td>{{ user.rankPoints }}</td>
            <td>NOOOOE!</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <button class="quit" @click="quitGame"></button>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
th {
  font-size: large;
  font-style: italic;
}
.statment {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.77);
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-image {
  position: absolute;
  width: 80vw;
  background-repeat: round;
  opacity: 0.5;
}
#table1 {
  position: absolute;
  width: 68vw;
  top: 18%;
}
#table2 {
  position: absolute;
  width: 68vw;
  top: 50%;
}

.quit {
  position: absolute;
  background-image: url(../assets/elements/modeSelection/return.png);
  width: 94px;
  height: 64px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  left: 83%;
  top: 10%;
}
</style>

<script>
export default {
  data() {},
  methods: {
    quitGame() {
      history.back();
    },
  },
};
</script>