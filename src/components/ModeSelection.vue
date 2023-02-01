<script setup>
import axios from'axios';
</script>

<template>
  <div class="overlay">
    <div class="model bg-image">
      <header>
        <h1>{{ getMode().name }}</h1>
      </header>
      <button @click="closeView()" class="close"></button>

      <div class="textArea">
        {{ getMode().description }}
      </div>
      <button class="imageRight" @click="updatePointer(1)"></button>
      <button class="imageLeft" @click="updatePointer(-1)"></button> 
      <button
        class="confirmButton"
        :disabled="!this.status"
        @click="confirm()"
      >
        CONFIRM
      </button>
      <label class="minPlayerLabel">Minimum: {{getMode().minPlayer}} </label>
      
      <label class="maxPlayerLabel">Maximum: {{getMode().maxPlayer}} </label>
    </div>
   
  </div>
</template>

<script>
export default {
  data() {
    return {
      modes: this.modes,
      pointer: this.currentModeId,
      currentMode: this.currentModeProp,
      status: this.isLobbyOwner
    };
  },

  props: {
    modes: Array,
    isLobbyOwner: Boolean,
    currentModeId: Number,
  },
  methods: {
    getMode() {
      return this.modes[this.pointer];
    },
    updatePointer(move) {
      this.pointer += move;
      if (this.pointer < 0) this.pointer = this.modes.length - 1;
      else if (this.pointer === this.modes.length) this.pointer = 0;
    },
    closeView() {
      this.$emit("close:Mode");
    },
    confirm() {
        this.$emit("confirm:Mode", this.pointer);
        this.$emit("close:Mode");
    }
  }
};
</script>

<style scoped>

.minPlayerLabel{
  width:200px;
  font-size: 26px;
  position: relative;
  text-align: center;
  left:15%;
  bottom: 5%;
  color:rgb(255, 255, 114);
}

.maxPlayerLabel{
  width:200px;
  font-size: 26px;
  position: relative;
  text-align: center;
    left:68.5%;
  bottom: 10.5%;
  color:rgb(255, 255, 114);
}

.close{
  background-image: url("@/assets/elements/modeSelection/return.png");
  width: 94px;
  height: 64px;
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  border-radius: 60%;
  margin-top: 7px;
  position: relative;
  left: 88%;
  top:3%;
}

.imageRight{
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  background-image: url("@/assets/elements/modeSelection/arrow_Right.png");
  width:110px;
  height: 75px;
  position: relative;
  left:95%;
  bottom:16%;
}



.imageLeft{
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  background-image: url("@/assets/elements/modeSelection/arrow_Left.png");
  width:110px;
  height: 75px;
  position: relative;
  right:5%;
  bottom:24%;
}

.bg-image {
  background: url("@/assets/backgrounds/modeselect_background.png");
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  width: 1260px;
  height: 750px;
}

.confirmButton {
  width: 234px;
  height: 69px;
  font-size: 32px;
  align-self: center;
  background-image: url("@/assets/elements/modeSelection/selectButton.png");
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  position: relative;
  top:5%;
  color:blanchedalmond;
}


.textArea {
  position: relative;
  top:10%;
  width: 70%;
  height: 70%;
  overflow: auto;
  color:blanchedalmond;
  font-size: 25px;
  align-self: center;
  margin: auto;
  padding: 10px;
}

header h1{
  text-align: center;
}
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.77);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.model {
  width: 1260px;
  height: 750px;
  border-radius: 10px;
  padding: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  
}

.model p {
  background-color: red;
  margin-top: 7px;
  display: flex;
}

header{
  position: relative;
  top:90px;
  font-size: 20px;
  color:blanchedalmond;
}
</style>
