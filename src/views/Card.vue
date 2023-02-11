<script setup>
import ChampionCard from "../views/ChampionCard.vue";
import PlayCard from "../views/PlayCard.vue";

</script>
<template>
  <div class="champion" v-if =/^([1-9]|[0-9][0-9]|[1-9][0-9][0-9]|1000)$/.test(this.id)>
    <champion-card></champion-card>
  </div>
  
  <div class="card" v-if =/^(?!1000)[1-9]\d{3,}$/.test(this.id)>
    <play-card></play-card>
  </div>
  <!-- <div class="championCard">

    <img class="frame" src="../assets/card/frame/gold_card_frame_r.png" alt="" />

    <img class="avatar" src="../assets/card/pictures/Aphrodite.png" alt="" />

    <div class="name">
      <span>
        NAME
      </span>
    </div>

    <img class="stone" src="../assets/card/smallParts/stone-p.png" alt="" />
    
    <table >
      <tr  v-for="i in this.health" :key="i">
        <td>
          <img class="heart" :style="{ top: 2+3 * i + 'vh', left:2 +'vh' }"  src="../assets/card/smallParts/Health_Light.png" alt="" /> 
        </td>
      </tr>
    </table>

    <div v-if="game" class="handcard-num">  5 </div>
    <div  v-if="game" class="identity">
      K
    </div>


    <div  v-if="game" class="equipments">
      <div id="e1" v-if="2>0" src="" alt="">
        Spear of Ares
      </div>
      <div class="e1-description">
        asdasdasda
      </div>
      <div  v-if="2>1" id="e2" src="" alt="">
        Shield of Athena
      </div>
      <div class="e2-description">
        asdsadsadasadasdsad
      </div>
    </div>


    <table  v-if="game">
      <tr>
        <td  v-for="i in 3" :key="i" >
          <img id="d1" class="debuff" :style="{left:-2+ i*4 +'vh'}" src="../assets/card/smallParts/ring-o.png" alt="" />
          <div class="debuff-description"></div>
        </td>
      </tr>
    </table>

  </div> -->
</template>


<script>
export default {
  components: { ChampionCard, PlayCard },
  data() {
    return {
      id: "1",
    };
  },

  props: {
    isgame: Boolean,
    name: "",
    handcardNum: Number,
    
    identity: "",
    equipment: Array,
    passiveEffect: Array,
  },
  method: {},
};
</script>

<!-- <style scoped>
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
.heart {
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
#e1,
#e2 {
  width: 8.9vw;
  height: 3.5vh;
  left: 5%;
  position: absolute;
  background-image: url(../assets/card/frame/silver_top_frame-p.png);
  background-repeat: round;
  z-index: 4;
  font-size: 1.8vh;
  -webkit-text-stroke: 2px rgba(100, 83, 83, 0.63);
  color: white;
  text-align: center;
  margin: 0 auto;
  line-height: 180%;
}
#e1 {
  bottom: 10vh;
}
#e2 {
  bottom: 6vh;
}
.e1-description {
  display: none;
  width: 10vw;
  height: 15vh;
  background-color: red;
  position: absolute;
  top: 6vh;
  z-index: 5;
}

.e2-description {
  display: none;
  width: 10vw;
  height: 15vh;
  background-color: red;
  position: absolute;
  top: 9.5vh;
  z-index: 5;
}

.debuff-description {
  display: none;
  width: 10vw;
  height: 15vh;
  background-color: green;
  position: absolute;
  z-index: 5;
}

.debuff:hover + .debuff-description {
  display: block;
}
#e1:hover + .e1-description {
  display: block;
}

#e2:hover + .e2-description {
  display: block;
}

.debuff {
  width: 4vh;
  height: 4vh;
  position: absolute;
  z-index: 4;
  bottom: 1.5vh;
}
</style> -->
