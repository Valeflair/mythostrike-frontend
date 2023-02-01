<script setup>
</script>
<template>
  <div class="card">
    <img class="frame" src="../assets/card/frame/gold_card_frame_r.png" alt="" />

    <img class="avatar" src="../assets/card/pictures/Aphrodite.png" alt="" />

    <div class="name">
      <span>
        <!-- {{ this.name }} -->Aphrodite
      </span>
    </div>

    <img class="stone" src="../assets/card/smallParts/stone-p.png" alt="" />

    <div class="life-points">
      <img id="p1" class="heart" src="../assets/card/smallParts/Health_Light.png" alt="" /> 
      <img id="p2" class="heart" src="../assets/card/smallParts/Health_Light.png" alt="" /> 
      <img id="p3" class="heart" src="../assets/card/smallParts/Health_Light.png" alt="" /> 
      <img id="p4" class="heart" src="../assets/card/smallParts/Health_Light.png" alt="" /> 
      <img id="p5" class="heart" src="../assets/card/smallParts/Health_Light.png" alt="" /> 
    </div>
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
    <div class="debuff">
      <img id="d1" src="../assets/card/smallParts/ring-o.png" alt="" />
      <img id="d2" src="../assets/card/smallParts/ring-o.png" alt="" />
    </div>
  </div>
</template>

<style>
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
.card {
  width: 512px;
  height: 815px;
  border-style: solid;
  border-color: cornflowerblue;
  position: relative;
  font-size: 100px;
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
  font-family: Blackadder;
  font-size: 60%;
  font-style: italic;
  -webkit-text-stroke: 1px black;
  color: aliceblue;
  top: 1.8%;
  text-align: center;
}
.stone {
  width: 7%;
  height: 6%;
  position: absolute;
  z-index: 4;
  bottom: 0%;
  left: 46.5%;
}
.life-points {
  width: 8%;
  position: absolute;
  z-index: 4;
  top: 13%;
  left: 7%;
}
.heart {
  display: block;
}
.handcard-num {
  width: 11%;
  height: 11%;
  position: absolute;
  z-index: 4;
  background-image: url(../assets/card/smallParts/ring-g.png);
  background-repeat: no-repeat;
  font-size: 40%;
  color: aliceblue;
  text-align: center;
  top: 3%;
  left: 88%;
}
.identity {
  width: 11%;
  height: 11%;
  position: absolute;
  z-index: 4;
  background-image: url(../assets/card/smallParts/ring.png);
  background-repeat: no-repeat;
  font-size: 40%;
  color: aliceblue;
  text-align: center;
  top: 13%;
  left: 80%;
}
#e1,
#e2 {
  width: 89%;
  height: 11%;
  left: 5%;
  position: absolute;
  background-image: url(../assets/card/frame/silver_top_frame-p.png);
  background-repeat: round;
  z-index: 4;
  font-size: 52%;
  -webkit-text-stroke: 2px rgba(2, 2, 2, 0.63);
  color: white;
  text-align: center;
  margin: 0 auto;
  line-height: 180%;
}
#e1 {
  bottom: 19%;
}
#e2 {
  bottom: 8%;
}
.debuff {
  width: 100%;
  height: 11%;
  position: absolute;
  z-index: 4;
  bottom: 2.5%;
  left: 70%;
}
#d1, #d2 {
  width: 14%;
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