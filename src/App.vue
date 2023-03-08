<template>
  <v-app>
    <v-main>
      <router-view />
      <audio src="/musics/night vigil.mp3" loop="true" id="MusicPlay" hidden></audio>
    </v-main>
  </v-app>
</template>

<script>
import { useUserStore } from "@/stores/user";

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
    if (this.userStore.getStatus() == false) {
      if (localStorage.getItem("token") == null) {
        this.$router.push("/");
      } else {
        this.$router.push("/home");
      }
    }
  },
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
