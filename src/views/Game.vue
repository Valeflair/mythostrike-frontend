<script setup>
    import playerData from '../data/players.json'
    import axios from 'axios';
</script>

<template>
    <div class="bg-image">
        <header class="table-wrapper ">
            <table>
                <tr>
                    <td v-for="player in playerDaten.filter(player => player.username !== this.username)" :key="player.username">
                       <div class="playerChampions" 
                        @click="pickPlayer(player.username,this.messageActivitysUsable.players)"
                        :class="{'usableClass':containsId(player.username,this.messageActivitysUsable.players), notUsableClass:!containsId(player.username,this.messageActivitysUsable.players)}">
                        <div> <h2> {{ player.username }}</h2> </div> 
                        <div>CurrentHP: {{player.currentHP}} </div>
                        <p>Champion: {{player.champion.name}}</p>
                        <div>CardCount: {{player.cardCount}} </div>
                        <div>Identity: {{player.identity}} </div>
                        <div class="cardOverlay" v-if="containsId(player.username,this.playerPicked)"></div>
                       </div>
                    </td>
                </tr>
            </table>
        </header>

        <div class="playerChampion">
            <div class="skillContainer">
                <table>
                <tr v-for="passive in this.champion.passiveSkills" :key="passive.id"
                @mouseenter="hoverStart(passive)"
                @mouseleave="hoverEnd(passive)">
                    <td>
                        <div class="skill"
                        :class="{'usableClass':containsId(passive.id,this.messageActivitysUsable.skillsID), notUsableClass:!containsId(passive.id,this.messageActivitysUsable.skillsID)}">
                            <p>{{ passive.name }}</p>
                            <div class="skillDescription" v-if="passive.showDescription">
                            {{ passive.description }}
                            </div>  
                        </div>
                    </td>
                </tr>
                <tr v-for="active in this.champion.activeSkills" :key="active.id"
                @mouseenter="hoverStart(active)"
                @mouseleave="hoverEnd(active)">
                    <td>
                        <div class="skill"
                        :class="{'usableClass':containsId(active.id,this.messageActivitysUsable.skillsID), notUsableClass:!containsId(active.id,this.messageActivitysUsable.skillsID)}">
                            <p>{{ active.name }}</p>
                            <div class="skillDescription" v-if="active.showDescription">
                                {{ active.description }}
                            </div>  
                        </div>
                    </td>
                </tr>
                </table>
                <Card :name='Till' :health="3" :identity="BLAU" />
        </div>
        </div>

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
                <div class="card" 
                :class="{'usableClass':containsId(card.id,this.messageActivitysUsable.cardsId),
                        'notUsableClass':!containsId(card.id,this.messageActivitysUsable.cardsId)}"
                    @click="useCard(card.id,this.messageActivitysUsable.cardsId)"
                    
                    >
                    <p>{{ card.id }}</p>
                    <p>{{ card.name }}</p>
                    <div class="description"  v-if="card.showDescription">
                        {{ card.description }}
                    </div>
                    <div class="cardOverlay" v-if="containsId(card.id,this.cardsBeingUsed)"></div>
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
            <div class="confirmB"  :class="{'usableClass':checkConfirmStatus(),'notUsableClass':!checkConfirmStatus()}">
                <p>Confirm</p>
            </div>
            <button class="cancelB" @click="cancel">Cancel</button>
        </div>
    </div>

    <div class="information">
        <p>MinCard: {{this.messageActivitysUsable.minCard}}</p>
        <p>MaxCard: {{this.messageActivitysUsable.maxCard}}</p>
        <p>minPlayer: {{this.messageActivitysUsable.minPlayer}}</p>
        <p>maxPlayer: {{this.messageActivitysUsable.maxPlayer}}</p>
        <p>reason: {{this.messageActivitysUsable.reason}} </p>
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
            currentPlayer: 0,
            timerDelay:1000,
            usable:true,
            cardsBeingUsed:[],
            playerPicked:[],
            username:'Minh',
            champion:{
                name:'Nyx',
                description:'Description of Nyx',
                passiveSkills:[
                    {
                        id:2,
                        name:'night scent',
                        description:'Description of night scent',
                        showDescription:false,
                    },
                    {
                        id:5,
                        name:'night eyes',
                        description:'Description of night eyes',
                        showDescription:false,
                    },
                ],
                activeSkills:[
                    {
                        id:1,
                        name:'night howl',
                        description:'Description of night howl',
                        showDescription:false,
                    },
                    {
                        id:3,
                        name:'night attack',
                        description:'Description of night attack',
                        showDescription:false,
                    },
                ]
            },
            messageActivitysUsable:{
                cardsId:[0,2,3],
                players:[],
                skillsID:[0,1],
                minCard:2,
                maxCard:2,
                minPlayer:0,
                maxPlayer:0,
                reason: 'Alles was der Spieler einsetzen kann: hier nur die Karten und skills mit den Ids',
            },
            playerDaten:[
                {
                    username: 'Minh',
                    cardCount: 4,
                    isAlive: true,
                    champion:{
                        name: 'VirusByus',
                    } ,
                    maxHP: 5,
                    currentHP: 5,
                    identity: 'TEAM_INDEPENDENT',
                },
                {
                    username: 'Till',
                    cardCount: 2,
                    isAlive: true,
                    champion:{
                        name: 'Ares',
                    } ,
                    maxHP: 4,
                    currentHP: 2,
                    identity: 'TEAM_BLUE',
                },
                {
                    username: 'Jack',
                    cardCount: 2,
                    isAlive: true,
                    champion:{
                        name: 'Poseidon',
                    } ,
                    maxHP: 3,
                    currentHP: 2,
                    identity: 'TEAM_BLUE',
                },
                {
                    username: 'Hong',
                    cardCount: 3,
                    isAlive: true,
                    champion:{
                        name: 'Athena',
                    } ,
                    maxHP: 4,
                    currentHP: 4,
                    identity: 'TEAM_RED',
                },
                {
                    username: 'Laito',
                    cardCount: 3,
                    isAlive: true,
                    champion:{
                        name: 'Urania',
                    } ,
                    maxHP: 5,
                    currentHP: 3,
                    identity: 'TEAM_RED',
                },
            ],

            messageAttackCard:{ //alle messages sollen immer ein szenario darstellen um es aber hier wirklich zu nutzen überschreibe messageActivityUsable hierein
                cardsId:[],
                players:['Jack','Till'],
                skillsID:[],
                minCard:0,
                maxCard:0,
                minPlayer:1,
                maxPlayer:1,
                reason: 'Der Spieler hat eine Angriffskarte ausgespielt und kann nun Jack oder Till angreifen ',
            },
            messageDefendCard:{ //alle messages sollen immer ein szenario darstellen um es aber hier wirklich zu nutzen überschreibe messageActivityUsable hierein
                cardsId:[1],
                players:[],
                skillsID:[],
                minCard:0,
                maxCard:0,
                minPlayer:0,
                maxPlayer:0,
                reason: 'Der Spieler spielt eine Verteidigungskarte aus ',
            },
            cardMoveMessage1:{
                
            },

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
          used: false,
        },
        {
          id:1,
          name:'Defense',
          showDescription:false,
          description:'Description of Defense',
          used: false,
          
        },
        {
          id:2,
          name:'Attack',
          showDescription:false,
          description:'Description of Attack',
          used: false,
        },
        {
          id:3,
          name:'Golden Apple',
          showDescription:false,
          description:'Description of Golden Apple',
          used: false,
        }
      ]
        }
    },
    computed:{

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
        containsId(id, searchArray){
            for(let i=0;i<searchArray.length;i++){
                if(searchArray[i] === id) return true;
            }
            return false;
        },
        cancel(){
            this.cardUsed=false;

            this.cardsBeingUsed.splice(0, this.cardsBeingUsed.length);
            this.playerPicked.splice(0,this.playerPicked.length);

        },
        useCard(id, searchArray){
            let count=this.cardsBeingUsed.length;

            if(this.containsId(id,searchArray) && count <this.messageActivitysUsable.maxCard && !this.containsId(id,this.cardsBeingUsed)){
                for(let i=0;i<this.cards.length;i++){
                    if(this.cards[i].id === id){
                        this.cardUsed=true;
                        this.cards[i].used =true;
                        this.currentCard = this.cards[i];    
                        this.cardsBeingUsed.push(this.cards[i].id);
                        break;
                    }
                }
            }

        },
        pickPlayer(name,searchArray){
            
            let count=this.playerPicked.length;

            if(this.containsId(name,searchArray) && count < this.messageActivitysUsable.maxPlayer && !this.containsId(id,this.playerPicked)){
                for(let i=0;i<searchArray.length;i++){
                    if(name === searchArray[i]){
                        this.playerPicked.push(name);
                        break;
                    }
                }
            }
        },
        checkConfirmStatus(){
            console.log("cardsused: "+this.cardsBeingUsed.length);
            console.log("minCard: "+this.messageActivitysUsable.minCard);
            if(this.playerPicked.length<this.messageActivitysUsable.minPlayer || 
                this.cardsBeingUsed.length<this.messageActivitysUsable.minCard)
                return false;
            return true;
        }
        }
}


