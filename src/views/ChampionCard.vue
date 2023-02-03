<script setup>
</script>
<template>
  <div class="championCard">
    <img class="frame" src="../assets/card/frame/gold_card_frame_r.png" alt="" />

    <img class="avatar" src="../assets/card/pictures/Aphrodite.png" alt="" />

    <div class="name">
      <span>
        <!-- {{ this.name }} -->Aphrodite
      </span>
    </div>

    <img class="stone" src="../assets/card/smallParts/stone-p.png" alt="" />
    
    <table >
      <tr  v-for="i in 4" :key="i">
        <td>
          <img class="heart" :style="{ top: 3+2 * i + 'vh', left:2 +'vh' }"  src="../assets/card/smallParts/Health_Light.png" alt="" /> 
        </td>
      </tr>
    </table>

    <div class="handcard-num"><!-- {{ this.handcardNum }} -->3</div>
    <div class="identity">
      <!-- {{ this.identity }} -->K
    </div>
    <div class="equipments">
      <div id="e1" src="" alt="">
        <!-- {{ this.e1 }} -->e1
      </div>
      <div id="e2" src="" alt="">
        <!-- {{ this.e2 }} -->e2
      </div>
    </div>
    <table>
      <tr>
        <td v-for="i in 5" :key="i" >
          <img id="d1" class="debuff" :style="{left:-2+ i*4 +'vh'}" src="../assets/card/smallParts/ring-o.png" alt="" />
        </td>
      </tr>
    </table>

  </div>
</template>

<style scoped>
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
  border-style: solid;
  border-color: cornflowerblue;
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
  width: 8%;
  position: absolute;
  z-index: 4;
  
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
  font-size: 3vh;
  color: aliceblue;
  text-align: center;
  top: 2.5vw;
  left: 8.5vw;
}
#e1,
#e2 {
  width: 10vw;
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
  bottom: 5.5vh;
}
.debuff {
  width: 4vh;
  height: 4vh;
  position: absolute;
  z-index: 4;
  bottom: 1.5vh;
}
</style>

<script>
export default {
  data: () => ({
    // name: "Aphrodite",
    // cardType: "Basic Card",
  }),
  props: {
    name: "",
    handcardNum: Number,
    identity: "",
    e1: "",
    e2: "",
  },
};
</script>