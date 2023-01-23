<template>
  <div class="bg-image">
    <div class="d-flex justify-center">
      <v-col cols="2" class="text-right">
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
          <span id="text">Μ ψ τ η ο σ τ ρ ι κ ε</span>
        </div>
        <div class="text-h1 font-weight-regular" id="title">
          <span id="text">ΜYTHOSTRIKE</span>
        </div>
        <div class="text-h4 pa-4">
          <span id="text">-online-</span>
        </div>
      </v-col>
    </div>
    <v-responsive class="mx-auto pt-5" max-width="450">
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
      <v-btn class="startButton">Register</v-btn>
      <v-btn class="startButton">Login</v-btn>
    </div>
  </div>
</template>
<style scoped>
.bg-image {
  background: url("@/assets/backgrounds/start_background.png");
  height: 100vh;
}

.startButton {
  width: 227px;
  min-height: 61px;
  margin: 15px;
  color: white;
  font-size: 20px;
  background: url("@/assets/elements/start_button.png");
}

#text {
  color: white;
}

#title {
  text-decoration-line: underline;
  text-decoration-color: white;
  text-decoration-thickness: 5px;
}

.text-h1 {
  text-underline-offset: 15px;
}

.text-field {
  color: white;
}

.startButton {
  margin: 15px;
}
</style>

<script>
import axios from "axios";
export default {
  name: "Start",
  data: () => ({
    username: "",
    password: "",
  }),
  methods: {
    async login() {
      await axios
        .post("http://localhost:8080/users/login", {
          username: this.username,
          password: this.password,
        })
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
    },
    async register() {
      let response = await axios
        .post("http://localhost:8080/users/register", {
          username: this.username,
          password: this.password,
        })
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
    },
  },
};
</script>
