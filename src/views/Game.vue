<script setup>
    import playerData from '../data/players.json'
    import axios from 'axios';
</script>

<template>
    <div class="bg-image">
        <header class="table-wrapper ">
            <table>
                <tr>
                    <td v-for="player in players.filter(player=>player.id !== this.currentPlayer)" :key="player.id">
                       <button class="enemyChampions" :class="{usableClass:usable, notUsableClass:!usable}"  > {{ player.name }} </button>
                    </td>
                </tr>
            </table>
        </header>

        <button class="playerChampion">PlayerChampion</button>

        <div class="passivePosNegSlot">
            <div class="passiveSlot">
                <table>
                  <tr v-for="i in Math.ceil(passiveEffects.length/4)" :key="i">
                    <td v-for="passive in passiveEffects.slice((i-1)*4, i*4)" :key="passive.id"
                    @mouseenter="hoverStart(passive)"
                    @mouseleave="hoverEnd(passive)">
                      <div class="passiveSlotCircle">
                        <div class="passiveDescription" v-if="passive.showDescription">
                                {{ passive.description }}
                          </div>
                      </div>
                    </td>
                  </tr>
                </table>
            </div>

            <div class="equipmentSlot">
                <table>
                <tr v-for="equip in equipment" :key="equip.id"
                @mouseenter="hoverStart(equip)"
                @mouseleave="hoverEnd(equip)">
                
                    <td>
                        <div class="equipmentButton">
                            <p>{{ equip.id }}</p>
                            <p>{{ equip.name }}</p>
                            <div class="equipmentDescription" v-if="equip.showDescription">
                                {{ equip.description }}
                            </div>  
                        </div>
                    </td>
                </tr>
                </table>
            </div>
        </div>

        <div class="handCardSlot">
            <div v-for="(card,i) in cards" :key="i" 
                :class="[{'not-first-card': i !==0}, 'not-last-card']" 
                :style="{'margin-left': calculateMarginLeft(cards.length,i) }"
                @mouseenter="hoverStart(card)"
                @mouseleave="hoverEnd(card)">
                <div class="card" :class="{usableClass:card.usable, notUsableClass:!card.usable}"
                    @click="useCard(card)"
                    >
                    <p>{{ card.id }}</p>
                    <p>{{ card.name }}</p>
                    <div class="description"  v-if="card.showDescription">
                        {{ card.description }}
                    </div>
                </div>
            </div>
        </div>  


    <div class="cardUsed" v-if="cardUsed">
        <div class="discardPile">
            <p>{{ this.currentCard.id }}</p>
            <p>{{ this.currentCard.name }}</p>
            <p>{{ this.currentCard.description }}</p>
        </div>
        <div class="cardConditionRead" >    
            <button class="confirmB">Confirm</button>
            <button class="cancelB" @click="this.cardUsed=false">Cancel</button>
        </div>
    </div>
</div>
</template>



