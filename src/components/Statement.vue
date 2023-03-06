<script setup></script>
<template>
  <div class="statement">
    <img class="bg-image" :src="'/backgrounds/modeselect_background.png'" alt="" />
    <div class="table">
      <v-table theme="dark" hover="true" tag="wattttt">
        <thead class="head1">
          <tr>
            <th class="text-left text-grey-darken-4">User</th>
            <th class="text-left text-grey-darken-4">Identity</th>
            <th class="text-left text-grey-darken-4">Drachma</th>
            <th class="text-left text-grey-darken-4">Rank Points</th>
            <th class="text-left text-grey-darken-4">Status</th>
          </tr>
        </thead>
        <tbody id="body" v-for="user in users" :key="user.userId">
          <tr v-if="user.hasWon === true">
            <td>{{ user.username }}</td>
            <td>{{ user.identity }}</td>
            <td>{{ user.drachma }}</td>
            <td>{{ user.rankPoints }}</td>
            <td>Win</td>
          </tr>
        </tbody>
      </v-table>
      <v-table theme="dark" hover="true" tag="wattttt">
        <thead class="head2">
          <tr>
            <th class="text-left text-grey-darken-4">User</th>
            <th class="text-left text-grey-darken-4">Identity</th>
            <th class="text-left text-grey-darken-4">Drachma</th>
            <th class="text-left text-grey-darken-4">Rank Points</th>
            <th class="text-left text-grey-darken-4">Status</th>
          </tr>
        </thead>
        <tbody id="body" v-for="user in users" :key="user.userId">
          <tr v-if="user.hasWon == false">
            <td>{{ user.username }}</td>
            <td>{{ user.identity }}</td>
            <td>{{ user.drachma }}</td>
            <td>{{ user.rankPoints }}</td>
            <td>Lost</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <button class="quit" @click="quitGame"></button>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

th {
  font-size: large;
  font-style: italic;
}

.statement {
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
  opacity: 0.9;
}

.head1 {
  background-color: rgba(26, 98, 207, 0.699);
}

.head2 {
  background-color: rgba(104, 21, 21, 0.801);
}

.table {
  position: absolute;
  width: 68vw;
  top: 18%;
}

.quit {
  position: absolute;
  background-image: url(/elements/modeSelection/return.png);
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
      this.$router.push({ path: "./home" });
    },
  },
  props: {
    users: Array,
  },
};
</script>
