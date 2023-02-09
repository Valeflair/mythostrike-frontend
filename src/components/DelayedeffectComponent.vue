<template>
    <img class="debuff" :style="{width: diameter+'vh',height: diameter+'vh'}" src="../assets/card/pictures/nightmare03.png" alt="" />
    <div class="debuff-description">Description</div>
       
</template>

<script>
export default {
    props:{
        diameter:Number,
    }
}
</script>


<style scoped>

.debuff-description{
  display: none;
    width :10vw;
    height: 15vh;
    background-color: green;
    position: absolute;
    bottom:0;
    z-index: 9;
}

.debuff:hover + .debuff-description{
  display: block;
}

.debuff {
  position: absolute;
  z-index: 4;
  border-radius: 100%;
  background-position: top left;
}
</style>

