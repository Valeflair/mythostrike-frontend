<script setup>
    import playerData from '../data/players.json'
</script>

<template>
    <div class="bg-image">
        <header class="table-wrapper">
            <table>
                <tr>
                    <td v-for="player in players" :key="player.id">
                       <button class="enemyChampions"> {{ player.name }} </button>
                    </td>
                </tr>
            </table>
        </header>

        <button class="playerChampion">PlayerChampion</button>
        <div class="passivePosNegSlot">
            <div class="pasiveSlot"></div>
            <div class="equipmentSlot">sd </div>
            <div class="overlayDescription"></div>
        </div>
    </div>
</template>



<script>
export default {
    data(){
        return{
            backgroundImage:'@/assets/backgrounds/game_background.png',
            players: playerData,
        }
    }
}
</script>

<style scoped>

.equipmentSlot{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 18vw;
    height: 10vw;
    overflow: auto;
    background-color: red;
    z-index: 1;
}

.overlayDescription{
    z-index: 2;
    left: 0;
    bottom: 0;
    width: 30vw;
    height: 15vw;
    background-color: green;
    display:none;
}

.equipmentSlot:hover + .overlayDescription{
      display:block;
}

.passivePosNegSlot{
    position: absolute;
    left:0;
    bottom:0;
    width: 18vw;
    height: 15vw;
    background-color: white;
}

.playerChampion{
    position: absolute;
    right: 5px;
    bottom: 5px;
    width: 13vw;
    height: 17vw;
    background-color: black;
}


.table-wrapper {
    display: flex;
    justify-content: center;
}

.enemyChampions{
    width: 10vw;
    height: 13vw;
    background-color: gray;
    margin-left: 1vh;
    margin-right: 1vh;
}

header{
    background-color: red;
}

.bg-image {
  background: url("@/assets/backgrounds/game_background.png");
  height:100%;
  width: 100%;
}
</style>