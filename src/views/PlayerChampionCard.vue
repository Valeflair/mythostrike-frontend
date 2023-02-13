<script setup>
import equipmentComponent from "../components/blockWithDescription.vue";
import delayComponent from "../components/DelayedeffectComponent.vue";
</script>
<template>
  <div
    class="championCard"
    @mouseenter="this.showSkills = true"
    @mouseleave="this.showSkills = false"
    @click="print"
  >
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
            class="heartBig"
            :style="{ top: 2 + 3 * i + 'vh', left: 2 + 'vh' }"
            src="../assets/card/smallParts/Health_Light.png"
            alt=""
          />
        </td>
      </tr>
    </table>

    <div v-if="game" class="identity">
      {{ this.identity }}
    </div>

    <table class="skillList" v-if="this.showSkills">
      <tr
        v-for="(skill, i) in this.activeSkills.concat(this.passiveSkills)"
        :key="skill.name"
      >
        <td class="skill" :style="{ bottom: 5 * i + 'vh' }">
          <equipment-component
            widthProp="10.2"
            heightProp="5"
            :name="skill.name"
            :description="skill.description"
            fontProp="1.5"
            :usableProp="
              containsId(skill.id, this.messageActivitysUsable.skillsID)
            "
            :id="skill.id"
            @skillUsed="useSkill"
          />
        </td>
      </tr>
    </table>
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
      basePathSymbol: "src/assets/cards/",
      messageActivitysUsable: {
        cardsId: [],
        players: [],
        skillsID: [0],
        minCard: 0,
        maxCard: 0,
        minPlayer: 0,
        maxPlayer: 0,
        reason: "",
      },
    };
  },
  components: {
    equipmentComponent,
    delayComponent,
  },
  methods: {
    getImagePath() {
      let path = this.basePathSymbol + this.championName + ".png";
      return path;
    },
    getName() {
      return this.championName + "(" + this.name + ")";
    },
    print() {
      console.log(this.activeSkills);
      console.log("skills: " + this.activeSkills + this.passiveSkills);
    },
    useSkill(skillId) {
      this.$emit("skillUsed", skillId);
    },
    containsId(id, array) {
      for (let i = 0; i < array.length; i++) {
        if (id === array[i]) return true;
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

  props: {
    name: "",
    championName: "",
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
  },
};
</script>

<style scoped>
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
.championCard {
  width: 11.5vw;
  height: 35vh;
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
  z-index: 0;
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
