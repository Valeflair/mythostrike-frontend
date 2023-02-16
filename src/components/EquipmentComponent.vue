<template>
    <div class="equipment" :style="{width: widthProp+'vw', height:heightProp+'vh', 'font-size':fontProp+'vh'}">
        {{ this.name }} 
      </div>
      <div class="equipment-description" :style="{width: widthProp+'vw', height:3*heightProp+'vh', top:-3*heightProp+'vh'}">
        {{this.description}}
      </div>
      
</template>

<script>
export default {
    props:{
        widthProp: Number,
        heightProp:Number,
        fontProp:Number,
        name:'',
        description:''
    }
}
</script>


<style scoped>
.equipment{
    transition: 0.2s;
    position: absolute;
    background-image: url(../assets/card/frame/silver_top_frame-p.png);
  background-repeat: round;
  z-index: 4;
  font-size: 1.5vh;
  -webkit-text-stroke: 2px rgba(100, 83, 83, 0.63);
  color: white;
  text-align: center;
  margin: 0 auto;
  
}

.equipment-description{
    display: none;
    width :10vw;
    height: 15vh;
    background-color: red;
    position: absolute;
    top:4vh;
    z-index: 5;

}
.equipment:hover + .equipment-description{
    display: block;
}
</style>