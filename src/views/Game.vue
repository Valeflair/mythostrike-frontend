<script setup>
    import championCard from './ChampionCard.vue'
    import equipmentComponent from '../components/blockWithDescription.vue'
    import DelayedeffectComponent from '../components/DelayedeffectComponent.vue'
    import playerCard from './PlayerChampionCard.vue'
</script>

<template>
    <div class="bg-image">
        <header class="table-wrapper ">
            <table>
                <tr>
                    <td v-for="player in playerDaten.filter(player => player.username !== this.username)" :key="player.username">
                       <championCard class="playerChampions"
                       @click="pickPlayer(player.username,this.messageActivitysUsable.players)"
                        :class="{'usableClass':containsId(player.username,this.messageActivitysUsable.players)&&player.username!==this.currentPlayer
                                , 'actualPlayer':player.username === this.currentPlayer}" 
                        :isGame="true"
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
        <div class="logClass">
            <button class="logBtn" @click="logOpen = !logOpen"> Log</button>
            <div class="logTextArea" v-if="this.logOpen">{{logText}} </div>
        </div>

        <div class="player">
            <player-card :name="this.username" :health="this.findPlayer(this.username).health" :identity="this.findPlayer(this.username).identity"
            :messageActivitysUsable="this.messageActivitysUsable" :skillsProp="null" 
            @skillUsed="useSkill"/>
        </div>
        <div class="passivePosNegSlot">
            <div class="passiveSlot">
                <table>
                  <tr v-for="i in Math.ceil(passiveEffects.length/4)" :key="i">
                    <td v-for="(passive,j) in passiveEffects.slice((i-1)*4, i*4)" :key="passive.id"
                    @mouseenter="hoverStart(passive)"
                    @mouseleave="hoverEnd(passive)"
                    class="passiveCircle"
                     :style="{left: j*3.5 +'vw'}">
                      <delayedeffect-component :diameter="7" />
                    </td>
                  </tr>
                </table>
            </div>

            <div class="equipmentSlot">
                <table>
                <tr v-for="(equip,i) in equipment" :key="equip.id"
                @mouseenter="hoverStart(equip)"
                @mouseleave="hoverEnd(equip)">
                
                    <td>
                        <div class="equipment" :style="{bottom: 15-(i)*8+'vh'}">
                            <equipment-component widthProp="18" heightProp="6.5" name="MYEQUIPMENT" description="DESCRIPTION_EQUIPMENT" fontProp="2"/>
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


    <div class="drawPile" v-if="this.drawPile.length>0"> DRAWPILE</div>
    <div class="discardPile" v-if="this.discardPile.length>0">{{this.discardPile[this.discardPile.length-1]}}</div>


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
            logText:'Text', // der text für den log
            logOpen:false, // boolean der prüft ob der log geöffnet wurde oder nicht
            cardUsed:false, // wird genutzt um confirm und cancel button anzuzeigen wenn eine Karte verwendet wurde
            backgroundImage:'@/assets/backgrounds/game_background.png', // backgroundimage
            timerDelay:1000,// der delay für karten hover
            playerPicked:[], // ein Array das alle Spieler die ausgewählt wurde enthält
            tablePile:[], // der Stapel für die gerade ausgespielten Karten
            discardPile:[], // der AblegeStapel
            drawPile:[], // der Ziehstapel
            username:'Minh', // hält der Spieler immer bei sich
            currentPlayer:'Till', // bekommen wir von websocket
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
            },// Der champion von diesem Spieler. Wird über REST mit dem Spieler bereits mitgegeben. muss hier geändert werden
            messageActivitysUsable:{
                cardsId:[0,2,3],
                players:[],
                skillsID:[0,1],
                minCard:2,
                maxCard:2,
                minPlayer:0,
                maxPlayer:0,
                reason: 'Alles was der Spieler einsetzen kann: hier nur die Karten und skills mit den Ids',
            },// Highlightmessage wird simuliert 
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
                }
            ],// eine Liste aller Spieler mit ihren Infos. Wird verwendet um die Anzeige aller Spieler zu aktualisieren
            messageAttackCard:{ //alle messages sollen immer ein szenario darstellen um es aber hier wirklich zu nutzen überschreibe messageActivityUsable hierein
                cardsId:[],
                players:['Jack','Till'],
                skillsID:[],
                minCard:0,
                maxCard:0,
                minPlayer:1,
                maxPlayer:1,
                reason: 'Der Spieler hat eine Angriffskarte ausgespielt und kann nun Jack oder Till angreifen ',
            },// Highlightmessage wird simuliert
            messageDefendCard:{ //alle messages sollen immer ein szenario darstellen um es aber hier wirklich zu nutzen überschreibe messageActivityUsable hierein
                cardsId:[1],
                players:[],
                skillsID:[],
                minCard:0,
                maxCard:0,
                minPlayer:0,
                maxPlayer:0,
                reason: 'Der Spieler spielt eine Verteidigungskarte aus ',
            },//Highlightmessage wird simuliert 
            cardMoveMessage:{
                source:'Minh',
                destination:'discardPile',
                count:1,
                cardsId:[0,1],
            },// Cardmovemessage wird simuliert
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
            ],// die passiven effects die der Spieler drunter leidet. Bekommen wir von playerDaten
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
            ],// die equipments die der spieler hat. Bekommen wir von playerdaten.
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
            ]// DIe karten von diesen Spieler. Müssen gespeichert werden für jeden Spieler. Aber nur dessen id. Wir haben nnähmlich noch eine Liste bei der wir durch die Id die karte erhalten.
        }
    },
    components:{
        championCard,equipmentComponent,DelayedeffectComponent,playerCard
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
                        this.tablePile.push(this.cards[i].id);
                        console.log("table pile: "+this.tablePile);
                        break;
                    }
                }
            }
        },
        useSkill(skillId){
            console.log('erfolgreich skill eingesetzt '+skillId);
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
            //1. wir entfernen die Karten.

            //erst prüfen ob es eines der Stapeln ist
            if(this.cardMoveMessage.source === 'discardPile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++)
                    this.discardPile.pop();
            }else if(this.cardMoveMessage.source === 'drawPile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++)
                    this.drawPile.pop();
            }else if(this.cardMoveMessage.source === 'tablePile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++)
                    this.tablePile.pop();
            }
            //wenn es ein Stapel ist kann es kein Mensch sein. sonst nehmen wir die karten vom Menschen weg
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


            //2. wir fügen die Karte nun dahin wohin sie hingehört ein
            if(this.cardMoveMessage.destination === 'discardPile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++){
                    this.discardPile.push(this.cardMoveMessage.cardsId[i]);
                    console.log(this.discardPile);
                }
            }else if(this.cardMoveMessage.destination === 'drawPile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++)
                    this.drawPile.push(this.cardMoveMessage.cardsId[i]);
            }else if(this.cardMoveMessage.destination === 'tablePile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++)
                    this.tablePile.push(this.cardMoveMessage.cardsId[i]);
            }
        	
            for(let i=0;i<this.playerDaten.length;i++){
                if(this.cardMoveMessage.destination === this.playerDaten[i].username){
                    this.playerDaten[i].cardCount+=this.cardMoveMessage.count;
                    if(this.cardMoveMessage.destination === this.username){
                        for(let j=0;j<this.cardMoveMessage.cardsId.length;j++){
                            this.cards.push(this.cardMoveMessage.cardsId[j]);
                        }
                    }
                }
            }
            
        },
        /*sucht die Karte mit der bestimmten id */
        getCard(id){
            for(let i=0;i<this.cards.length;i++){
                if(this.cards[i].id === id)
                    return this.cards[i];
            }
        },
        findPlayer(id){
            for(let i=0;i<this.playerDaten.length;i++){
                if(id===this.playerDaten[i].username)
                    return this.playerDaten[i];
            }
            return null;
        }
    
    
    }
}


