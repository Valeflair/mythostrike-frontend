<template>
  <h1>Main Page</h1>
  <div style="margin-top:100px margin-bottom:1000px">
    <v-chip class="ma-2" size="x-large" prepend-icon="mdi-circle-multiple">
      Drachma: {{ drachma }}
    </v-chip>

    <v-chip class="ma-2" size="x-large" prepend-icon="mdi-creation">
      Rank Points: {{ rankPoints }}
    </v-chip>
  </div>

  <!-- <div style="margin-top:100px" >
    <v-row
      class="d-flex align-center justify-space-around flex-column flex-sm-row"
    >
      <v-card class="justify-start" max-width="577">
        <v-img height="300" src="../../public/Kratos.png" alt="Champion Profil">
        </v-img>

        <v-card-title>{{ championName }}</v-card-title>

        <v-divider class="mx-4"></v-divider>

        <v-card-title>Win={{ win }} Lose={{ lose }} WR={{ rate }}</v-card-title>

        <v-card-text> </v-card-text>
      </v-card>
      <div>
        <v-btn rounded="pill" color="blue"> Queue </v-btn>

        <v-btn rounded="pill" color="orange"> Lobby </v-btn>
      </div>
    </v-row>
  </div> -->
  <div style="margin-top: 100px">
    <v-container>
      <v-row justify="space-between">
        <v-card class="justify-start" max-width="577">
          <v-img
            height="300"
            src="../../public/Kratos.png"
            alt="Champion Profil"
          >
          </v-img>

          <v-card-title>{{ championName }}</v-card-title>

          <v-divider class="mx-4"></v-divider>

          <v-card-title
            >Win={{ win }} Lose={{ lose }} WR={{ rate }}</v-card-title
          >

          <v-card-text> </v-card-text>
        </v-card>

        <v-btn rounded="pill" color="blue"> Queue </v-btn>

        <v-btn rounded="pill" color="orange" @click="jump"><img src="../../public/giphy.gif" alt="lobby"></v-btn>
      </v-row>
    </v-container>
  </div>

  <div style="margin-top: 100px">
    <v-container>
      <v-row justify="end">
        <div style="margin-right: 100px"><v-btn value="left" rounded="pill" color="blue">Rank List</v-btn></div>

        <div style="margin-right: 100px"><v-btn value="left" rounded="pill" color="blue"> Library </v-btn></div>

        <div><v-btn rounded="pill" color="blue"> Settings </v-btn></div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    drachma: 1500,
    rankPoints: 2450,
    win: 10,
    lose: 5,
    rate: 66 + "%",
    championName: "Kratos",
  }),
  methods: {
    jump(){

    this.$router.push({path: './Lobby'})
    }
  }

};

</script>

<style>
</style>