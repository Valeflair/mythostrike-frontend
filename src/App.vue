<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { useUserStore } from "@/stores/user";
import authService from "@/services/authService";
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
        await authService.auth().then(
          (response) => {
            console.log(response);
            this.userStore.setUser(response.data);
            this.$router.push("/home");
          },
          (error) => {
            console.log(error);
            this.$router.push("/");
          }
        );
      }
    }
    window.addEventListener('beforeunload', function(event) {})
  },
};
</script>
