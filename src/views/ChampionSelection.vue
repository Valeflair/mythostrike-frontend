<template>
  <div class="container">
    <div class="area-3-4 pa-5">
      <h1>Select your champion</h1>
      <h1>Your identity: {{ this.identity }}</h1>
      <div class="championContainer">
        <v-row class="d-flex justify-center">
          <div v-for="champion in champions" :key="champion.id">
            <v-col :key="champion.id">
              <button
                class="championButton"
                @click="changeChampion(champion)"
                v-bind:style="{
                  backgroundImage:
                    'url(' +
                    '/cards/' +
                    champion.name.toLowerCase() +
                    '.png' +
                    ')',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                }"
              ></button>
            </v-col>
          </div>
        </v-row>
      </div>
    </div>
    <div class="area-1-4 justify-center">
      <div class="selectedChampion">
        <button
          @click="printPassiveSkill"
          class="championDisplay"
          v-bind:style="{
            backgroundImage:
              'url(' +
              '/cards/' +
              this.currentChampion.name.toLowerCase() +
              '.png' +
              ')',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }"
          disabled
        ></button>
      </div>
      <div class="championDescription">
        <h1 :style="{ color: this.color }">{{ this.currentChampion.name }}</h1>
        <div class="text-center">
          <span v-for="n in this.currentChampion.maxHp"><img
            src="/card/small-parts/health_light.png"
            alt=""
          /></span>
        </div>
        <div
          v-for="pSkill in this.currentChampion.passiveSkills"
          :key="pSkill.name"
          class="justify-center pa-2"
        >
          <div class="skill">
            {{ pSkill.name }}
          </div>
          <div class="skillDescription">
            {{ pSkill.description }}
          </div>
        </div>
        <div
          v-for="aSkill in this.currentChampion.activeSkills"
          :key="aSkill.name"
          class="justify-center pa-2"
        >
          <div class="skill">
            {{ aSkill.name }}
          </div>
          <div class="skillDescription">
            {{ aSkill.description }}
          </div>
        </div>
      </div>

      <button class="confirmButton button" @click="confirmChampion">
        Confirm
      </button>
      <button class="randomButton button" @click="randomChampion">
        Random
      </button>
    </div>
  </div>
</template>

<script>
import gameService from "@/services/gameService";
import { useLobbyStore } from "@/stores/lobby";

export default {
  data() {
    return {
      champions: [],
      currentChampion: null,
      label: "Select your champion",
    };
  },
  setup() {
    const lobbyStore = useLobbyStore();

    return { lobbyStore };
  },
  methods: {
    changeChampion(newChampion) {
      this.currentChampion = newChampion;
      this.label = this.currentChampion.name;
    },
    randomChampion() {
      this.currentChampion =
        this.champions[Math.floor(Math.random() * this.champions.length)];
      this.label = this.currentChampion.name;
    },
    async confirmChampion() {
      console.log(this.currentChampion.id);
      await gameService.selectChampion(this.lobbyStore.getLobby.id, this.currentChampion.id).then(
        (response) => {
          console.log(response);
          this.$router.push("/game");
        },
        (error) => {
          console.log(error);
        },
      );
    },
    initData() {
      this.champions = this.lobbyStore.getChampions();
      this.currentChampion = this.champions[0];
      console.log(this.champions);
      this.identity = this.lobbyStore.getIdentity();
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style scoped>
.randomButton {
  position: relative;
  width: 10vw;
  height: 5vh;
  background-color: #39373c;
  top: 10vh;
  left: 13vw;

  border: none;
  color: white;
  text-align: center;
  font-size: 1vw;
  border-radius: 12px;
  transition-duration: 0.4s;
}

.confirmButton {
  position: relative;
  width: 10vw;
  height: 5vh;
  top: 15vh;
  left: 2vw;
  background-color: #39373c;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  font-size: 1vw;
  border-radius: 12px;
  transition-duration: 0.4s;
}

.button:hover {
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
  0 17px 50px 0 rgba(0, 0, 0, 0.19);
  font-size: 1.1vw;
  font-weight: bold;
}

.button:active {
  box-shadow: 0 3px rgba(0, 0, 0, 0.19);
  transform: translateY(3px);
}

.selectedChampion {
  position: fixed;
  bottom: 65vh;
  align-self: center;
  margin-bottom: 1vh;
}

.championDescription {
  width: 17vw;
  height: 40vh;
  align-self: center;
  position: relative;
  top: 10vh;
}

.skill {
  border-radius: 10px;
  text-align: center;
  height: 5vh;
  margin-top: 1vh;
  float: none;
  display: block;
  align-self: center;
  color: white;
  font-size: 3vh;
  background: url("/elements/skill-background.png");
  background-size: 100%;
}

.skillDescription {
  background-color: #ccaeb4;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  text-align: center;
  z-index: 10;
  width: 16vw;
  word-wrap: break-word;
  font-weight: bold;
  border-radius: 5px;
  transition: opacity 300ms, visibility 500ms;
}

.skill:hover + .skillDescription {
  visibility: visible;
  opacity: 1;
}

.championDisplay {
  width: 11vw;
  height: 30vh;
  padding: 1vh;
  margin-left: 3vh;
  margin-right: 3vh;
  margin-top: 3vh;
  border: 5px solid;
  align-self: center;
}

.championContainer {
  height: 70vh;
  overflow: auto;
  overflow-x: hidden;
  position: relative;
  top: 5vh;
  left: 1vw;
}

.championButton {
  width: 12vw;
  height: 17vw;
  margin-left: 2vh;
  margin-right: 3vh;
  margin-top: 3vh;
}

h1 {
  font-size: 3vw;
  font-size: 4vh;
}

.championButton:hover {
  transform: scale(1.1);
  transition: 0.5s;
}

.container {
  display: flex;
  background: url("/backgrounds/home_background.png");
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}

.area-3-4 {
  flex: 3;
}

.area-1-4 {
  flex: 1;
  display: flex;
  flex-direction: column;
}

h1 {
  text-align: center;
}
</style>
