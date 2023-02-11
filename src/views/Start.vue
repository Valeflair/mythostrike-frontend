<template>
  <div class="bg-image">
    <div class="d-flex justify-center">
      <v-col cols="2">
        <img
          alt="Vue logo"
          class="logo"
          src="@/assets/logo.png"
          width="300"
          height="300"
        />
      </v-col>
      <v-col cols="4" class="text-center">
        <div class="text-h2 pt-10">
          <p class="text" id="title-greek">Μ ψ τ η ο σ τ ρ ι κ ε</p>
        </div>
        <div class="text-h1 font-weight-regular pt-1">
          <span class="text" id="title">ΜYTHOSTRIKE</span>
        </div>
        <div class="text-h4 pa-4">
          <span class="text" id="title-small">-online-</span>
        </div>
      </v-col>
    </div>
    <v-responsive class="mx-auto pt-5 inputBox" max-width="450">
      <v-text-field
        class="text-field"
        label="username"
        variant="outlined"
        v-model="username"
        clearable
      ></v-text-field>
      <v-text-field
        class="text-field"
        label="password"
        variant="outlined"
        type="password"
        v-model="password"
        clearable
      ></v-text-field>
    </v-responsive>
    <div class="text-center">
      <v-btn class="startButton" @click="register">Register</v-btn>
      <v-btn class="startButton" @click="login">Login</v-btn>
    </div>
    <v-responsive class="mx-auto ma-3" max-width="450">
      <v-alert v-show="alertStatus" type="error">
        {{ this.alertMessage }}
      </v-alert>
    </v-responsive>
  </div>
</template>
<style scoped>
.logo {
  width: 16vw;
  height: 16vw;
}
.bg-image {
  background: url("@/assets/backgrounds/start_background.png");
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}

.startButton {
  width: 10.25vw;
  min-height: 6vh;
  margin: 15px;
  color: white;
  font-size: 1vw;
  border-radius: 15px;
  background: url("@/assets/elements/button.png");
}

.text {
  color: white;
}

#title {
  font-size: 5vw;
}

.text-h1 {
  text-underline-offset: 15px;
  text-decoration-line: underline;
  text-decoration-color: white;
  text-decoration-thickness: 5px;
}

.text-field {
  color: white;
}

.inputBox {
  height: 18vh;
  width: 75vw;
}

#title-greek {
  font-size: 3.5vw;
}

#title-small {
  font-size: 2vw;
}
</style>

<script>
import authService from "@/services/authService";
export default {
  name: "Start",
  data: () => ({
    username: "",
    password: "",
    alertStatus: false,
    alertMessage: "",
  }),
  methods: {
    async login() {
      if (this.checkInput()) {
        await authService
          .login({
            username: this.username,
            password: this.password,
          })
          .then(
            (response) => {
              console.log(response);
              let token = response.data.jwtToken;
              localStorage.setItem("token", token);
              this.$router.push("/home");
            },
            (error) => {
              console.log(error);
              this.showAlert(error.response.data.message);
            }
          );
      }
    },
    async register() {
      if (this.checkInput()) {
        await authService
          .register({
            username: this.username,
            password: this.password,
          })
          .then(
            (response) => {
              console.log(response);
              let token = response.data.jwtToken;
              localStorage.setItem("token", token);
              this.$router.push("/home");
            },
            (error) => {
              console.log(error);
              this.showAlert(error.response.data.message);
            }
          );
      }
    },
    checkInput() {
      if (this.username != "" && this.password != "") {
        return true;
      }
      this.showAlert("Username or password is empty");
      return false;
    },
    showAlert(message) {
      this.alertMessage = message;
      this.alertStatus = true;
      setTimeout(() => {
        this.alertStatus = false;
      }, 7000);
    },
  },
};
</script>
