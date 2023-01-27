<template>
  <div class="bg-image">
    <div><h1>Home Page</h1></div>

    <div style="margin-top:1000px margin-bottom:1000px">
      <v-chip
        class="ma-2"
        size="x-large"
        color="white"
        prepend-icon="mdi-circle-multiple"
      >
        Drachma: {{ drachma }}
      </v-chip>

      <v-chip
        class="ma-2"
        size="x-large"
        color="white"
        prepend-icon="mdi-creation"
      >
        Rank Points: {{ rankPoints }}
      </v-chip>
    </div>

    <div style="margin-top: 100px">
      <v-container>
        <v-row justify="space-between">
          <v-card class=" CardColor justify-start"  >
            <v-img
              src="../../public/Kratos.png"
              alt="Champion Profil"
              cover
            >
            </v-img>

            <v-card-title>{{ championName }}</v-card-title>

            <v-divider class="mx-4"></v-divider>

            <v-card-title
              >Win={{ win }} Lose={{ lose }} WR={{ rate }}</v-card-title
            >  
          </v-card>

          <v-btn rounded="lg" class=" Button Queue" @click="toQueue">
            Queue
          </v-btn>

          <v-btn
            rounded="lg"
            
            class=" Button Lobby"
            @click="toLobbyOverview"
          >
            LobbyOverView
          </v-btn>
        </v-row>
      </v-container>
    </div>

    <div style="margin-top: 100px">
      <v-container>
        <v-row justify="end">
          <div style="margin-right: 100px">
            <v-btn
              value="left"
              
              class="Button RankList"
              @click="toRankList"
              >Rank List</v-btn
            >
          </div>

          <div style="margin-right: 100px">
            <v-btn
              value="left"
              
              class=" Button Library"
              @click="toLibrary"
            >
              Library
            </v-btn>
          </div>

          <div>
            <v-btn  class=" Button Settings" @click="toSettings">
              Settings
            </v-btn>
          </div>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    drachma: 1500,
    rankPoints: 2450,
    win: 10,
    lose: 5,
    rate: 66 + "%",
    championName: "Kratos",
  }),
  methods: {
    toLobbyOverview() {
      this.$router.push({ path: "./LobbyOverview" });
    },

    toQueue() {
      this.$router.push({ path: "./Queue" });
    },

    toRankList() {
      this.$router.push({ path: "./RankList" });
    },

    toLibrary() {
      this.$router.push({ path: "./Library" });
    }
  },
};
</script>

<style scoped>

.CardColor {
   background-color: rgba(255, 255, 255, 0.1) !important;
   border-color: white !important;
}
.bg-image {
  background: url("@/assets/backgrounds/home_background.png");
  height: 100vh;
}
.Profil {
  background: url("@/assets/backgrounds/home_background.png");
}

.Queue {
  width: 227px;
  min-height: 61px;
  margin: 15px;
  color: white;
  font-size: 20px;
  background: url("../assets/elements/start_button.png");
}

.Lobby {
  width: 227px;
  min-height: 61px;
  margin: 15px;
  color: white;
  font-size: 20px;
  background: url("../assets/elements/start_button.png");
}

.RankList {
  width: 227px;
  min-height: 61px;
  margin: 15px;
  color: white;
  font-size: 20px;
  background: url("../assets/elements/start_button.png");
}

.Library {
  width: 227px;
  min-height: 61px;
  margin: 15px;
  color: white;
  font-size: 20px;
  background: url("../assets/elements/start_button.png");
}

.Settings {
  width: 227px;
  min-height: 61px;
  margin: 15px;
  color: white;
  font-size: 20px;
  background: url("../assets/elements/start_button.png");
}

.Button {
  background-size: cover;
}
</style>