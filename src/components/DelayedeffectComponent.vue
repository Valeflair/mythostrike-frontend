<template>
  <div
    class="debuff"
    :style="{
      width: diameter + 'vh',
      height: diameter + 'vh',
      background: 'url(' + getImagePath() + ')',
      backgroundSize: 'cover',
    }"
  ></div>

  <div class="debuff-description">{{ description }}</div>
</template>

<script>
export default {
  data() {
    return {
      basePathSymbol: "/cards/",
    };
  },
  props: {
    diameter: Number,
    description: "",
    name: "",
  },
  methods: {
    getImagePath() {
      let path = this.basePathSymbol + this.name + ".png";
      return path.toLowerCase();
    },
  },
};
</script>

<style scoped>
.debuff-description {
  display: none;
  width: 10vw;
  background: url("/elements/banner.png");
  background-size: cover;
  font-weight: bold;
  color: white;
  text-shadow: #000000 2px 2px 4px;
  border-radius: 15px;
  position: absolute;
  bottom: 0;
  z-index: 9;
}

.debuff:hover + .debuff-description {
  display: block;
}

.debuff {
  position: absolute;
  z-index: 4;
  border-radius: 100%;
}
</style>