</script>

<style scoped>
.player{
    position: absolute;
    bottom: 5px;
    right: 5px;
}

.actualPlayer{
    border: solid red 5px;
}

.logBtn{
    position: absolute;
    right: 0;
    width: 5vw;
    height: 5vh;
    background-color: green;
    
}

.logTextArea{
    position: relative;
    width: 15vw;
    right: 0;
    top:5vh;
    height: 40vh;
    background-color: blue;
   overflow-y: scroll;
    word-wrap: break-word;
}

.logClass{
    width: 15vw;
    height: 45vh;
    position: absolute;
    right:0;
    top:0;
    overflow: auto;
}


.table-wrapper {
    display: flex;
    justify-content: center;
    width: 90vw;
}

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
    bottom:10vw;
    width: 5vw;
    height: 5vh;
    background-color: red;
    cursor: pointer;
}

.drawPile{
    position: absolute;
    left:1vw;
    bottom:32vh;
    border-radius: 1rem;
  width: 10vw;
  height: 29vh;
    background-color: green;
}
.discardPile{
    position: absolute;
    left:13vw;
    bottom:32vh;
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
    width: 11.5vw;
    height: 35vh;
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
    height: 5vw;
    background-color: yellow;
    overflow:auto;
}

.passiveCircle{
    position: absolute;
    background-color: purple;
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
    height: 15vh;
}
.equipment{
    position: absolute;
    left: 0;
    
  line-height: 350%;
}
.equipmentButton{
    width: 18vw;
    height: 6.5vh;
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
}




.bg-image {
  background: url("@/assets/backgrounds/game_background.png");
  height:100%;
  width: 100%;
}
</style>