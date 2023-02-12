<template>
  <div class="container">
    <div class="area-3-4">
      <h1>Select your Champion</h1>

      <div class="championContainer">
        <v-row class="d-flex justify-center">
          <div v-for="champion in champions" :key="champion.id">
            <v-col :key="champion.id">
              <button
                class="championButton"
                @click="changeChampion(champion.id)"
              >
                {{ champion.name }}
              </button>
            </v-col>
          </div>
        </v-row>
      </div>
    </div>

    <div class="area-1-4 justify-center">
      <div class="descriptionChampion">
        <button @click="printPassiveSkill" class="championDisplay">
          {{ this.champions[this.currentChampionId].name }}
        </button>
      </div>

      <div class="skillContainer">
        <div
          v-for="pSkill in this.champions[this.currentChampionId].passiveSkills"
          :key="pSkill.name"
          class="justify-center"
        >
          <div class="skill">
            {{ pSkill.name }}
          </div>
          <div class="skillDescription">
            {{ pSkill.description }}
          </div>
        </div>
        <div
          v-for="aSkill in this.champions[this.currentChampionId].activeSkills"
          :key="aSkill.name"
          class="justify-center"
        >
          <div class="skill">
            {{ aSkill.name }}
          </div>
          <div class="skillDescription">
            {{ aSkill.description }}
          </div>
        </div>
      </div>

      <button class="confirmButton" @click="confirmChampion">Confirm</button>
      <button class="randomButton" @click="randomChampion">Random</button>
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
      currentChampionId: 0,
      lobbyID: this.lobbyIDprop,
    };
  },
  setup() {
    const lobbyStore = useLobbyStore();

    return {lobbyStore};
  },
  methods: {
    changeChampion(newChampionID) {
      this.currentChampionId = newChampionID;
    },
    randomChampion() {
      this.currentChampionId = Math.floor(Math.random() * this.champions.length);
    },
    async confirmChampion() {
      await gameService.selectChampion(this.lobbyId).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      )
    },
    initData(){
      this.champions = this.lobbyStore.getChampions();
      this.lobbyID = this.lobbyStore.getLobby.id;
      this.identity = this.lobbyStore.getIdentity();
    }
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
  background-color: forestgreen;
  top: 10vh;
  left: 13vw;

  border: none;
  color: white;
  padding: 14px 40px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 12px;
  transition-duration: 0.4s;
}

.randomButton:hover {
  background-color: red;
  color: #4caf50;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

.confirmButton:hover {
  background-color: red;
  color: #4caf50;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}

.confirmButton {
  position: relative;
  width: 10vw;
  height: 5vh;
  top: 15vh;
  left: 2vw;
  background-color: forestgreen;
  border: none;
  color: white;
  padding: 14px 40px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 12px;
}

.descriptionChampion {
  position: fixed;
  bottom: 65vh;
  align-self: center;
  margin-bottom: 1vh;
}

.skillContainer {
  width: 17vw;
  height: 40vh;
  align-self: center;
  position: relative;
  top: 10vh;
}

.skill {
  width: 15vw;
  text-align: center;
  height: 5vh;
  margin-top: 1vh;
  float: none;
  display: block;
  align-self: center;
  border: 2px solid red;
}
.skillDescription {
  width: 20vw;
  background-color: rgb(226, 217, 162);
  display: none;
  position: absolute;
  z-index: 10;
  word-wrap: break-word;
}

.skill:hover + .skillDescription {
  display: block;
}

.championDisplay {
  background-color: blanchedalmond;
  width: 11vw;
  height: 30vh;
  padding: 1vh;
  margin-left: 3vh;
  margin-right: 3vh;
  margin-top: 3vh;
  border: 2px solid black;
  align-self: center;
}

.championContainer {
  height: 70vh;
  overflow: auto;
  overflow-x: hidden;
  position: relative;
  top: 10vh;
  left: 1vw;
}

.championButton {
  background-color: blanchedalmond;
  width: 12vw;
  height: 15vw;
  padding: 1vh;
  margin-left: 3vh;
  margin-right: 3vh;
  margin-top: 3vh;
  border: 2px solid black;
}

.container {
  display: flex;
  background: url("@/assets/backgrounds/home_background.png");
  width: 100%;
  height: 100%;
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
