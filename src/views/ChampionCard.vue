<script setup>
import equipmentComponent from "../components/BlockWithDescription.vue";
import delayComponent from "../components/DelayedeffectComponent.vue";
</script>
<template>
  <div class="container" :class="{'usable':this.usable||this.picked}">
    <div class="championCard" @mouseover="hoverStart()" @mouseleave="hoverEnd()">
      <img
        class="frame"
        src="../assets/card/frame/gold_card_frame_r.png"
        alt=""
      />

      <div
        class="avatar"
        :style="{
          background: 'url(' + this.getImagePath() + ')',
          backgroundSize: 'cover',
        }"
      ></div>

      <div class="name">
        <span>
          {{ this.getName() }}
        </span>
      </div>

      <img class="stone" src="../assets/card/smallParts/stone-p.png" alt="" />

      <table>
        <tr v-for="i in this.health" :key="i">
          <td>
            <img
              :class="{ heartSmall: this.game, heartBig: !this.game }"
              :style="{
                top: 2 + (this.game ? 2 : 3) * i + 'vh',
                left: 2 + 'vh',
              }"
              src="../assets/card/smallParts/health_light.png"
              alt=""
            />
          </td>
        </tr>
      </table>

      <div v-if="game" class="handcard-num">{{ this.handcardNum }}</div>
      <div v-if="game" class="identity">
        {{ this.identity }}
      </div>

      <table>
        <tr v-for="(entry,i) in this.equipment" :key="i">
          <td
            v-if="game"
            class="equip"
            :style="{ bottom: 10+ 5 * i + 'vh' }"
            @mouseenter="showInnerComponents(true)"
            @mouseleave="showInnerComponents(false)"
          >
            <equipment-component
              widthProp="8.9"
              heightProp="3.5"
              :name="entry.name"
              :description="entry.description"
              fontProp="1.5"
              :id="i"
            />
          </td>
        </tr>
      </table>

      <table v-if="game">
        <tr>
          <td v-for="(entry,i) in this.delayedEffects" :key="i">
            <div
              class="delayEffect"
              :style="{ left: 1.5 + i * 4 + 'vh' }"
              @mouseenter="showInnerComponents(true)"
              @mouseleave="showInnerComponents(false)"
            >
              <delay-component :diameter="4" :name="entry.name" :description="entry.description" />
            </div>
          </td>
        </tr>
      </table>
      <transition name="fade-in">
        <div class="description" v-if="this.showDescription" @mouseover="this.showDescription">
          <p v-html="logTextWithLineBreaks"></p>
        </div>
      </transition>
    </div>
    <div
      v-show="this.usable === true || this.currentPlayer || this.picked"
      class="lightCard"
      :class="{
        lightCard3:this.picked,
        lightCard2: this.currentPlayer,
        lightCard: this.usable,
      }"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      game: this.isGame,
      showDescription: false,
      timerDelay: 500,
      hoverComponents: false,
      description: "",
      basePathSymbol: "src/assets/cards/",
    };
  },
  components: {
    equipmentComponent,
    delayComponent,
  },
  computed: {
    logTextWithLineBreaks() {
      return this.getDescription().replace(/\n/g, "<br>");
    },
  },
  props: {
    isGame: Boolean,
    name: "",
    championName: "",
    handcardNum: {
      type: Number,
      default: 0,
    },
    health: {
      type: Number,
      default: 0,
    },
    identity: "",
    equipment: {
      type: Array,
      default: [],
    },
    delayedEffects: [],
    activeSkills: {
      type: Array,
      default: [],
    },
    passiveSkills: {
      type: Array,
      default: [],
    },
    usable: Boolean,
    currentPlayer: Boolean,
    picked: Boolean,
  },
  methods: {

    getImagePath() {
      let path = this.basePathSymbol + this.championName + ".png";
      return path.toLowerCase();
    },
    getName() {
      console.log("handcard: " + this.handcardNum);
      return this.championName + "(" + this.name + ")";
    },

    getDescription() {
      this.description += this.championName + "\n";
      for (let i = 0; i < this.activeSkills.length; i++) {
        if (i === 0) {
          this.description += "ActiveSkills:" + "\n";
        }
        this.description +=
          this.activeSkills[i].name +
          " : " +
          this.activeSkills[i].description +
          "\n";
      }

      for (let i = 0; i < this.passiveSkills.length; i++) {
        if (i === 0) {
          this.description += "PassiveSkills:" + "\n";
        }
        this.description +=
          this.passiveSkills[i].name +
          " : " +
          this.passiveSkills[i].description +
          "\n";
      }
      return this.description;
    },

    showInnerComponents(item) {
      this.hoverComponents = item;
      this.hoverEnd(); // oder nur showDescription = false;
    },
    hoverStart() {
      console.log("in hoverStart: " + this.hoverComponents);

      if (this.hoverComponents === false && !this.showDescription) {
        this.hoverTimer = setTimeout(() => {
          if (this.hoverComponents === false && !this.showDescription)
            this.showDescription = true;
        }, this.timerDelay);
      }
    },
    hoverEnd() {
      clearTimeout(this.hoverTimer);
      this.showDescription = false;
    },
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
  border-radius: 1px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  z-index: 1;
}

