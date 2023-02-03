<template>
  <div class="statment">
    <img class="bg-image" src="../assets/backgrounds/modeSelect_background.png" alt="">
    <div id="table">
      <v-table theme="dark" hover="true" tag="wattt">
        <thead>
          <tr id="head">
            <th class="text-left">User</th>
            <th class="text-left">Identity</th>
            <th class="text-left">Drachma</th>
            <th class="text-left">Rank Points</th>
            <th class="text-left">Has Won</th>
          </tr>
        </thead>
        <tbody id="body">
          <tr v-for="item in desserts" :key="item.name">
            <td>{{ item.userName }}</td>
            <td>{{ item.identity }}</td>
            <td>{{ item.drachma }}</td>
            <td>{{ item.rankPoints }}</td>
            <td>{{ item.hasWon }}</td>
            <td></td>
            <td></td>
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

#table {
position: absolute;
width: 68vw;
top: 18%;
}

.quit {
    position:absolute;
  background-image: url(../assets/elements/modeSelection/return.png);
  width: 94px;
  height: 64px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  left: 80%;
  top: 20%;
}

</style>

<script>
export default {
  data() {
    return {
      desserts: [
        {
          userName: "noob chicken",
          identity: "God King",
          drachma: "9999",
          rankPoints: "9999",
          hasWon: "yes",
        },
        {
          userName: "noob king",
          identity: "Rebel",
          drachma: "0",
          rankPoints: "0",
          hasWon: "no",
        },
        {
          userName: "frog of shadow",
          identity: "rebel",
          drachma: "-9999",
          rankPoints: "0",
          hasWon: "no",
        },
        {
          userName: "frog of shadow",
          identity: "rebel",
          drachma: "-9999",
          rankPoints: "0",
          hasWon: "no",
        },
        {
          userName: "frog of shadow",
          identity: "rebel",
          drachma: "-9999",
          rankPoints: "0",
          hasWon: "no",
        },
        {
          userName: "frog of shadow",
          identity: "rebel",
          drachma: "-9999",
          rankPoints: "0",
          hasWon: "no",
        },
        {
          userName: "frog of shadow",
          identity: "rebel",
          drachma: "-9999",
          rankPoints: "0",
          hasWon: "no",
        },
        {
          userName: "frog of shadow",
          identity: "rebel",
          drachma: "-9999",
          rankPoints: "0",
          hasWon: "no",
        },
        {
          userName: "frog of shadow",
          identity: "rebel",
          drachma: "-9999",
          rankPoints: "0",
          hasWon: "no",
        },
        {
          userName: "frog of shadow",
          identity: "rebel",
          drachma: "-9999",
          rankPoints: "0",
          hasWon: "no",
        },

      ],
    };
  },
 
};
</script>