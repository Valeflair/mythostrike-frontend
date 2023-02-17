<template>
  <v-app>
    <v-main>
      <router-view />
      <audio
        src="../public/musics/night vigil.mp3"
        loop="true"
        autoplay="autoplay"
        id="MusicPlay"
        hidden
      ></audio>
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