.lightCard::before,
.lightCard::after {
  content: "";
  width: 10.5vw;
  height: 30vh;
  border-radius: 8px;
  background-size: 400%;
  position: absolute;
  z-index: -1;
  background-image: linear-gradient(45deg, #d5bc72, #e7c14f, #f1d312);
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
  border-radius: 1px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  z-index: 1;
}

.lightCard2::before,
.lightCard2::after {
  content: "";
  width: 10.5vw;
  height: 30vh;
  border-radius: 8px;
  background-size: 400%;
  position: absolute;
  z-index: -1;
  background-image: linear-gradient(45deg, #ea3838, #d14481, #f11212);
  transition: 1s opacity linear;
  animation: spin 3s linear infinite;
}

.lightCard2::after {
  filter: blur(20px);
  opacity: 0.8;
}

.lightCard3 {
  background: #191c29;
  width: 10vw;
  height: 29vh;
  position: relative;
  top: -29vh;
  border-radius: 1px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  z-index: 1;
}

.lightCard3::before,
.lightCard3::after {
  content: "";
  width: 10.5vw;
  height: 30vh;
  border-radius: 8px;
  background-size: 400%;
  position: absolute;
  z-index: -1;;
  background-image: linear-gradient(45deg, #5ddcff, #3c67e3, #4e00c2);
  transition: 1s opacity linear;
  animation: spin 3s linear infinite;
}

.lightCard3::after {
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

* {
  margin: 0;
  padding: 0;
}

@font-face {
  font-family: "Greek";
  src: url(../assets/fontStyle/greek.ttf);
}

@font-face {
  font-family: "Rhianne";
  src: url(../assets/fontStyle/rhianne.ttf);
}

@font-face {
  font-family: "Blackadder";
  src: url(../assets/fontStyle/blackadder.ttf);
}

.container {
  width: 10vw;
  height: 29vh;
  position: relative;
}

.championCard {
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
  z-index: 4;
  bottom: 0%;
  left: 46.5%;
}

.heartSmall {
  width: 1vw;
  position: absolute;
  z-index: 4;
  top: 1vh;
}

.heartBig {
  width: 1.5vw;
  position: absolute;
  z-index: 4;
  top: 1vh;
}

.handcard-num {
  width: 2.5vh;
  height: 2.5vh;
  position: absolute;
  z-index: 5;
  background-color: red;
  border-radius: 100%;
  background-repeat: no-repeat;
  font-size: 2vh;
  color: aliceblue;
  text-align: center;
  top: 0.2vw;
  left: 8vw;
}

.identity {
  width: 4vh;
  height: 4vh;
  border-radius: 100%;
  position: absolute;
  z-index: 4;
  background-color: green;
  background-repeat: no-repeat;
  font-size: 2vh;
  color: aliceblue;
  text-align: center;
  top: 4vh;
  left: 7vw;
}

.equip {
  left: 5%;
  position: absolute;
  line-height: 180%;
}

.usable {
  cursor: pointer;
}

.delayEffect {
  position: absolute;
  bottom: 6vh;
}
</style>
