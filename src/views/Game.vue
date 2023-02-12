<script setup>
    import championCard from './ChampionCard.vue'
    import equipmentComponent from '../components/blockWithDescription.vue'
    import DelayedeffectComponent from '../components/DelayedeffectComponent.vue'
    import playerCard from './PlayerChampionCard.vue'
    import resultPage from '../components/Statement.vue'
    import playCard from './PlayCard.vue'
    import { useGameStore } from "@/stores/game";
    import gameService from "@/services/gameServices";

</script>

<template>
    <div class="bg-image">
        <!-----------------------------------------------DIE ANDEREN SPIELER--------------------------------------------------------->
        <header class="table-wrapper ">
            <table>
                <tr>
                    <td v-for="player in playerDaten.filter(player => player.username !== this.username)" :key="player.username">
                       <championCard class="playerChampions"
                       @click="pickPlayer(player.username,this.messageActivitysUsable.players)"
                        :class="{ 'actualPlayer':player.username === this.currentPlayer}" 
                        :usable="containsId(player.username,this.messageActivitysUsable.players)"
                        :isGame="true"
                        :name="player.username"
                        :handcardNum="player.cardCount"
                        :identity="player.identity"
                        :equipment="player.equipment" 
                        :passiveEffect="player.passiveEffect"
                        />
                    </td>
                </tr>
            </table>
        </header>       
    
    <!-----------------------------------------------DIE SPIELERGEBNISSE--------------------------------------------------------->
        
    <result-page v-if="this.playerSummarize.length!==0" :users = "this.playerSummarize" class="playerSummarizeStyle" />

    
    <!-----------------------------------------------DER LOGBUTTON--------------------------------------------------------->
    
        <div class="logClass">
            <button class="logBtn btn" @click="logOpen = !logOpen"><span>Log</span></button>
            <div class="logTextArea" v-if="this.logOpen">{{logText}} </div>
        </div>
    
    <!-----------------------------------------------DER SPIELER --------------------------------------------------------->
    
        <div class="player">
            <player-card :name="this.username" :health="this.findPlayer(this.username).health" :identity="this.findPlayer(this.username).identity"
            :messageActivitysUsable="this.messageActivitysUsable" :skillsProp="null" 
            :class="{'actualPlayer':this.username === this.currentPlayer}"
            
            @skillUsed="useSkill"/>
        </div>

    <!-----------------------------------------------DIE DELAYED EFFEKTE & EQUIPMENT--------------------------------------------------------->
        
        <div class="passivePosNegSlot">
            <div class="passiveSlot">
                <table>
                  <tr >
                    <td v-for="(passive,j) in playerDelayedEffect" :key="passive.id"
                    class="passiveCircle"
                     :style="{left: j*3.5 +'vw'}">
                      <delayedeffect-component :diameter="7" />
                    </td>
                  </tr>
                </table>
            </div>

            <div class="equipmentSlot">
                <table>
                <tr v-for="(equip,i) in playerEquipment" :key="equip.id">
                
                    <td>
                        <div class="equipment" :style="{bottom: 15-(i)*8+'vh'}">
                            <equipment-component widthProp="18" heightProp="6.5" :name="getCard(equip).name" :description="getCard(equip).description" fontProp="2"/>
                        </div>
                    </td>
                </tr>
                </table>
            </div>
        </div>
    
    <!-----------------------------------------------DIE HANDKARTEN--------------------------------------------------------->
    
        <div class="handCardSlot">
            <div class="cardContainer">
            <div v-for="(card,i) in this.playerCards" :key="i" 
                :class="[{'not-first-card': i !==0}, 'not-last-card']" 
                :style="{'margin-left': calculateMarginLeft(this.playerCards.length,i) }"
                @mouseenter="hoverStart(getCard(card))"
                @mouseleave="hoverEnd(getCard(card))">
                <play-card class="playCard" :class="{'cardUsedStyle':containsId(card,this.cardsPicked)}"
                :usable="containsId(card,this.messageActivitysUsable.cardsId)"
                    @click="useCard(card,this.messageActivitysUsable.cardsId)"
                    :name="getCard(card).name"
                    :description="getCard(card).description"
                    :identity=null
                    :symbol="getCard(card).symbol"
                    :value="getCard(card).value"
                />
            </div>
            </div>
        </div>  
    
    <!-----------------DIE KARTEN AUF DEM TISCH UND DER CONFIRM/CANCEL BUTTON--------------------------------------------------------->

        <div class="tablePileSlot" >
            <div class="tableContainer">
            <div v-for="(entry,i) in this.tablePile" :key="i" 
                :class="[{'not-first-card': i !==0}, 'not-last-card']" 
                :style="{'margin-left': calculateMarginLeft(this.tablePile.length,i) }"
                @mouseenter="hoverStart(getCard(entry.cardId))"
                @mouseleave="hoverEnd(getCard(entry.cardId))">
                <play-card class="playCard"  
                :name="getCard(entry.cardId).name" 
                :description="getCard(entry.cardId).description" 
                :usable="false"  
                :identity="entry.playerName"
                :symbol="getCard(entry.cardId).symbol"
                :value="getCard(entry.cardId).value"/>
            </div>            
            </div>

            <div v-if="cardUsed" class="confirmB" @click="confirm()"  :class="{'usableClass':checkConfirmStatus(),'notUsableClass':!checkConfirmStatus()}">
                <p>Confirm</p>
            </div>
            <button v-if="cardUsed" class="cancelB" @click="cancel()">Cancel</button>
        </div>  

    <!-----------------------------------------------DER ZIEHSTAPEL--------------------------------------------------------->    

    <div class="drawPile" v-if="this.drawPile.length>0" ></div>

    <!-----------------------------------------------DER ABLEGESTAPEL--------------------------------------------------------->    

    <div class="discardPile" v-if="this.discardPile.length>0">
        <play-card :name="getCard(this.discardPile[this.discardPile.length-1]).name" 
        :description="getCard(this.discardPile[this.discardPile.length-1]).description" 
        :identity="null"
        :symbol="getCard(this.discardPile[this.discardPile.length-1]).symbol"
        :value="getCard(this.discardPile[this.discardPile.length-1]).value" />
        <div class="discardPileOverlay"></div>
    </div>

    <!----------------------------------------DER BUTTON DER DIE RUNDE BEENDET----------------------------------------------->    

    <button class="endTurn" @click="endTurn()" v-if="this.username===this.currentPlayer">End Turn</button>    
    
    <!----------------------------------------Der Alarm der den Spieler einen tippt gibt was er machen soll----------------------------------------------->    

    <transition name="notice-Animation">
        <div class="notice-message" v-if="showNotice">{{ this.notice }} </div>
    </transition>
  
    <!----------------------------------------DER TIMER----------------------------------------------->    

    <div class="progress-container">
      <progress ref="progress" value="100" max="100">75%</progress>
    </div>
    <button class="start-Progressbar" @click="startProgressbar">START</button>
    <button class="interrupt-Progressbar" @click="pause">PAUSE/RESUME</button>
    <!-- Ab hier ist ein biscchen komisch. wir machen hier  cardmovemessage. Normalerweise aber in update aber hier ka deshalb erstmal ein div wo es simuliert wird-->
    <div class="clickCardMoveMessage" @click="updateCardMoveMessage"> Click me</div>