<script>
export default {
    data(){
        return{
            currentCard:Object,
            cardUsed:false,
            backgroundImage:'@/assets/backgrounds/game_background.png',
            players: playerData,
            currentPlayer: 0,
            timerDelay:1000,
            usable:true,
            passiveEffects:[
              {
                id:0,
                name:'Effekt 0',
                showDescription:false,
                description:"Description Effect 0",
              },
              {
                id:1,
                name:'Effekt 1',
                showDescription:false,
                description:"Description Effect 1",
              },
              {
                id:2,
                name:'Effekt 2',
                showDescription:false,
                description:"Description Effect 2",
              }
            ],
            equipment:[
                {
                    id:0,
                    name:'Trident of Poseidon',
                    showDescription:false,
                    description:'Description of Trident of Poseidon',
                },
                {
                    id:1,
                    name:'Spear of Ares',
                    showDescription:false,
                    description:'Description of Spear of Ares',
                },
                {
                    id:2,
                    name:'Shield of Athena',
                    showDescription:false,
                    description:'Description of Shield of Athena',
                },
            ],
            cards:[
        {
          id:0,
          name:'Attack',
          showDescription:false,
          description:'Description of Attack',
          usable: true,
        },
        {
          id:1,
          name:'Defense',
          showDescription:false,
          description:'Description of Defense',
          usable: false,
          
        },
        {
          id:2,
          name:'Attack',
          showDescription:false,
          description:'Description of Attack',
          usable: true,
        },
        {
          id:3,
          name:'Golden Apple',
          showDescription:false,
          description:'Description of Golden Apple',
          usable: true,
        }
      ]
        }
    },
    methods: {
        hoverStart(item) {
            this.hoverTimer = setTimeout(() => {
                item.showDescription = true
            }, this.timerDelay)
        },
        hoverEnd(item) {
            clearTimeout(this.hoverTimer)
            item.showDescription = false
        },
        calculateMarginLeft(length,i){
            if(i===0)
                return 0;
            let margin=0;
            if(length>=10)
                margin=9;
            else if(length>=8)
                margin=7;
            else if(length>=6)
                margin=5;
            else if(length>=4)
                margin=3;
            else if(length>=2)
                margin=1;
            else    
                margin=0;
            return `-${margin}rem`;
        },
        useCard(card){
            if(card.usable){
                this.cardUsed = true;
                this.currentCard = card;
            }
        }
}

}
</script>

<style scoped>

.cancelB{
    width: 7vw;
    height: 6vh;
    background-color: pink;
    position: absolute;
    left: 70vw;
    border-radius: 10px;
    bottom: 36vh;
}
.confirmB{
    width: 7vw;
    height: 6vh;
    background-color: pink;
    position: absolute;
    left: 60vw;
    border-radius: 10px;
    bottom: 36vh;
}

.discardPile{
    position: absolute;
    left:43.5vw;
    bottom:36vh;
    border-radius: 1rem;
    width: 13vw;
    height: 33vh;
    background-color: green;
}
.description {
  position: absolute;
  top: 1vw;
  right: -13.5vw;
  width: 13vw;
  height: 13vw;
  background-color: red;
}

.usableClass{
    border: solid yellow 5px;
}

.notUsableClass{
    border: solid black 5px;
}

.card {
  width: 13vw;
  height: 33vh;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 3px 3px 12px 2px rgba(black, 0.6);
  transition: 0.2s;
}
.not-first-card{
  margin-left: -3rem;
}
.not-last-card:hover,
.not-last-card:focus-within {
  transform: translateY(-1rem);
}
.not-last-card:focus-within ~ .card {
transform: translateX(2rem);
}

.handCardSlot{
  position: absolute;
  display: flex;
  border:solid red 5px;
  bottom:0;
  left:22vw;
  width: 61vw;
  height: 33vh;
}

.passiveSlot{
    left: 0;
    bottom:3vw;
    width: 18vw;
    height: 10vw;
    background-color: yellow;
}

.passiveSlotCircle{
    position: relative;
    background-color: purple;
    top:1vh;
    width: 4vw;
    height: 4vw;
    border-radius: 100%;
}

.passiveDescription{
    position: relative;
    top:-13vw;
    width: 18vw;
    height: 13vw;
    background-color: green;
    z-index: 3;
}

.equipmentSlot{
    position: absolute;
    display: flex;
    left: 0;
    bottom: 0;
    width: 18vw;
    height: 10vw;
    background-color: red;
}

.equipmentButton{
    width: 18vw;
    height: 3vw;
    background-color: forestgreen;
    transition: 0.2s;
}
.equipmentDescription{
    position: relative;
    top:-16vw;
    width: 18vw;
    height: 13vw;
    background-color: green;
    z-index: 3;
}



.equipmentSlot:hover + .overlayDescription{
      display:block;
}

.passivePosNegSlot{
    position: absolute;
    left:0;
    bottom:0;
    width: 18vw;
    height: 17vw;
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
    margin-left: 1vh;
    margin-right: 1vh;
    background-image: url("@/assets/champions/nyx.png");
    background-size:cover;
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