</script>

<style scoped>



.playerChampions{
    width: 10vw;
    height: 13vw;
    margin-left: 1vh;
    margin-right: 1vh;
    background-image: url("@/assets/champions/nyx.png");
    background-size:cover;
}


.cardOverlay{
    width: 4vw;
    height: 4vw;
    background-color: red;
}

.information{
    background-color: rgb(54, 164, 215);
    height: 22vh;
    width: 10vw;
    position: absolute;
    right:5px;
    bottom:18vw;
}

.information p{
    border: solid yellow 1px;
}

.playerChampion{
    position: absolute;
    right: 5px;
    bottom: 5px;
    width: 13vw;
    height: 17vw;
    background-color: grey;
}

.skillContainer{  
    position: absolute;
    display: flex;
    right: 0;
    bottom:1vh;
}

.skill{
    border-radius: 0.5rem ;
    transition: 0.2s;
    width: 13vw;
    left:5px;
    margin-bottom: 1vh;
    text-align: center;
    height: 5vh;
    align-self: center;
    border: 2px solid red;
}
.skillDescription{
      position: relative;
    top:-6.5vw;
    width: 13vw;
    height: 5vw;
    background-color: green;
    z-index: 3;
}

.skill:hover + .skillDescription{
    display:block;
}


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
    cursor: pointer;
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
    background-color: green;
    border-radius: 1rem ;
    transition: 0.2s;
}
.equipmentDescription{
    position: relative;
    top:-15.5vw;
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

.table-wrapper {
    display: flex;
    justify-content: center;
}



.bg-image {
  background: url("@/assets/backgrounds/game_background.png");
  height:100%;
  width: 100%;
}
</style>