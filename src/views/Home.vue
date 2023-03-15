<template>
  <div class="bg-image">

    <AvatarSelection
      v-if="isSelectAvatarShown"
      @close:AvatarSelection="closeAvatarSelection"
      @update:Avatar="updateAvatar"
    />
    <div style="margin-top:1000px margin-bottom:1000px">
      <v-chip class="cardColor ma-10" size="x-large" color="white" prepend-icon="mdi-circle-multiple">
        Drachma: {{ userStore.getUser.drachma }}
      </v-chip>

      <v-chip class="cardColor ma-10" size="x-large" color="white" prepend-icon="mdi-creation">
        Rank Points: {{ userStore.getUser.rankPoints }}
      </v-chip>
    </div>

    <div style="margin-top: 100px" >
      <v-container>
        <v-row justify="space-between">
          <div>
          <v-card class="profil text-center">
            <v-card-title class="text-h4">Welcome</v-card-title>
            <v-card-title>{{ this.userStore.getUser.username }}</v-card-title>
            <img
              :src="'/avatars/avatar' + this.userStore.getUser.avatarNumber + '.png'"
              class="image avatarImg"
              title="Avatar"
              @click="openAvatarSelection"
            />
          </v-card>
          </div>
          <div class="buttonFather">
          <img src="/elements/lobby.png" class="image lobbyImg" title="Lobby Overview" @click="toLobbyOverview" />
          <p class="buttonText">Lobby Overview</p>
        </div>
        </v-row>
      </v-container>
    </div>

    <div id="footer">
      <v-container>
        <v-row>
          <div style="margin-right: 2.8vw" class="buttonFather2">
            <p class="buttonText2">Library</p>
            <img src="/elements/button_library.png" class="image libraryImg" title="Library" @click="toLibrary" />
            
          </div>

          <div style="margin-right: 2.8vw" class="buttonFather2">
            <p class="buttonText2">Music</p>
            <img src="/elements/button_setting.png" class="image settingImg" title="Music" @click="music()" />
            
          </div>

          <div style="margin-right: 2.8vw" class="buttonFather2">
            <p class="buttonText2">Logout</p>
            <img src="/elements/return.png" class="image logoutImg" title="Logout" @click="logout" />
            
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
    //Play or close the backgroundmusic
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
@font-face {
  font-family: "Rhianne";
  src: url("/fontStyle/rhianne.ttf");
}
@font-face {
  font-family: "Blackadder";
  src: url("/fontStyle/blackadder.ttf");
}
@keyframes anchor-underline {
  0%, 10% {
    left: 0;
    right: 100%;
  }
  40%, 60% {
    left: 0;
    right: 0;
  }
  90%, 100% {
    left: 100%;
    right: 0;
  }
}
.buttonText {
  font-size: 2.3vh;
  font-family: Rhianne;
  color: aliceblue;
  display: none;
}
.buttonFather:hover .buttonText {
display: block;
}
.buttonText2 {
  width: 7vw;
  font-size: 1.5vh;
  text-align: center;
  font-size: 3vh;
  font-family: Blackadder;
  color: aliceblue;
  display: none;
}
.buttonFather2:hover .buttonText2 {
display: block;
}
.middle {
  background: url("/backgrounds/goldenframe.png");
  background-position: center;
  background-repeat: no-repeat;
  z-index: 10;
}

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
  width: 13vw;
  height: 20vw;
  right: 20vw;
  
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
  z-index: 0;
}

#footer {
  position: fixed;
  bottom: 0.5vh;
  right: 4vw;
}
</style>