</div>
</template>

<script>
export default {
    setup(){
        const gameStore = useGameStore();
        const userStore = useUserStore();
        return {gameStore,userStore};
    },
    data(){
        return{
            paused:false,
            animation: null,
            notice:'Please pick a Card or a Skill',
            showNotice:false,
            status:false, //boolean um zu prüfen ob erst eine private websocket gesendet wurde falls ja wird es auf true gesetzt und der nächste public websocket wird ignoriert -> wird gebraucht für cardmovemessage
            cardUsed:false, // wird genutzt um confirm und cancel button anzuzeigen wenn eine Karte verwendet wurde
            lobbyId:5455,   //die LobbyId vom game wird mitgegeben
            logText:'Text', // der text für den log
            logOpen:false, // boolean der prüft ob der log geöffnet wurde oder nicht
            backgroundImage:'@/assets/backgrounds/game_background.png', // backgroundimage
            timerDelay:1000,// der delay für karten hover
            //player Daten die fest sind
            username:'Minh', // hält der Spieler immer bei sich
            currentPlayer:'Minh', // bekommen wir von websocket
            identity:'Godking', // die Identität vom Spieler wird von championSelect mitgegeben
            champion:Object, // der Champion vom Spieler
            //Informationen die sich ändern können vom Spieler. Karten auf der Hand/Equipment/DelayedEffekt
            playerCards:[0,1,2,3], //die Karten vom Spieler
            playerEquipment:[1],// das Equipment vom Spieler
            playerDelayedEffect:[0,1], // die delayed Effekte vom Spieler
             //auswahl der Karten / Players
            cardsPicked:[], // die Karten die der Spieler ausgewählt hat
            playerPicked:[], // ein Array das alle Spieler die ausgewählt wurde enthält
            //Stapel an Karten
            tablePile:[], // der Stapel für die gerade ausgespielten Karten
            discardPile:[1], // der AblegeStapel
            drawPile:[1,0], // der Ziehstapel
           //Schnittstellen websocket
            playerSummarize:[
                // {
                //     username:'Minh',
                //     identity:'Independent',
                //     drachma: 320,
                //     rankPoints: 60,
                //     hasWon: false,
                // },
                // {
                //     username:'Laito',
                //     identity:'Independent',
                //     drachma: 400,
                //     rankPoints: 1000,
                //     hasWon: true,
                // },
                // {
                //     username:'Jack',
                //     identity:'BLUE',
                //     drachma: 10,
                //     rankPoints: 160,
                //     hasWon: false,
                // },
                // {
                //     username:'Till',
                //     identity:'BLUE',
                //     drachma: 150,
                //     rankPoints: 30,
                //     hasWon: false,
                // },
                // {
                //     username:'Hong',
                //     identity:'RED',
                //     drachma: 200,
                //     rankPoints: 100,
                //     hasWon: true,
                // },

            ],// die Schnittstelle für die Ergebnisse
            messageActivitysUsable:{
                cardsId:[0,2,3],
                players:['Till','Jack'],
                skillsID:[0,1],
                minCard:2,
                maxCard:2,
                minPlayer:0,
                maxPlayer:0,
                needsConfirm:true,
                reason: 'Alles was der Spieler einsetzen kann: hier nur die Karten und skills mit den Ids',
            },// die Schnittstelle für Highlightmessage
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
            ],// die Schnittstelle um die Daten aller Spieler zu aktualisieren
            cardMoveMessage:{
                source:'Till',
                destination:'tablePile',
                count:1,
                cardsId:[0,2],
            },// die Schnittstelle um eine Karte zu bewegen
            cards:[
                {
                id:0,
                name:'Attack',
                showDescription:false,
                description:'Description of Attack',
                used: false,
                symbol:'diamond',
                value:5,
                },
                {
                id:1,
                name:'Defense',
                showDescription:false,
                description:'Description of Defense',
                used: false,
                symbol:'heart',
                value:2,
                },
                {
                id:2,
                name:'Attack',
                showDescription:false,
                description:'Description of Attack',
                used: false,
                symbol:'spade',
                value:10,
                },
                {
                id:3,
                name:'Golden Apple',
                showDescription:false,
                description:'Description of Golden Apple',
                used: false,
                symbol:'club',
                value:8,
                }
            ]// Alle Karten
        }
    },
    components:{
        championCard,equipmentComponent,DelayedeffectComponent,playerCard,resultPage,playCard
    },
    methods: {
        startProgressbar() {
      this.animation = this.$refs.progress.animate([
        { width: '100%' },
        { width: '0%' }
      ], {
        duration: 3000,
        easing: 'ease-in',
        fill: 'forwards'
      });
      this.animation.onfinish = () => {
        this.endTurn();
      };
      this.$refs.progress.style.animation = 'progress-animation 20s ease-in forwards';
    },

        //--------------------------------- AXIOS ----------------------------------------------------
         //wenn der Spieler auf eine Karte drückt
         async useCard(id, searchArray){
            let count=this.cardsPicked.length;
            if(this.containsId(id,this.cardsPicked)){
                this.cardsPicked = this.cardsPicked.filter(card=> card!==id);
                if(this.cardsPicked.length<this.messageActivitysUsable.minCard)
                    this.cardUsed=false;
            }else if(this.containsId(id,searchArray) && count <this.messageActivitysUsable.maxCard && !this.containsId(id,this.cardsPicked)){
                for(let i=0;i<this.playerCards.length;i++){
                    if(this.playerCards[i] === id){
                        this.cardsPicked.push(id);
                        if(this.cardsPicked.length>=this.messageActivitysUsable.minCard)
                            this.cardUsed = true;
                        break;
                    }
                }
            }
            if(count >= this.messageActivitysUsable.minCard && count <=this.messageActivityUsable.maxCard && !this.messageActivitysUsable.needsConfirm){
            await gameService.useCard(this.lobbyId,this.cardsPicked).then(
                (response)=>{
                    console.log(response);
                },
                (error)=>{
                    console.log(error);
                }
            )
            }
        },
        //wenn der Spieler auf einen Spieler drückt
        async pickPlayer(name,searchArray){          
            let count=this.playerPicked.length;
            if(this.containsId(name,searchArray) && count < this.messageActivitysUsable.maxPlayer && !this.containsId(id,this.playerPicked)){
                for(let i=0;i<searchArray.length;i++){
                    if(name === searchArray[i]){
                        this.playerPicked.push(name);
                        break;
                    }
                }
            }

            if(count >= this.messageActivitysUsable.minPlayer && count <=this.messageActivityUsable.maxPlayer){
            await gameService.pickPlayer(this.lobbyId,this.playerPicked).then(
                (response)=>{
                    console.log(response);
                },
                (error)=>{
                    console.log(error);
                }
            )
            }
        },

        //wenn der Spieler seine Runde beenden will muss noch geprüft werden, ob er genug karten / leben hat
        async endTurn(){
            await gameService.end(this.lobbyId).then(
                (response)=>{
                    console.log(response);
                },
                (error)=>{
                    console.log(error);
                }
            )
        },
        
        //wenn der Spieler einen Skill einsetzt
        async useSkill(skillId){
            if(this.containsId(skilldId, this.messageActivityUsable.skillsID)){
                await gameService.useSkill(this.lobbyId,skillId).then(
                    (response)=>{
                        console.log(response);
                    },
                    (error)=>{
                        console.log(error);
                    }
                )
            }
        },

        //wenn der confirm button gedrückt wird
        async confirm(){
            let count= this.cardsPicked.length;
            
            if(count >= this.messageActivitysUsable.minCard && count <=this.messageActivityUsable.maxCard && this.messageActivitysUsable.needsConfirm){
                await gameService.useCard(this.lobbyId,this.cardsPicked).then(
                (response)=>{
                    console.log(response);
                },
                (error)=>{
                    console.log(error);
                }
            )
            this.messageActivitysUsable = null;
            }
        },

        //wenn der cancel button gedrückt wird
        async cancel(){
            this.cardUsed=false;
            this.cardsPicked.splice(0,this.cardsPicked.length);
            this.tablePile.splice(0, this.tablePile.length);
            this.playerPicked.splice(0,this.playerPicked.length);
            await gameService.cancel(this.lobbyId).then(
                (response)=>{
                    console.log(response);
                },
                (error)=>{
                    console.log(error);
                }
            )
        },


        //-------------------------------- WEBSOCKET ---------------------------------------------------
        connect() {
            let socket = new SockJS("http://localhost:8080/updates");
            this.stompClient = Stomp.over(socket);
            this.stompClient.connect({}, (frame) => {
                console.log("Connected to " + frame);
                //der private connection
                this.stompClient.subscribe("/games/" + this.lobbyId +"/"+ this.username, (response) => {
                    console.log(JSON.parse(response.body));
                    this.gameStore.setGameData(JSON.parse(response.body));
                    this.playerTurnSetup();
                });
                //der public connection
                this.stompClient.subscribe("/games/" + this.lobbyId, (response) => {
                    console.log(JSON.parse(response.body));
                    this.gameStore.setGameData(JSON.parse(response.body));
                    this.gameSetup();
                });      
            });           
        },
        
        //keine Ahnung ob man es braucht
        disconnect() {
            this.stompClient.disconnect();
        },

        //der setup für private Connection
        playerTurnSetup(){
            if(this.gameStore.getGameData().messageType === 'HIGHLIGHT'){
                this.messageActivitysUsable = this.gameStore.getGameData().payload;
                this.showNotice=true;
                this.notice = this.messageActivitysUsable.reason;
            }else if(this.gameStore.getGameData().messageType === 'CARD_MOVE'){
                this.cardMoveMessage = this.gameStore.getGameData().payload;
                this.status = true;
            }
        },

        //der setup für public connection
        gameSetup(){
            if(this.status){
                this.status=false;
                return;
            }
            if(this.gameStore.getGameData().messageType === 'UPDATE_GAME'){
                this.playerDaten = this.gameStore.getGameData().payload;
            }else if(this.gameStore.getGameData().messageType === 'CARD_MOVE'){
                this.cardMoveMessage = this.gameStore.getGameData().payload;
            }else if(this.gameStore.getGameData().messageType === 'LOG'){
                this.logText += this.logText + "\n"+ this.gameStore.getGameData().payload;
            }else if(this.gameStore.getGameData().messageType === 'GAME_END'){
                this.playerSummarize = this.gameStore.getGameData().payload;
            }
        },

        //------------------------------ NORMAL --------------------------------------------------
        
        //wenn maus über das item hovert um 1s delay zu haben
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
       
        //TODO: MUSS ÜBERARBEITET WERDEN
        checkConfirmStatus(){
            if(this.playerPicked.length<this.messageActivitysUsable.minPlayer || 
                this.tablePile.length<this.messageActivitysUsable.minCard)
                return false;
            return true;
        },
        
        //TODO: MUSS ÜBERARBEITET WERDEN
        updateCardMoveMessage(){
            this.showNotice = !this.showNotice;
            //1. wir entfernen die Karten.
            //erst prüfen ob es eines der Stapeln ist
            //Wenn es auch nicht da ist prüfe ob es der Spieler seine equipment / passive ist

            if(this.cardMoveMessage.source === 'discardPile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++)
                    this.discardPile.pop();
            }else if(this.cardMoveMessage.source === 'drawPile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++)
                    this.drawPile.pop();
            }else if(this.cardMoveMessage.source === 'tablePile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++)
                    this.tablePile.pop();
            }else if(this.cardMoveMessage.source === ("equipment-"+this.username)){
                for(let j=0;j<this.cardMoveMessage.cardsId.length;j++){
                    this.playerEquipment = this.playerEquipment.filter(card => card !== this.cardMoveMessage.cardsId[j]);
                }     
            }else if(this.cardMoveMessage.source === ("delayEffect-"+this.username)){
                for(let j=0;j<this.cardMoveMessage.cardsId.length;j++){
                    this.playerDelayedEffect = this.playerDelayedEffect.filter(card => card !== this.cardMoveMessage.cardsId[j]);
                }     
            }else {
                for(let i=0;i<this.playerDaten.length;i++){
                if(this.playerDaten[i].username === this.cardMoveMessage.source){
                    this.playerDaten[i].cardCount-=this.cardMoveMessage.count;
                    if(this.cardMoveMessage.source === this.username){
                        for(let j=0;j<this.cardMoveMessage.cardsId.length;j++){
                            this.playerCards = this.playerCards.filter(card => card !== this.cardMoveMessage.cardsId[j]);
                        }
                    }
                }
            }
            }
            //2. wir fügen die Karte nun dahin wohin sie hingehört ein
            if(this.cardMoveMessage.destination === 'discardPile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++){
                    this.discardPile.push(this.cardMoveMessage.cardsId[i]);
                }
            }else if(this.cardMoveMessage.destination === 'drawPile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++)
                    this.drawPile.push(this.cardMoveMessage.cardsId[i]);
            }else if(this.cardMoveMessage.destination === 'tablePile'){
                for(let i=0;i<this.cardMoveMessage.cardsId.length;i++)
                    this.tablePile.push({
                        cardId:this.cardMoveMessage.cardsId[i],
                        playerName:this.cardMoveMessage.source
                    });
                    for(let i=0;i<this.tablePile.length;i++){
                        console.log("player: "+this.tablePile[i].playerName + "   played: "+this.tablePile[i].cardId);
                    }
            }else if(this.cardMoveMessage.destination === ("equipment-"+this.username)){
                for(let j=0;j<this.cardMoveMessage.cardsId.length;j++){
                    this.playerEquipment.push(this.cardMoveMessage.cardsId[j]);
                }     
            }else if(this.cardMoveMessage.destination === ("delayEffect-"+this.username)){
                for(let j=0;j<this.cardMoveMessage.cardsId.length;j++){
                    this.playerDelayedEffect.push(this.cardMoveMessage.cardsId[j]);
                }     
            }else{
                for(let i=0;i<this.playerDaten.length;i++){
                if(this.cardMoveMessage.destination === this.playerDaten[i].username){
                    this.playerDaten[i].cardCount+=this.cardMoveMessage.count;
                    if(this.cardMoveMessage.destination === this.username){
                        for(let j=0;j<this.cardMoveMessage.cardsId.length;j++){
                            this.playerCards.push(this.cardMoveMessage.cardsId[j]);
                        }
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

        //sucht den Spieler mit der bestimmten id
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
.start-Progressbar{
    width:10vw;
    height:5vh;
    position: absolute;
    background-color: red;
    right:0;
    top:40vh;
}

.interrupt-Progressbar{
    width:10vw;
    height:5vh;
    position: absolute;
    background-color: red;
    right:0;
    top:30vh;
}

.progress-container {
  position: absolute;
  bottom: 36.5vh;
  right: 1vw;
  display: inline-block;
  background: #eee;
  height: 20px;
  width: 10vw;
  border-radius: 6px;
  overflow: hidden;
}

.progress-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: turquoise;
  width: 0;
}

@keyframes progress-animation {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
.notice-Animation-enter-from{
    opacity:0;
    transform:translateY(-60px);
  } 
  .notice-Animation-enter-to{
    opacity:1;
    transform: translateY(0);
  }
  .notice-Animation-enter-active{
    animation: wobble 0.5s ease ;
  }
  .notice-Animation-leave-from{
    opacity:1;
    transform: translateY(0);
  }
  .notice-Animation-leave-to{
    opacity: 0;
    transform: translateY(-60px);
  }
  .notice-Animation-leave-active{
    transition:all 1s ease-out;
  } 

  @keyframes wobble{
    0%{
      opacity:0;
      transform: translateY(-60px) 
    }
    50%{
      opacity: 1;
      transform: translateY(0px) 
    }
    60%{
      transform: translateX(8px);
    }
    70%{
      transform: translateX(-8px);
    }
    80%{
      transform: translateX(4px);
    }
    90%{
      transform: translateX(-4px);
    }
    100%{
      transform: translateX(0px);
    }
  }

  .notice-message{
    width: 15vw;
    height: 10vh;
    background-color: red;
    position: absolute;
    right:1vw;
    bottom:46vh;
  }


.cardUsedStyle{
    transform:translateY(-3vh);
}

.endTurn{
    position: absolute;
    right:1vw;
    width:10vw;
    height:5vh;
    bottom:40vh;
    background-color: blueviolet;
}


.playerSummarizeStyle{
    position: absolute;
    top:0;
    left:0;
    z-index:8;
}

.player{
    position: absolute;
    bottom: 5px;
    right: 5px;
}

.actualPlayer{
    border: solid red 5px;
}

.logBtn{
    width: 7vw;
  height: 5vh;
  color: #ffffff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 3vh;

  right:0;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  display: inline-block;
   box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5),
   7px 7px 20px 0px rgba(0,0,0,.1),
   4px 4px 5px 0px rgba(0,0,0,.1);
  outline: none;
    
}

.logTextArea{
    position: relative;
    width: 15vw;
    right: 0;
    top:5vh;
    height: 38vh;
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
    top:10px;
    position:relative;
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
    background-image: url(../assets/card/pictures/shield.png);
}
.discardPile{
    position: absolute;
    left:13vw;
    bottom:32vh;
    border-radius: 1rem;
  width: 10vw;
  height: 29vh;
    background-color: pink;
    
}

.discardPileOverlay{
    position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index:5;
}

.playerChampions{
  width: 10vw;
  height: 29vh;
    margin-left: 2vh;
    margin-right: 2vh;
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

.playCard {
  border-radius: 1rem;
  box-shadow: 3px 3px 12px 2px rgba(black, 0.6);
  transition: 0.2s;
  z-index: 3;
}
.not-first-card{
  margin-left: -3rem;
}
.not-last-card:hover,
.not-last-card:focus-within {
  transform: translateY(-1rem);
  z-index: 6;;
}
.not-last-card:focus-within ~ .card {
transform: translateX(2rem);
}

.handCardSlot{
  position: absolute;
  display: flex;
  bottom:1px;
  left:22vw;
  width: 61vw;
  height: 29vh;
}

.passiveSlot{
    width: 18vw;
    height: 30vh;
    overflow:auto;
    position: absolute;
    bottom:16vh;
}

.passiveCircle{
    position: relative;
    background-color: purple;
    top:20vh;
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

.bg-image {
  background: url("@/assets/backgrounds/game_background.png");
  height:100%;
  width: 100%;
  
}


.btn {
background: linear-gradient(0deg, rgb(126, 82, 15) 0%, rgba(251,75,2,1) 100%);
  line-height: 42px;
  padding: 0;
  border: none;
}
.btn span {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}
.btn:before,
.btn:after {
  position: absolute;
  content: "";
  right: 0;
  bottom: 0;
  background: rgb(147, 12, 3);
  box-shadow:
   -7px -7px 20px 0px rgba(255,255,255,.9),
   -4px -4px 5px 0px rgba(255,255,255,.9),
   7px 7px 20px 0px rgba(0,0,0,.2),
   4px 4px 5px 0px rgba(0,0,0,.3);
  transition: all 0.3s ease;
}
.btn:before{
   height: 0%;
   width: 2px;
}
.btn:after {
  width: 0%;
  height: 2px;
}
.btn:hover{
  color: rgba(251,75,2,1);
  background: transparent;
}
.btn:hover:before {
  height: 100%;
}
.btn:hover:after {
  width: 100%;
}
.btn span:before,
.btn span:after {
  position: absolute;
  content: "";
  left: 0;
  top: 0;
  background: rgb(147, 12, 3);
  box-shadow:
   -7px -7px 20px 0px rgba(255,255,255,.9),
   -4px -4px 5px 0px rgba(255,255,255,.9),
   7px 7px 20px 0px rgba(0,0,0,.2),
   4px 4px 5px 0px rgba(0,0,0,.3);
  transition: all 0.3s ease;
}
.btn span:before {
  width: 2px;
  height: 0%;
}
.btn span:after {
  height: 2px;
  width: 0%;
}
.btn span:hover:before {
  height: 100%;
}
.btn span:hover:after {
  width: 100%;
}

</style>