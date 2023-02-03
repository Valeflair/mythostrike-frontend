<script setup>
import axios from 'axios';
    import championData from '../data/champions.json'
    import championCard from '../views/ChampionCard.vue'
</script>

<template>
  <div class="container">
    <div class="area-3-4">
     
            <h1>{{championSelection}} </h1>
        
        <div class="championContainer">
        <v-row class="d-flex justify-center">
            <div v-for="champion in champions" :key="champion.id">
             <v-col  :key="champion.id">   
               <!-- <button class="championButton" @click="changeChampion(champion.id)">{{champion.name}}</button>-->
                <championCard class="championButton"/>
            </v-col>
        </div>         
        </v-row>
        </div>

        
    </div>



    <div class="area-1-4   justify-center " >
        <div class="descriptionChampion">
        <button @click="printPassiveSkill" class=" championDisplay">
            {{this.champions[this.currentChampion].name}} 
        </button>   
        </div>

        <div class="skillContainer">
        <div v-for="pSkill in this.champions[this.currentChampion].passiveSkills" :key=pSkill.name class=" justify-center"> 
            <div class="skill">
                {{pSkill.name}}
            </div>
            <div class="skillDescription">
                {{pSkill.description}}
            </div>
        </div>
         <div v-for="aSkill in this.champions[this.currentChampion].activeSkills" :key=aSkill.name class=" justify-center"> 
            <div class="skill">
                {{aSkill.name}}
            </div>
            <div class="skillDescription">
                {{aSkill.description}}
            </div>
        </div>
        </div>
        
        <button class="confirmButton" @click="confirmChampion">Confirm</button>
        <button class="randomButton" @click="randomChampion">Random</button>
    </div>

    
  </div>

</template>

<script>
export default {
    data(){
        return{
            champions: championData,
            currentChampion: 0,
            championSelection:'Select your Champion',
            lobbyID: this.lobbyIDprop,
            containerX:11,
            containerY:30,
            containerSrc:'@/assets/cards/goldFrame.png',
            imageSrc: '@/assets/champions/nyx.png',
        }
    },
    components:{
        championCard,
    },
    props:{
        lobbyIDprop:Number,
    },
    computed:{
    },
    methods:{
        changeChampion(newChampionID){
            this.currentChampion = newChampionID;
        },
        randomChampion(){
            this.currentChampion = Math.floor(Math.random() * this.champions.length);
        },
        async confirmChampion(){
            await axios
                .post("https://92f6dac7-672e-4bc6-b445-d8221dd9156b.mock.pstmn.io/game/play/champion",{
                    lobbyId: this.lobbyID,
                    selectedChampionId: this.currentChampion,
                })
                .then(
                    (response) => {
                        console.log("erfolgreich, champion ausgewählt");
                        console.log(response.status);
                        this.$router.push({ path: "./game" });
                    },
                    (error) =>{
                        console.log("fehler, champion auswählen");
                        console.log(error);
                    }
                )
        }

    }
}
</script>


<style scoped>

.randomButton{
    position: relative;
    width: 10vw;
    height: 5vh;
    background-color: forestgreen;
    top:10vh;
    left:13vw;

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
.randomButton:hover{
  background-color: red;
  color: #4caf50;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);

}
.confirmButton:hover{
    background-color: red;
  color: #4caf50;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);

}
.confirmButton{
    position: relative;
    width: 10vw;
    height: 5vh;
    top:15vh;
    left:2vw;
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
.descriptionChampion{
    position: fixed;
    bottom: 65vh;
    align-self: center;
    margin-bottom: 1vh;
}
.skillContainer{  
    width: 17vw;
    height: 40vh;
    align-self: center;
    position: relative;
    top:10vh;
}
.skill{
    width: 15vw;
    text-align: center;
    height: 5vh;
    margin-top:1vh ;
    float:none;
    display:block;
    align-self: center;
    border: 2px solid red;
}
.skillDescription{
    width: 20vw;
    background-color: rgb(226, 217, 162);
    display: none;
  position: absolute;
  z-index: 10;
  word-wrap: break-word;
}
.skill:hover + .skillDescription{
    display:block;
}
.championDisplay{
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
.championContainer{
  height: 70vh;
  overflow: auto;
  overflow-x: hidden;
    position: relative;
    top:10vh;
    left:1vw;
}
.championButton{
    width: 11.5vw;
    height: 35vh;
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

  h1{
    text-align: center;
  }
</style>