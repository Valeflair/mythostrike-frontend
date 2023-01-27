<template>
  <img id="bild1" src="@/assets/champions/nyx.png" />
  <img id="bild2" src="@/assets/cards/goldFrame.png" />


</template>

<script>
export default {
  data(){
    return{
      backgroundImage:'@/assets/cards/goldFrame.png',
      contentImage:'@/assets/champions/nyx.png'
    }
  }
}
</script>

<style scoped>
#bild2 {
    position: absolute;
   top: 0;
   left: 0;
   z-index: 2;
   height: 78%;
}
#bild1 {
   position: absolute;
   z-index: 1;
   top:13%;
   height: 65%;
   left: 1%;
}


</style>