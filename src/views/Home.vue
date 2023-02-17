<template>
  <div class="bg-image">
    <AvatarSelection
      v-if="isSelectAvatarShown"
      @close:AvatarSelection="closeAvatarSelection"
      @update:Avatar="updateAvatar"
    />
    <div style="margin-top:1000px margin-bottom:1000px">
      <v-chip
        class="cardColor ma-10"
        size="x-large"
        color="white"
        prepend-icon="mdi-circle-multiple"
      >
        Drachma: {{ userStore.getUser.drachma }}
      </v-chip>

      <v-chip
        class="cardColor ma-10"
        size="x-large"
        color="white"
        prepend-icon="mdi-creation"
      >
        Rank Points: {{ userStore.getUser.rankPoints }}
      </v-chip>
    </div>

    <div style="margin-top: 100px">
      <v-container>
        <v-row justify="space-between">
          <v-card class="profil text-center">
            <v-card-title class="text-h4">Welcome</v-card-title>
            <v-card-title>{{ this.userStore.getUser.username }}</v-card-title>
            <img
              :src="
                '/avatars/avatar' +
                this.userStore.getUser.avatarNumber +
                '.png'
              "
              class="image avatarImg"
              @click="openAvatarSelection"
            />
          </v-card>
          <img
            src="/elements/lobby.png"
            class="image lobbyImg mr-10"
            @click="toLobbyOverview"
          />
        </v-row>
      </v-container>
    </div>

    <div id="footer">
      <v-container>
        <v-row>
          <div style="margin-right: 2.4vw">
            <img
              src="/elements/button_library.png"
              class="image libraryImg"
              @click="toLibrary"
            />
          </div>

          <div style="margin-right: 2vw">
            <img
              src="/elements/button_setting.png"
              class="image settingImg"
              @click="music()"
            />
          </div>

          <div>
            <img
              src="/elements/return.png"
              class="image logoutImg"
              @click="logout"
            />
          </div>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
import AvatarSelection from "../components/AvatarSelection.vue";
import authService from "@/services/authService";
export default {
  data: () => ({
    isSelectAvatarShown: false,
    avatarNumber: null,
    isPlaying: false,
  }),
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  components: {
    AvatarSelection,
  },
  methods: {
    openAvatarSelection() {
      this.isSelectAvatarShown = true;
    },
    closeAvatarSelection() {
      this.isSelectAvatarShown = false;
    },
    async updateAvatar(newAvatarId) {
      await authService.changeAvatar(newAvatarId).then(
        (response) => {
          this.userStore.changeAvatar(newAvatarId);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    toLobbyOverview() {
      this.$router.push({ path: "./lobbyOverview" });
    },
    toLibrary() {
      this.$router.push({ path: "./library" });
    },
    logout() {
      localStorage.removeItem("token");
      this.userStore.reset();
      this.$router.push({ path: "./" });
    },
    music() {
      var audio = document.getElementById("MusicPlay");
      this.isplaying = !this.isplaying;
      if (this.isplaying === true) {
        audio.play();
      } else {
        audio.pause();
      }
    },
    async auth() {
      await authService.auth().then(
        (response) => {
          console.log(response);
          this.userStore.setUser(response.data);
          this.$router.push("/home");
        },
        (error) => {
          console.log(error);
          this.$router.push("/");
          localStorage.removeItem("token");
        }
      );
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
  async created() {
    this.auth();
  },
  components: { AvatarSelection },
};
</script>

<style scoped>
.profil {
  background-color: #2e2824 !important;
  color: white;
  width: 15vw;
}

.image {
  cursor: pointer;
}

.image:active {
  box-shadow: 0 3px rgba(0, 0, 0, 0.05);
  transform: translateY(3px);
}

.avatarImg {
  width: 15vw;
  height: 15vw;
}

.lobbyImg {
  width: 18vw;
  height: 20vw;
}

.libraryImg {
  width: 7vw;
  height: 13vh;
}

.settingImg {
  width: 8vw;
  height: 14vh;
}

.logoutImg {
  width: 8vw;
  height: 14vh;
}

.bg-image {
  background: url("/backgrounds/home_background.png");
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}

#footer {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
