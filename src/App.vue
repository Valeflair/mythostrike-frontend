<template>
  <v-app>
    <v-main>
      <router-view />
      <audio
        src="/musics/night vigil.mp3"
        loop="true"
        id="MusicPlay"
        hidden
      ></audio>
    </v-main>
  </v-app>
</template>

<script>
import { useUserStore } from "@/stores/user";
import authService from "@/services/authService";
import lobbyService from "@/services/lobbyService";
export default {
  name: "App",

  data: () => ({
    //
  }),
  setup() {
    const userStore = useUserStore();

    return { userStore };
  },
  //Überprüfen ob der User schon angemeldet ist oder nicht
  async beforeCreate() {
    if (localStorage.getItem("token") == null) {
        this.$router.push("/");
    } else {
      await authService.auth().then(
        (response) => {
          console.log(response);
          this.userStore.setUser(response.data);
        },
        (error) => {
          console.log(error);
          this.$router.push("/");
          localStorage.removeItem("token");
        }
      )
      let lobbyId = localStorage.getItem("lobbyId");
      console.log(lobbyId);
      if(lobbyId != null){
      await lobbyService.leave(lobbyId).then(
        (response) => {
          this.$router.push({ path: "./lobbyoverview" });
          localStorage.removeItem("lobbyId");
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      )
      }
    }
  }
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

* {
  scrollbar-width: none;
  -ms-overflow-style: none;

}
</style>