<template>
  <div
    class="equipment"
    :class="{ usableClass: usableProp && !used, notUsableClass: !usableProp, usedClass: used }"
    :style="{
      width: widthProp + 'vw',
      height: heightProp + 'vh',
      'font-size': fontProp + 'vh',
    }"
    @click="emitSkillUsed"
    @mouseenter="hoverStart"
    @mouseleave="hoverEnd"
  >
    {{ name }}
  </div>
  <transition name="fade-in">
    <div
      class="equipment-description ma-1"
      :style="{
        width: widthProp + 'vw',
      }"
      v-if="showDescription"
    >
      {{ description }}
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showDescription: false,
      timerDelay: 500,
    };
  },
  inheritAttrs: false,
  props: {
    widthProp: String,
    heightProp: String,
    fontProp: String,
    usableProp: false,
    used: false,
    name: "",
    description: "",
  },
  methods: {
    hoverStart() {
      console.log("HOVER FUNKTIONIERT");
      this.hoverTimer = setTimeout(() => {
        this.showDescription = true;
      }, this.timerDelay);
    },
    hoverEnd() {
      clearTimeout(this.hoverTimer);
      this.showDescription = false;
    },
  },
};
</script>

<style scoped>
.fade-in-enter-from {
  opacity: 0;
  transform: translateY(1vh);
}

.fade-in-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-enter-active {
  transition: all 0.5s ease;
}

.fade-in-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-leave-to {
  opacity: 0;
  transform: translateY(1vh);
}

.fade-in-leave-active {
  transition: all 0.3s ease;
}

.usableClass {
  border: solid yellow 2px;
  cursor: pointer;
}

.usedClass {
  border: solid red 2px;
  cursor: pointer;
}

.notUsableClass {
  border: solid black 2px;
}

.equipment {
  transition: 0.2s;
  position: absolute;
  background-image: url(/card/frame/silver_top_frame-p.png);
  background-repeat: round;
  z-index: 4;
  font-size: 1vh;
  font-weight: bold;
  color: white;
  text-shadow: #000000 2px 2px 4px;
  text-align: center;
  margin: 0 auto;
}

.equipment-description {
  font-size: 1.5vh;
  padding: 5px;
  position: absolute;
  bottom: 0;
  z-index: 9;
  overflow-y: auto;
  color: white;
  text-shadow: #000000 2px 2px 4px;
  background: url("/elements/banner.png");
  background-size: cover;
}

.equipment:hover + .equipment-description {
  display: block;
  z-index: 8;
}
</style>
