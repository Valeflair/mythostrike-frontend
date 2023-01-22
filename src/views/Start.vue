<template>
    <div class="bg-image">
    <v-row class="pt-16 text-center">
      <v-col cols="1"></v-col>
      <v-col cols="4" class="text-right">
        <img
        alt="Vue logo"
        class="logo"
        src="@/assets/logo.png"
        width="300"
        height="300"
      />
      </v-col>
      <v-col cols="4" class="text-left">
        <div class="text-h2 text-center pt-8">
          <span id="text">Μ ψ τ η ο σ τ ρ ι κ ε</span>
        </div>
        <div class="text-h1 font-weight-regular" id="title">
          <span id="text">ΜYTHOSTRIKE</span>
        </div>
        <div class="text-h4 text-center pa-2">
          <span id="text">-online-</span>
        </div>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
</div>
</template>
<style scoped>
.bg-image {
  background: url('@/assets/backgrounds/start_background.png');
  height: 100vh;
}

#text {
  color:white;
}

#title{
  text-decoration-line: underline;
  text-decoration-color: white;
  text-decoration-thickness: 5px;
}

.text-h1{
  text-underline-offset: 10px;
}
</style>