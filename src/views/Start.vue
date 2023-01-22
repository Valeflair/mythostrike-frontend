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
        <div class="text-h2 pt-8">
          <span id="text">Μ ψ τ η ο σ τ ρ ι κ ε</span>
        </div>
        <div class="text-h1 font-weight-regular" id="title">
          <span id="text">ΜYTHOSTRIKE</span>
        </div>
        <div class="text-h4 pa-3">
          <span id="text">-online-</span>
        </div>
      </v-col>
    </div>
    
      
    <v-responsive class="mx-auto pt-5" max-width="450">
      <v-text-field
        class="text-field"
        label="username"
        variant="outlined"
        clearable
      ></v-text-field>
      <v-text-field
        class="text-field"
        label="password"
        variant="outlined"
        type="password"
        clearable
      ></v-text-field>
    </v-responsive>
  </div>
</template>
<style scoped>
.bg-image {
  background: url("@/assets/backgrounds/lobby_background.png");
  height: 100vh;
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
  text-underline-offset: 10px;
}

.text-field{
  color: white;
}
</style>

<script>
export default {
  name: "Start",
  data: () => ({
    username: "",
    password: "",
  }),
};
</script>
