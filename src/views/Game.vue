<script setup>
    import championCard from './ChampionCard.vue'
</script>

<template>
    <div class="bg-image">
        <header class="table-wrapper ">
            <table>
                <tr>
                    <td v-for="player in playerDaten.filter(player => player.username !== this.username)" :key="player.username">
                       <championCard class="playerChampions"
                       @click="pickPlayer(player.username,this.messageActivitysUsable.players)"
                        :class="{'usableClass':containsId(player.username,this.messageActivitysUsable.players)}" 
                        game="true"
                        :name="player.username"
                        :handcardNum="player.cardCount"
                        :identity="player.identity"
                        :equipment="player.equipment" 
                        :passiveEffect="player.passiveEffect"
                        />
                       
                       
                        <div class="cardOverlay" v-if="containsId(player.username,this.playerPicked)"></div>
                       
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
            <div class="cardContainer">
            <div v-for="(card,i) in cards" :key="i" 
                :class="[{'not-first-card': i !==0}, 'not-last-card']" 
                :style="{'margin-left': calculateMarginLeft(cards.length,i) }"
                @mouseenter="hoverStart(card)"
                @mouseleave="hoverEnd(card)">
                <div class="handCard" 
                :class="{'usableClass':containsId(card.id,this.messageActivitysUsable.cardsId),
                        'notUsableClass':!containsId(card.id,this.messageActivitysUsable.cardsId)}"
                    @click="useCard(card.id,this.messageActivitysUsable.cardsId)"
                    
                    >
                    <p>{{ card.id }}</p>
                    <p>{{ card.name }}</p>
                    <div class="description"  v-if="card.showDescription">
                        {{ card.description }}
                    </div>
                    <div class="cardOverlay" v-if="containsId(card.id,this.tablePile)"></div>
                </div>
            </div>
            </div>
        </div>  

        <div class="tablePileSlot" v-if="cardUsed">
            <div class="tableContainer">
                <!--

                    FEHLER this.cards[card] gibt fehler  -> erstelle methode die karte findet mit richtige id 



                -->
            <div v-for="(card,i) in this.tablePile" :key="i" 
                :class="[{'not-first-card': i !==0}, 'not-last-card']" 
                :style="{'margin-left': calculateMarginLeft(this.tablePile.length,i) }"
                @mouseenter="hoverStart(getCard(card))"
                @mouseleave="hoverEnd(getCard(card))">
                <div class="tablePile">
                    <p>{{ getCard(card).id }}</p>
                    <p>{{ getCard(card).name }}</p>
                    <div class="description"  v-if="getCard(card).showDescription">
                        {{ getCard(card).description }}
                    </div>
                    <div class="cardOverlay" v-if="containsId(card,this.tablePile)"></div>
                </div>
            </div>            
            </div>

            <div class="confirmB"  :class="{'usableClass':checkConfirmStatus(),'notUsableClass':!checkConfirmStatus()}">
                <p>Confirm</p>
            </div>
            <button class="cancelB" @click="cancel">Cancel</button>
        </div>  


    <div class="drawPile"> DRAWPILE</div>


    <div class="information">
        <p>MinCard: {{this.messageActivitysUsable.minCard}}</p>
        <p>MaxCard: {{this.messageActivitysUsable.maxCard}}</p>
        <p>minPlayer: {{this.messageActivitysUsable.minPlayer}}</p>
        <p>maxPlayer: {{this.messageActivitysUsable.maxPlayer}}</p>
        <p>reason: {{this.messageActivitysUsable.reason}} </p>
    </div>
    
    
    <!-- Ab hier ist ein biscchen komisch. wir machen hier  cardmovemessage. Normalerweise aber in update aber hier ka deshalb erstmal ein div wo es simuliert wird-->
    <div class="clickCardMoveMessage" @click="updateCardMoveMessage"> Click me</div>

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
            playerPicked:[],
            tablePile:[],
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
                    equipment: ['Trident of Poseidon'],
                    passiveEffect:['nightmare','drought'],
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
                    equipment: ['shield of Athena'],
                    passiveEffect:['nightmare'],
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
                    equipment: ['Spear of Ares'],
                    passiveEffect:[],
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
                    equipment: ['Trident of Poseidon','Hourglass'],
                    passiveEffect:['nightmare','drought'],
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
                    equipment: [],
                    passiveEffect:['nightmare','drought'],
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
            cardMoveMessage:{
                source:'Minh',
                destination:'Till',
                count:1,
                cardsId:[0],
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
    components:{
        championCard,
    },
    methods: {
        
        //wenn maus über das item hovert
        hoverStart(item) {
            this.hoverTimer = setTimeout(() => {
                item.showDescription = true
            }, this.timerDelay)
        },
        //wenn maus nicht mehr das item hovert
        hoverEnd(item) {
            clearTimeout(this.hoverTimer)
            item.showDescription = false
        },
        //die Abstände der Karten auf der Hand. Je mehr Karten, desto näher werden diese
        calculateMarginLeft(length,i){
            if(i===0)
                return 0;
            let margin=0;
            if(length>=10)
                margin=7;
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
        //methode bekommt eine art id und ein array und prüft ob die id im array drinn ist
        //wird verwendet um strings und nummern zu prüfen
        containsId(id, searchArray){
            for(let i=0;i<searchArray.length;i++){
                if(searchArray[i] === id) return true;
            }
            return false;
        },
        //wenn der cancel button gedrückt wird
        cancel(){
            this.cardUsed=false;

            this.tablePile.splice(0, this.tablePile.length);
            this.playerPicked.splice(0,this.playerPicked.length);

        },
        //wenn der Spieler auf eine Karte drückt
        useCard(id, searchArray){
            let count=this.tablePile.length;
            console.log("useCard: "+id);
            if(this.containsId(id,searchArray) && count <this.messageActivitysUsable.maxCard && !this.containsId(id,this.tablePile)){
                for(let i=0;i<this.cards.length;i++){
                    if(this.cards[i].id === id){
                        console.log(this.cards[i].id);
                        this.cardUsed=true;
                        this.cards[i].used =true;
                        this.currentCard = this.cards[i];    
                        this.tablePile.push(this.cards[i].id);
                        console.log("table pile: "+this.tablePile);
                        break;
                    }
                }
            }

        },
        //wenn der Spieler auf einen Spieler drückt
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
        //prüft ob alle Bedingungen erreicht sind um den confirm button zu drücken.
        //Z.B. ob mindestens ein Spieler ausgewählt wurde beim Angriff.
        checkConfirmStatus(){
            if(this.playerPicked.length<this.messageActivitysUsable.minPlayer || 
                this.tablePile.length<this.messageActivitysUsable.minCard)
                return false;
            return true;
        },
        //Eine Methode die verwendet wird um das bewegen eine karte zu simulieren eigentlich in lifecyclehook update
        //
        updateCardMoveMessage(){
            

            for(let i=0;i<this.playerDaten.length;i++){
                if(this.playerDaten[i].username === this.cardMoveMessage.source){
                    this.playerDaten[i].cardCount-=this.cardMoveMessage.count;
                    if(this.cardMoveMessage.source === this.username){
                        for(let j=0;j<this.cardMoveMessage.cardsId.length;j++){
                            this.cards = this.cards.filter(card => card.id !== this.cardMoveMessage.cardsId[j]);
                        }
                    }
                }
            }
            var humanDestination=false;
            for(let i=0;i<this.playerDaten.length;i++){
                if(this.cardMoveMessage.destination === this.playerDaten[i].username){
                    humanDestination=true;
                    this.playerDaten[i].cardCount+=this.cardMoveMessage.count;
                    if(this.cardMoveMessage.destination === this.username){
                        for(let j=0;j<this.cardMoveMessage.cardsId.length;j++){
                            this.cards.push(this.cardMoveMessage.cardsId[j]);
                        }
                    }
                }
            }
            console.log(this.cards);
            
        },

        getCard(id){
            for(let i=0;i<this.cards.length;i++){
                if(this.cards[i].id === id)
                    return this.cards[i];
            }
        }
    
    
    }
}


</script>

<style scoped>


.tablePile{
  width: 10vw;
  height: 29vh;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 3px 3px 12px 2px rgba(black, 0.6);
  transition: 0.2s;
  border: solid black 2px;
}

.cardContainer{
    
    position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.tableContainer{
    position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.tablePileSlot{
    
  position: absolute;
  display: flex;
  bottom:32vh;
  left:25vw;
  width: 50vw;
  height: 29vh;
  border: solid green 5px;
}
.clickCardMoveMessage{
    position: absolute;
    left: 19vw;
    bottom:18vw;
    width: 5vw;
    height: 5vh;
    background-color: red;
    cursor: pointer;
}

.drawPile{
    position: absolute;
    left:1vw;
    bottom:18vw;
    border-radius: 1rem;
  width: 10vw;
  height: 29vh;
    background-color: green;
}


.playerChampions{
  width: 10vw;
  height: 29vh;
    margin-left: 1vh;
    margin-right: 1vh;
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
    left: 50vw;
    border-radius: 10px;
    bottom: 0;
}
.confirmB{
    width: 7vw;
    height: 6vh;
    background-color: pink;
    position: absolute;
    left: 50vw;
    border-radius: 10px;
    bottom: 8vh;
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

.handCard {
  width: 10vw;
  height: 29vh;
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
  height: 29vh;
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
    height: 7vw;
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
    height: 13vw;
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