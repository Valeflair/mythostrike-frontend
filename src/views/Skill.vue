<template>
  <div class="skill-area">
    <div class="skill-name">
      <span
        >{{ skillName }} <br />
        {{ skillState }}</span
      >
    </div>
    <div class="skill-des">
        <span>{{ skillDes }}</span>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
@font-face {
  font-family: Blackadder;
  src: url(../assets/fontStyle/Blackadder.ttf);
}
.skill-area {
  max-height: 300px;
  max-width: 300px;
  font-size: 15px;
  background-image: url(../assets/card/text/text-background.png);
  color: rgb(252, 253, 255);
}
.skill-name {
  background-image: url(../assets/card/text/skill-background.png);
  background-repeat: round;
  background-size: cover;
  font-family: Blackadder;
  -webkit-text-stroke: 0.7px rgba(255, 53, 2, 0.685);
  color: aliceblue;
  font-size: 170%;
}
</style>

<script>
export default {
  data: () => ({
    skillName: "skill name",
    skillState: "skill state (aktive or passive)",
    skillDes: "Here is sopmthing about this skill that must be clar."
  }),
};
</script>