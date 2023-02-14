<template>
  <div class="overlay">
    <button class="close" @click="close"></button>
    <div class="selectArea text-center">
      <h1 class="pb-5">Please select your avatar</h1>
      <v-row class="d-flex justify-center">
        <div v-for="id in 12" :key="id">
          <v-col :key="n">
            <img
              :src="
                '../src/assets/avatars/avatar' +
                id +
                '.png'
              "
              class="image"
              @click="changeAvatar(id)"
              />
          </v-col>
        </div>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    close() {
      this.$emit("close:AvatarSelection");
    },
    changeAvatar(newAvatarId){
      this.$emit("close:AvatarSelection");
      this.$emit("update:Avatar", newAvatarId);
    }
  },
};
</script>

<style scoped>
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.77);
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close {
  position: absolute;
  background-image: url("@/assets/elements/return.png");
  width: 94px;
  height: 64px;
  z-index: 10;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  left: 92%;
  top: 2%;
}
.selectArea {
  position: relative;
  height: 90%;
  overflow: auto;
  overflow-x: hidden;
  color: blanchedalmond;
  align-self: center;
  margin: auto;
}

.image{
  cursor: pointer;
}


.image:active {
  box-shadow: 0 3px rgba(0, 0, 0, 0.05);
  transform: translateY(3px);
}
</style>
