<template>
  <div class="bg-image">
    <div style="margin-top:1000px margin-bottom:1000px">
      <v-chip
        class="cardColor ma-10"
        size="x-large"
        color="white"
        prepend-icon="mdi-circle-multiple"
      >
        Drachma: {{ userStore.getUserData.drachma }}
      </v-chip>

      <v-chip
        class="cardColor ma-10"
        size="x-large"
        color="white"
        prepend-icon="mdi-creation"
      >
        Rank Points: {{ userStore.getUserData.rankPoints }}
      </v-chip>
    </div>

    <div style="margin-top: 100px">
      <v-container>
        <v-row justify="space-between">
          <v-card class="cardColor text-center">
            <v-card-title class="text-h4">Welcome</v-card-title>
            <v-card-title>{{ userStore.getUserData.username }}</v-card-title>
            <img
              :src="
                '../src/assets/avatars/avatar' +
                userStore.getUserData.avatarNumber +
                '.png'
              "
            />
          </v-card>

          <v-btn class="button"> Queue </v-btn>

          <v-btn class="button" @click="toLobbyOverview"> LobbyOverView </v-btn>
        </v-row>
      </v-container>
    </div>

    <div id="footer">
      <v-container>
        <v-row>
          <div style="margin-right: 100px">
            <v-btn class="button">Rank List</v-btn>
          </div>

          <div style="margin-right: 100px">
            <v-btn class="button"> Library </v-btn>
          </div>

          <div>
            <v-btn class="button"> Settings </v-btn>
          </div>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
export default {
  data: () => ({}),
  setup() {
    const userStore = useUserStore();

    return { userStore };
  },
  methods: {
    toLobbyOverview() {
      this.$router.push({ path: "./lobbyOverview" });
    },
    /*
        toQueue() {
          this.$router.push({ path: "./Queue" });
        },
        toRankList() {
          this.$router.push({ path: "./RankList" });
        },
    
        toLibrary() {
          this.$router.push({ path: "./Library" });
        },*/
  },
};
</script>

<style scoped>
.cardColor {
  background-color: #2e2824 !important;
  color: white;
}

.bg-image {
  background: url("@/assets/backgrounds/home_background.png");
  height: 100vh;
  background-size:cover;
  background-repeat: no-repeat;
}
.button {
  width: 197px;
  min-height: 61px;
  margin: 15px;
  border-radius: 15px;
  color: white;
  font-size: 20px;
  background: url("@/assets/elements/button.png");
}

#footer {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
