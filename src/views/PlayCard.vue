<script setup>
import cardList from "../data/cards.json";
</script>
<template>
  <div class="container">
    <div class="card" @mouseover="hoverStart()" @mouseout="hoverEnd()">
      <img
        class="frame"
        :src="'../src/assets/cards/frame/'+ this.findCard(1001).frame + '.png'"
        alt=""
      />

      <img
        class="avatar"
        :src="'../src/assets/cards/pictures/' + this.findCard(1001).name + '.png'"
        alt=""
      />

      <div class="name">
        <span>
          {{ this.findCard(1001).cardName }}
        </span>
      </div>

      <img
        class="stone"
        :src="'../src/assets/cards/frame/' + this.findCard(1001).stone + '.png'"
        alt=""
      />

      <div class="description" v-if="this.showDescription">
        {{ this.findCard(1110).description }}
      </div>
    </div>
    <div v-if="this.usable === true" class="lightCard"></div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      cards:cardList,
      showDescription: false,
      timerDelay: 1000,
    };
  },
  methods: {
    hoverStart() {
      this.hoverTimer = setTimeout(() => {
        this.showDescription = true;
      }, this.timerDelay);
    },
    hoverEnd() {
      clearTimeout(this.hoverTimer);
      this.showDescription = false;
    },
    findCard (id) {
     var card = this.cards.find(card => card.id == id);
     return card;
    }
  },
  props: {
    id: "",
    name: "",
    description: "",
    usable: Boolean,
  },
};
</script>

<style scoped>
.lightCard {
  background: #191c29;
  width: 10vw;
  height: 29vh;
  position: relative;
  top: -29vh;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
}

.lightCard::before,
.lightCard::after {
  content: "";
  width: 10.5vw;
  height: 30vh;
  border-radius: 8px;
  background-image: linear-gradient(45deg, #ffff00, #c4ff02, #45fc5a);
  background-size: 400%;
  position: absolute;
  z-index: -1;

  transition: 1s opacity linear;
  animation: spin 3s linear infinite;
}
.lightCard::after {
  filter: blur(20px);
  opacity: 0.8;
}

@keyframes spin {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: 75% 75%;
  }

  50% {
    background-position: 100% 100%;
  }

  75% {
    background-position: 75% 75%;
  }
  100% {
    background-position: 0 0;
  }
}

.container {
  width: 10vw;
  height: 29vh;
  position: relative;
}
.description {
  width: 15vw;
  height: 22vh;
  background-color: red;
  left: 10vw;
  position: absolute;
  z-index: 8;
  border: solid green 3px;
}

* {
  margin: 0;
  padding: 0;
}
@font-face {
  font-family: "Greek";
  src: url(../assets/fontStyle/Greek.ttf);
}
@font-face {
  font-family: "Rhianne";
  src: url(../assets/fontStyle/Rhianne.ttf);
}
@font-face {
  font-family: "Blackadder";
  src: url(../assets/fontStyle/Blackadder.ttf);
}
.card {
  width: 10vw;
  height: 29vh;
  position: relative;
}
.frame {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
}
.avatar {
  width: 99%;
  height: 88%;
  position: absolute;
  z-index: 2;
  bottom: 1%;
}
.name {
  width: 100%;
  position: absolute;
  z-index: 4;
  font-size: 2vh;
  font-style: italic;
  -webkit-text-stroke: 1px black;
  color: aliceblue;
  top: 1.8%;
  text-align: center;
}
.stone {
  width: 2vh;
  height: 2vh;
  position: absolute;
  z-index: 5;
  bottom: 0%;
  left: 46.5%;
}
</style>
