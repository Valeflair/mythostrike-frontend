<template>
    <img class="debuff" src="../assets/card/smallParts/ring-o.png" alt="" />
    <div class="debuff-description">Description</div>
       
</template>


<style scoped>

.debuff-description{
  display: none;
    width :10vw;
    height: 15vh;
    background-color: green;
    position: absolute;
    bottom:0;
    z-index: 5;
}

.debuff:hover + .debuff-description{
  display: block;
}

.debuff {
  width: 4vh;
  height: 4vh;
  position: absolute;
  z-index: 4;
}
</style>

