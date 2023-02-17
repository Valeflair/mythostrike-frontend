<script setup>
import equipmentComponent from "../components/BlockWithDescription.vue";
</script>
<template>
  <div class="container">
    <div
      class="championCard"
      @mouseenter="this.showSkills = true"
      @mouseleave="this.showSkills = false"
    >
      <img
        class="frame"
        :src="'/card/frame/gold_card_frame_r.png'"
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

      <img class="stone" :src="'/card/smallParts/stone-p.png'" alt="" />

      <table>
        <tr v-for="i in this.health" :key="i">
          <td>
            <img
              class="heartBig"
              :style="{ top: 2 + 3 * i + 'vh', left: 2 + 'vh' }"
              :src="'/card/smallParts/health_light.png'"
              alt=""
            />
          </td>
        </tr>
      </table>

      <div v-if="game" class="identity">
        {{ this.identity }}
      </div>

      <table class="skillList">
        <tr
          v-for="(skill, i) in this.activeSkills.concat(this.passiveSkills)"
          :key="skill.name"
        >
          <td class="skill" :style="{ bottom: 5 * i + 'vh' }"
              @click="useSkill(i,skill.id)">
            <equipment-component
              widthProp="10.2"
              heightProp="5"
              :name="skill.name"
              :description="skill.description"
              fontProp="1.5"
              :usableProp="
                containsId(skill.id, this.messageActivitysUsable.skillIds)
              "
              :used="this.usedSkill.skillId === skill.id"
              :id="skill.id"
            />
          </td>
        </tr>
      </table>
    </div>

    <div
      v-if="this.usable || this.currentPlayer"
      :class="{
        lightCard2: this.currentPlayer,
        lightCard: !this.currentPlayer,
      }"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      game: true,
      showSkills: false,
      timerDelay: 1000,
      hoverComponents: false,
      basePathSymbol: "/cards/",

    };
  },
  components: {
    equipmentComponent,
  },
  props: {
    name: "",
    championName: "",
    usedSkill: Object,
    health: {
      type: Number,
      default: 0,
    },
    identity: "",
    messageActivitysUsable: Object,
    passiveSkills: {
      type: Array,
      default: [],
    },
    activeSkills: {
      type: Array,
      default: [],
    },
    currentPlayer: Boolean,
  },
  methods: {


    getImagePath() {
      let path = this.basePathSymbol + this.championName + ".png";
      return path.toLowerCase();
    },
    getName() {
      return this.championName + "(" + this.name + ")";
    },
    useSkill(i, skillId) {
      console.log("DER SKILL WURDE AUSGEFÜHRT");
      console.log("id: ");
      console.log(skillId);
      console.log("HIGHLIGHT");
      console.log(this.messageActivitysUsable);
      if (this.containsId(skillId, this.messageActivitysUsable.skillIds)) {
        console.log("SKILL EMITTED");
        this.$emit("skillUsed", i, skillId);
      }
    },
    containsId(id, array) {
      for (const element of array) {
        if (id === element) return true;
      }
      return false;
    },
    hoverStart(skill) {
      this.hoverTimer = setTimeout(() => {
        skill.showSkills = true;
      }, this.timerDelay);
    },
    hoverEnd(skill) {
      clearTimeout(this.hoverTimer);
      skill.showSkills = false;
    },
  },
};
</script>

<style scoped>
.lightCard {
  background: #191c29;
  width: 11.5vw;
  height: 35vh;
  position: relative;
  top: -35vh;
  border-radius: 1px;
  justify-content: center;
  align-items: center;
  display: flex;
  z-index: 1;
}

.lightCard::before,
.lightCard::after {
  content: "";
  width: 12.5vw;
  height: 37vh;
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

.lightCard2 {
  background: #191c29;
  width: 11.5vw;
  height: 35vh;
  position: relative;
  top: -35vh;
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
  width: 12.5vw;
  height: 37vh;
  border-radius: 8px;
  background-image: linear-gradient(45deg, #ea3838, #d14481, #f11212);
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

.usableClass {
  border: solid yellow 10px;
  cursor: pointer;
}

.notUsableClass {
  border: solid black 5px;
}

.skill-description {
  width: 10vw;
  height: 10vh;
  top: -10vh;
  overflow-y: auto;
  position: absolute;
  background-color: blueviolet;
  z-index: 10;
}

.skill {
  left: 5%;
  position: absolute;
  line-height: 180%;
}

.skillList {
  position: absolute;
  bottom: 8vh;
  left: 0.6vw;
}

.description {
  width: 20vw;
  height: 22vh;
  background-color: red;
  left: 10vw;
  position: absolute;
  z-index: 6;
  border: solid green 3px;
}

* {
  margin: 0;
  padding: 0;
}

@font-face {
  font-family: "Greek";
  src: url(/fontStyle/greek.ttf);
}

@font-face {
  font-family: "Rhianne";
  src: url(/fontStyle/rhianne.ttf);
}

@font-face {
  font-family: "Blackadder";
  src: url(/fontStyle/blackadder.ttf);
}

.championCard {
  width: 11.5vw;
  height: 35vh;
  position: relative;
  background-color: red;
}

.container {
  width: 11.5vw;
  height: 35vh;
  position: relative;
  background-color: red;
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
  top: 0.5vw;
  left: 9.5vw;
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
  top: 5vh;
  left: 8.5vw;
}
</style>
