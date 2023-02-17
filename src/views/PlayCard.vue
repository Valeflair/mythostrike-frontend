<script setup></script>
<template>
  <div class="container" @mouseenter="hoverStart()" @mouseleave="hoverEnd()"
       :class="{'usable':this.usable||this.picked}">
    <div class="card">
      <img
        class="frame"
        src="../assets/card/frame/gold_card_frame_r.png"
        alt=""
      />
      <div
        class="avatar"
        :style="{
          background: 'url(' + this.getImagePathChampion() + ')',
          backgroundSize: 'cover',
        }"
      ></div>

      <div class="name">
        <span>
          {{ this.name }}
        </span>
      </div>

      <img class="stone" src="../assets/card/smallParts/stone-p.png" alt="" />
      <transition name="fade-in">
        <div class="description" v-if="this.showDescription">
          {{ this.description }}
        </div>
      </transition>
      <div class="identity" v-if="this.identity !== null">
        {{ this.identity }}
      </div>
      <div
        class="symbol"
        :style="{
          background: 'url(' + this.getImagePathSymbol() + ')',
          backgroundSize: 'cover',
        }"
      >
        <p class="value">{{ this.value }}</p>
      </div>
    </div>
    <div v-if="this.usable || this.picked"
         :class="{'lightCard':this.usable&&!this.picked,'lightCard2':this.picked}"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDescription: false,
      timerDelay: 750,
      basePathSymbol: "src/assets/card/smallParts/",
      basePathSymbolChampion: "src/assets/cards/",
    };
  },
  methods: {
    getImagePathSymbol() {
      let path = this.basePathSymbol + this.symbol + ".png";
      return path;
    },
    getImagePathChampion() {
      let text = this.name.replace(/\s/g, "");
      let path = this.basePathSymbolChampion + text + ".png";
      return path;
    },

    hoverStart() {
      this.hoverTimer = setTimeout(() => {
        this.showDescription = true;
      }, this.timerDelay);
    },
    hoverEnd() {
      clearTimeout(this.hoverTimer);
      this.showDescription = false;
    },
  },

  props: {
    name: "",
    description: "",
    usable: Boolean,
    identity: "",
    symbol: "",
    picked: Boolean,
    value: Number,
  },
};
</script>

<style scoped>
.fade-in-enter-from {
  opacity: 0;
  transform: translateY(5vh);
}

.fade-in-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-enter-active {
  transition: all 0.5s ease;
}

.fade-in-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-leave-to {
  opacity: 0;
  transform: translateY(5vh);
}

.fade-in-leave-active {
  transition: all 0.3s ease;
}

.description {
  width: 9vw;
  height: 20vh;
  top: 7.5vh;
  background-color: rgba(0, 0, 0, 0.5);
  left: 0.5vw;
  position: absolute;
  z-index: 8;
  color: rgb(247, 247, 100);
  padding: 5px;
  overflow-y: auto;
}

.card {
  width: 10vw;
  height: 29vh;
  position: relative;
}

.value {
  text-align: center;
  line-height: 3;
}

.symbol {
  position: absolute;
  z-index: 8;
  font-size: 1vh;
  top: 3vh;
  left: 0.5vw;
  width: 3.5vh;
  height: 3.5vh;
  font-weight: bold;
  text-align: center;
  background-repeat: no-repeat;
  background-position: center;
  color: yellow;
  align-content: center;
}

.identity {
  position: absolute;
  width: 2.5vw;
  height: 3vh;
  background-color: red;
  z-index: 8;
  font: 2vh;
  color: black;

  right: 0.7vw;
  top: 3vh;
}

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


.lightCard2 {
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

.lightCard2::before,
.lightCard2::after {
  content: "";
  width: 10.5vw;
  height: 30vh;
  border-radius: 8px;
  background-image: linear-gradient(45deg, #5ddcff, #3c67e3, #4e00c2);
  background-size: 400%;
  position: absolute;
  z-index: -1;

  transition: 1s opacity linear;
  animation: spin 3s linear infinite;
}

.lightCard2::after {
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

.usable {
  cursor: pointer;
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
  z-index: 4;
  bottom: 0%;
  left: 46.5%;
}
</style>
