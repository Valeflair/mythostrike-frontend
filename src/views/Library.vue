<template>
  <div class="library">
    <h1 class="pt-5">{{ this.currentCard.name }}</h1>
    <button class="back" @click="back"></button>
    <div class="cardContainer">
      <v-row class="d-flex justify-left">
        <div v-for="card in cards" :key="card.id">
          <v-col :key="card.id">
            <button
              v-bind:style="{
                backgroundImage:
                  'url(' + '/cards/' + card.name.toLowerCase() + '.png' + ')',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }"
              class="cardButton"
              @click="selectView(card)"
            ></button>
          </v-col>
        </div>
      </v-row>
    </div>
    <div class="big-picture">
      <img
        :src="'/cards/' + this.currentCard.name.toLowerCase() + '.png'"
        alt=""
      />
    </div>
    <div class="description">
      {{ this.currentCard.description }}
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

.back {
  position: absolute;
  background-image: url("/elements/return.png");
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
  background-image: url("/backgrounds/lobby_background.png");
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
  background-image: url("/elements/text-background.png");
  background-repeat: round;
  top: 30vh;
  left: 65vw;
  word-wrap: break-word;
  word-break: normal;
  font-size: 1.5vw;
  color: white;
}
</style>

<script>
import resourceService from "@/services/resourceService";

export default {
  data() {
    return {
      cards: [],
      champions: [],
      currentCard: "",
    };
  },
  methods: {
    selectView(card) {
      this.currentCard = card;
    },
    back() {
      this.$router.push({ path: "./home" });
    },
    async initCards() {
      await resourceService.getCards().then(
        (response) => {
          let cards = response.data;
          this.cards = cards.reduce((acc, card) => {
            if (!acc.find((u) => u.name === card.name)) {
              acc.push(card);
            }
            return acc;
          }, []);
          this.currentCard = this.cards[0];
        },
        (error) => {
          console.log(error);
        },
      );
      await resourceService.getChampions().then(
        (response) => {
          let champions = response.data;
          this.cards = this.cards.concat(champions);
        },
        (error) => {
          console.log(error);
        },
      );
    },
  },
  created() {
    this.initCards();
  },
};
</script>
