<script setup>
</script>
<template>
  <div class="card">
    <img class="frame" src="../assets/card/frame/silver_card_frame_p.png" alt="" />

    <img class="avatar" src="../assets/card/pictures/shield.png" alt="" />

    <div class="name">
      <span>{{ name }}</span>
    </div>

    <div class="symbol">
      <img src="../assets/card/smallParts/club.png" alt="" />
      <span>{{ number }}</span>
    </div>

    <img class="stone" src="../assets/card/smallParts/stone-p.png" alt="" />

    <div class="card-type">
      <span>{{ cardType }}</span>
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
.symbol {
  width: 100%;
  position: absolute;
  z-index: 4;
  font-size: 50%;
  font-style: italic;
  color: aliceblue;
  top: 13%;
  left: 8%;
  margin: 0 auto;
}
.name {
  width: 100%;
  position: absolute;
  z-index: 4;
  font-family: Greek;
  font-size: 40%;
  font-style: italic;
  -webkit-text-stroke: 2px rgba(64, 83, 168, 0.479);
  color: aliceblue;
  top: 3%;
  text-align: center;
}
.card-type {
  width: 100%;
  position: absolute;
  z-index: 4;
  font-size: 30%;
  font-style: italic;
  -webkit-text-stroke: 2px rgb(236, 23, 23);
  color: aliceblue;
  bottom: 5%;
  left: 60%;
}
.stone {
  width: 7%;
  height: 6%;
  position: absolute;
  z-index: 4;
  bottom: 0%;
  left: 46.5%;
}
</style>

<script>
export default {
  data: () => ({
    name: "shield",
    cardType: "equipment",
    number: "3",
  }),
};
</script>