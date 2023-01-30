<script setup>
</script>
<template>
  <div class="card">
    <img class="frame" src="../assets/card/gold_card_frame02_r.png" alt="" />

    <img class="avatar" src="../assets/card/Aphrodite01.png" alt="" />

    <img class="suit" src="../assets/card/club.png" alt="" />

    <div class="name">
      <span>{{ name }}</span>
    </div>

    <img class="stone" src="../assets/card/stone-p.png" alt="" />

    <div class="card-type">
      <span>{{ cardType }}</span>
    </div>
    <!-- <div class="a-skill">

    </div>
    <div class="p-skill">

    </div> -->
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
.suit {
  width: 10%;
  position: absolute;
  z-index: 1;
  top: 15%;
  left: 10%;
}

/* .skill-area {
  position: absolute;
  z-index: 1;
  bottom: 3%;
}
.suit {
  position: absolute;
  z-index: 1;
} */
.name {
  width: 100%;
  position: absolute;
  z-index: 4;
  font-family: Greek;
  font-size: 40%;
  font-style: italic;
  -webkit-text-stroke: 2px rgb(0, 0, 0);
  color: aliceblue;
  top: 3%;
  text-align: center;
}
.card-type {
  width: 100%;
  position: absolute;
  z-index: 4;
  /* font-family: Rhianne; */
  font-size: 30%;
  font-style: italic;
  -webkit-text-stroke: 2px rgb(236, 23, 23);
  color: aliceblue;
  bottom: 5%;
  left: 60%
}
.stone {
  width: 7%;
  height: 6%;
  position: absolute;
  z-index: 4;
  bottom: 0%;
  left: 46.5%;
}
/* .a-skill {
  position: absolute;
  z-index: 2;
}
.p-skill {
  position: absolute;
  z-index: 2;
} */
</style>

<script>
export default {
  data: () => ({
    name:"Aphrodite",
    cardType: "Basic Card",
  }),
};
</script>