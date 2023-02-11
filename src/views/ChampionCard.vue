<script setup>
import equipmentComponent from "../components/EquipmentComponent.vue";
import delayComponent from "../components/DelayedeffectComponent.vue";
import cardList from "../data/cards.json";
</script>
<template>
  <div class="container">
    <div class="championCard" @mouseover="hoverStart()" @mouseout="hoverEnd()">
      <img
        class="frame"
        :src="'../src/assets/cards/frame/' + this.findCard(1).frame + '.png'"
        alt=""
      />

      <img
        class="avatar"
        :src="
          '../src/assets/cards/pictures/' + this.findCard(1).name + '.png'
        "
        alt=""
      />

      <div class="name">
        <span>
          {{ this.name }}
        </span>
      </div>

      <img
        class="stone"
        :src="'../src/assets/cards/frame/' + this.findCard(1).stone + '.png'"
        alt=""
      />

      <table>
        <tr v-for="i in this.findCard(1).health" :key="i">
          <td>
            <img
              :class="{ heartSmall: this.game, heartBig: !this.game }"
              :style="{
                top: 2 + (this.game ? 2 : 3) * i + 'vh',
                left: 2 + 'vh',
              }"
              src="../assets/card/smallParts/Health_Light.png"
              alt=""
            />
          </td>
        </tr>
      </table>

      <div v-if="game" class="handcard-num">{{ this.handcardNum }}</div>
      <div v-if="game" class="identity"><!-- {{ this.identity }}-->K</div>

      <table>
        <tr v-for="i in 2" :key="i">
          <td
            v-if="game"
            class="equip"
            :style="{ bottom: 13 - (i - 1) * 3.5 + 'vh' }"
            @mouseenter="showInnerComponents(true)"
            @mouseleave="showInnerComponents(false)"
          >
            <equipment-component
              widthProp="8.9"
              heightProp="3.5"
              name="NAME EQUIPMENT"
              description="Description Equipment"
              fontProp="1.5"
              :usableProp="false"
              :id="i"
            />
          </td>
        </tr>
      </table>

      <table v-if="game">
        <tr>
          <td v-for="i in this.passiveEffect.length" :key="i">
            <div
              class="delayEffect"
              :style="{ left: -2 + i * 4 + 'vh' }"
              @mouseenter="showInnerComponents(true)"
              @mouseleave="showInnerComponents(false)"
            >
              <delay-component :diameter="4" />
            </div>
          </td>
        </tr>
      </table>

      <div class="description" v-if="this.showDescription">
        {{ this.description }}
      </div>
    </div>
    <div v-show="this.usable === true" class="lightCard"></div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      cards:cardList,
      health: 3,
      game: this.isGame,
      showDescription: false,
      timerDelay: 1000,
      hoverComponents: false,
    };
  },
  components: {
    equipmentComponent,
    delayComponent,
  },
  methods: {
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
    findCard (id) {
     var card = this.cards.find(card => card.id == id);
     return card;
    }
  },

  props: {
    isGame: Boolean,
    name: "",
    handcardNum: Number,
    health: Number,
    identity: "",
    equipment: Array,
    passiveEffect: Array,
    description: "",
    usable: Boolean,
  },
  methods: {
    findCard(id) {
      var card = this.cards.find((card) => card.id == id);
      return card;
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
  background-image: linear-gradient(45deg, #5ddcff, #3c67e3, #4e00c2);
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

.description {
  width: 20vw;
  height: 22vh;
  background-color: red;
  left: 10vw;
  position: absolute;
  top: 0;
  z-index: 9;
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
  font-size: 3vh;
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

.delayEffect {
  position: absolute;
  bottom: 6vh;
}
</style>
