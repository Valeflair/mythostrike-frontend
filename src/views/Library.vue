<script setup>
import cards from "../data/cards.json";
</script>
<template>
  <div class="library">
    <h1>Library</h1>
    <button class="back" @click="back"></button>
    <div class="cardContainer">
      <v-row class="d-flex justify-left">
        <div v-for="card in cards" :key="card.id">
          <v-col :key="card.id">
            <button v-bind:style="{backgroundImage:'url('+'../src/assets/cards/pictures/'+card.name+'.png'+')', backgroundSize:'100% 100%', backgroundRepeat: 'no-repeat'}" 
            class="cardButton" @click="details(card)">
              {{ card.cardName }}
            </button>
          </v-col>
        </div>
      </v-row>
    </div>
    <div class="big-picture"><img :src="'../src/assets/cards/pictures/'+this.currentCard.name+'.png'" alt=""></div>
    <div class="description">
      <!-- <span>name: {{ this.currentChampion.name }} </span> <br />
      <span>description: {{ this.currentChampion.description }}</span> <br />
      <span>passsive skill: {{ this.currentChampion.passiveSkills }}</span> <br>
      <span>aktive skill: {{ this.currentChampion.passiveSkills }}</span> -->
      {{ this.currentCard }}
    </div>
  </div>
</template>

<style>
h1 {
  text-align: center;
}
.back {
  position: absolute;
  background-image: url(../assets/cards/components/return.png);
  width: 94px;
  height: 64px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  left: 90%;
  top: 2%;
}
.library {
  position: relative;
  background-image: url(../assets/backgrounds/home_background.png);
  width: 100%;
  height: 100%;
  background-attachment: fixed;
  flex: 3;
}

.cardContainer {
  height: 87vh;
  width: 20vw;
  overflow: auto;
  overflow-x: hidden;
  position: relative;
  top: 5vh;
  left: 3vw;
}
.cardButton {
  background-color: rgb(60, 70, 85);
  width: 7.3vw;
  height: 10vw;
  border: 2px solid rgb(87, 170, 247);
  color: aliceblue;
}
.big-picture {
  position: absolute;
  width: 30vw;
  height: 37.5vw;
  /* background-color: rgb(60, 70, 85);
  border: 2px solid rgb(87, 170, 247); */
  top: 13vh;
  left: 30vw;
}
.description {
  position: absolute;
  max-width: 30vw;
  max-height: 30vw;
  background-image: url(../assets/cards/components/text-background.png);
  background-repeat: round;
  /* background-color: rgb(60, 70, 85); */
  border: 2px solid rgb(87, 170, 247);
  top: 30vh;
  left: 65vw;
  word-wrap: break-word;
  word-break: normal;
}
</style>

<script>
export default {
  data() {
    return {
      cards: cards, //alles was wir machen müssen ist ein get zu holen der alle cards
      currentCard: "",
      lobbyID: this.lobbyIDprop,
    };
  },
  methods: {
    details(card) {
      // console.log(this.cards[cardId]);
      this.currentCard = card;
    },
    back() {
      this.$router.push({ path: "./home" });
    }
  },
};
</script>