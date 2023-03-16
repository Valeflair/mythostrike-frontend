<template>
  <div class="bg-image">
    <!--------------------------------------------DIE ANDEREN SPIELER----------------------------------------->
    <header class="table-wrapper">
      <table>
        <tr>
          <td
            v-for="(player,i) in playerDaten.filter((player) => player.username !== username)"
            :key="player.username"
          >
            <championCard
              v-if="player.champion !== null"
              :activeSkills="player.champion.activeSkills"
              :passiveSkills="player.champion.passiveSkills"
              :championName="player.champion.name"
              :currentPlayer="player.isCurrentPlayer"
              :handcardNum="player.cardCount"
              :health="player.currentHp"
              :identity="player.identity"
              :isGame="true"
              :name="player.username"
              :equipment="getCardsFromArray(player.equipment)"
              :delayedEffects="getCardsFromArray(player.delayedEffects)"
              :picked="containsId(player.username, playersPicked)"
              :usable="containsId(player.username, playerConditions.players)"
              class="playerChampions"
              @click="pickPlayer(player.username)"
              :id="`#championCard-${i}`"
            />
          </td>
        </tr>
      </table>
    </header>

    <!-----------------------------------------DIE SPIELERGEBNISSE----------------------------------------------->

    <result-page v-if="playerSummarize.length !== 0" :users="playerSummarize" class="playerSummarizeStyle" />

    <!-----------------------------------------DER LOGBUTTON----------------------------------------------------->

    <div class="logClass mr-1 mt-1">
      <button class="logBtn btn" @click="logOpen = !logOpen">
        <span>Log</span>
      </button>
      <div v-if="logOpen" class="logTextArea">
        <div class="pa-3" v-html="logTextWithLineBreaks"></div>
      </div>
    </div>

    <!----------------------------------------------DER SPIELER ------------------------------------------------------>

    <div class="player">
      <player-card
        :activeSkills="findPlayer(username).champion.activeSkills"
        :championName="findPlayer(username).champion.name"
        :currentPlayer="findPlayer(username).isCurrentPlayer"
        :health="findPlayer(username).currentHp"
        :identity="lobbyStore.getIdentity()"
        :messageActivitysUsable="messageActivitysUsable"
        :name="username"
        :passiveSkills="findPlayer(username).champion.passiveSkills"
        :usedSkill="skillPicked"
        @skillUsed="useSkill"
      />
    </div>

    <!-----------------------------------------------DIE DELAYED EFFEKTE & EQUIPMENT--------------------------------------------------------->

    <div class="passiveSlot">


      <div
        v-for="(passive, j) in playerDelayedEffect"
        :key="passive.id"
      >
        <div :id="`#passiveCard-${j}`" class="passiveCircle">
          <delayedeffect-component :diameter="7" :name="getCard(passive).name"
                                   :description="getCard(passive).description"
          />
        </div>
      </div>


    </div>

    <div class="equipmentSlot">
      <div v-for="(equip, i) in playerEquipment" :key="equip.id">

        <div class="equipment"
             :id="`#equipmentCard-${i}`">

          <Equipment
            :description="getCard(equip).description"
            :name="getCard(equip).name"
            :fontProp="2"
            :heightProp="6.5"
            :widthProp="18"
          />

        </div>
      </div>
    </div>

    <!-------------------------------------------DIE HANDKARTEN---------------------------------------------->

    <div class="handCardSlot">
      <div class="card-Container">
        <div
          v-for="(card, i) in playerCards"
          :key="i"
          :class="[{ 'not-first-card': i !== 0 }, 'not-last-card']"
          :style="{
            'margin-left': calculateMarginLeft(playerCards.length, i),
          }"
          @mouseenter="hoverStart(getCard(card))"
          @mouseleave="hoverEnd(getCard(card))"
        >
          <div class="cardWrapper" :id="`#cardWrapper-${i}`">
            <play-card
              :class="{ cardUsedStyle: checkCardPicked(card) }"
              :description="getCard(card).description"
              :identity="null"
              :name="getCard(card).name"
              :picked="checkCardPicked(card)"
              :symbol="getCard(card).symbol"
              :usable="containsId(card, cardConditions.cardIds)"
              :value="getCard(card).point"
              class="playCard"
              @click="useCard(i, card)"
              :id="`#playCard-${i}`"
            />
          </div>
        </div>
      </div>
    </div>

    <!-----------------DIE KARTEN AUF DEM TISCH UND DER CONFIRM/CANCEL BUTTON-------------------------------------->

    <div class="tablePileSlot">
      <div class="tableContainer">
        <div
          v-for="(entry, i) in tablePile"
          :key="i"
          :class="[{ 'not-first-card': i !== 0 }, 'not-last-card']"
          :style="{
            'margin-left': calculateMarginLeft(tablePile.length, i),
          }"
          @mouseenter="hoverStart(getCard(entry.cardId))"
          @mouseleave="hoverEnd(getCard(entry.cardId))"
        >
          <play-card
            :description="getCard(entry.cardId).description"
            :identity="entry.playerName"
            :name="getCard(entry.cardId).name"
            :symbol="getCard(entry.cardId).symbol"
            :usable="false"
            :value="getCard(entry.cardId).point"
            class="playCard"
            :id="`#tableCard-${i}`"
          />
        </div>
      </div>

      <button v-if="activateConfirm" class="confirmButton button" @click="confirm()">Confirm</button>
      <button v-if="activateCancel" class="cancelButton button" @click="cancel()">Cancel</button>
    </div>

    <!-----------------------------------------------DER ZIEHSTAPEL----------------------------------------->

    <div class="drawPile" :id="`#drawPile`">
      <img src="/cards/cardcover.png" :style="{ width: '100%', height: '100%' }">
    </div>

    <!-----------------------------------------------DER ABLEGESTAPEL--------------------------------------------------------->

    <div v-if="discardPile.length > 0">
      <div v-for="(discard,i) in discardPile" :key="i" class="discardPile">
        <play-card
          :description="getCard(discardPile[i]).description"
          :identity="null"
          :name="getCard(discardPile[i]).name"
          :symbol="getCard(discardPile[i]).symbol"
          :value="getCard(discardPile[i]).point"
          :id="`#discardPile-${i}`"
        />
      </div>

      <div class="discardPileOverlay"></div>
    </div>

    <!----------------------------------------DER ENDBUTTON----------------------------------------------->

    <button v-if="messageActivitysUsable.activateEndTurn" class="endTurn button" @click="endTurn()">End Turn</button>

    <!-------------------------------NOTICE----------------------------------------------->

    <transition name="notice-Animation">
      <div v-if="showNotice" class="notice-message pa-2">{{ notice }}</div>
    </transition>

    <!----------------------------------------DER TIMER----------------------------------------------->

    <div class="progress-container">
      <progress ref="progress" max="100" value="100">100%</progress>
    </div>
  </div>
</template>

<script>
import championCard from "../components/ChampionCard.vue";
import Equipment from "../components/BlockWithDescription.vue";
import DelayedeffectComponent from "../components/DelayedeffectComponent.vue";
import playerCard from "../components/PlayerChampionCard.vue";
import resultPage from "../components/Statement.vue";
import playCard from "../components/PlayCard.vue";
import { useGameStore } from "@/stores/game";
import gameService from "@/services/gameService";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useLobbyStore } from "@/stores/lobby";
import { useUserStore } from "@/stores/user";
import resourceService from "@/services/resourceService";
import service from "@/services/service";

export default {
  setup() {
    const gameStore = useGameStore();
    const lobbyStore = useLobbyStore();
    const userStore = useUserStore();
    return { gameStore, lobbyStore, userStore };
  },
  computed: {
    logTextWithLineBreaks() {
      return this.logText.replace(/\n/g, "<br>");
    },
  },
  mounted() {
    document.body.style.overflow = "hidden";
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.disconnect);
  },
  data() {
    return {
      /*---------- WEBSOCKET ----------*/
      stompClient: null,
      status: false, //boolean um zu prüfen ob erst eine private websocket gesendet wurde falls ja wird es auf true gesetzt und der nächste public websocket wird ignoriert -> wird gebraucht für cardmovemessage
      playerSummarize: [], // die Schnittstelle für die Ergebnisse
      messageActivitysUsable: {
        cardIds: [],
        cardCount: [],
        cardPlayerConditions: [
          {
            players: [],
            count: [],
          },
        ],
        skillIds: [],
        skillCount: [],
        skillPlayerConditions: [
          {
            players: [],
            count: [],
          },
        ],
        activateEndTurn: false,
        reason: "Alles was der Spieler einsetzen kann: hier nur die Karten und skills mit den Ids",
      }, // die Schnittstelle für Highlightmessage
      playerDaten: [
        {
          username: "-",
          cardCount: 0,
          isAlive: true,
          champion: {
            name: "-",
            id: -1,
            maxHP: 0,
            passiveSkills: [],
            activeSkills: [],
          },
          maxHP: 0,
          currentHP: 0,
          identity: "-",
          equipment: [],
          delayedEffects: [],
        },
      ], // die Schnittstelle um die Daten aller Spieler zu aktualisieren
      cardMoveMessage: {
        source: "-",
        destination: "-",
        count: 0,
        cardIds: [],
      }, // die Schnittstelle um eine Karte zu bewegen

      /*---------- ANIMATION PROGRESSBAR ----------*/
      animation: null,

      /*---------- NOTICE BOX ----------*/
      notice: "",
      showNotice: false,

      /*---------- BUTTONS ----------*/
      cardUsed: false, // wird genutzt um confirm und cancel button anzuzeigen wenn eine Karte verwendet wurde
      activateCancel: false,
      activateConfirm: false,
      activateEndTurn: true,

      /*---------- ALLGEMEINE DATEN FÜR GAME ----------*/
      lobbyId: Number, //die LobbyId vom game wird mitgegeben
      backgroundImage: "/backgrounds/game_background.png", // backgroundimage
      timerDelay: 1000, // der delay für karten hover
      currentPlayer: "", // bekommen wir von websocket
      cards: [],
      gameDuration: 30000,
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight,


      /*---------- LOG ----------*/
      logText: "", // der text für den log
      logOpen: false, // boolean der prüft ob der log geöffnet wurde oder nicht

      /*---------- FESTE PLAYERDATEN ----------*/
      username: "", // hält der Spieler immer bei sich
      identity: "", // die Identität vom Spieler wird von championSelect mitgegeben
      champion: Object, // der Champion vom Spieler

      /*---------- NICHT FESTE PLAYERDATEN ----------*/
      playerCards: [
        /*0,1,2,3*/
      ], //die Karten vom Spieler
      playerEquipment: [
        /*1*/
      ], // das Equipment vom Spieler
      playerDelayedEffect: [
        /*0, 1*/
      ], // die delayed Effekte vom Spieler

      cardsPicked: [
        /* {solche einträge sind da drin
            cardId: Number,
            index: Number, //ab 0 indiziert die Handkarten
          },*/
      ], // die Karten die der Spieler ausgewählt hat
      skillPicked: {
        skillId: -1,
        index: -1,
      }, // den Skill den der Spieler ausgewählt hat
      playersPicked: [], // die Player die der Spieler ausgewählt hat

      playerConditions: {
        players: [],
        count: [],
      },
      skillConditions: {
        skillIds: [],
        count: [],
      },
      cardConditions: {
        cardIds: [],
        count: [],
      },

      /*---------- KARTEN STAPEL ----------*/
      tablePile: [], // der Stapel für die gerade ausgespielten Karten
      discardPile: [], // der AblegeStapel
      drawPile: [], // der Ziehstapel

      /*---------- AXIOS SEND PER CONFIRM ----------*/
      axiosUseCard: false,
      axiosPickPlayer: false,
      axiosSelectSkill: false,

      /*---------- DEFAULT PLAYER DAMIT NICHT ALLES KAPUTT GEHT ----------*/
      defaultPlayer: {
        username: "-",
        cardCount: 0,
        isAlive: true,
        champion: {
          name: "-",
          id: -1,
          maxHP: 0,
          passiveSkills: [],
          activeSkills: [],
        },
        maxHP: 0,
        currentHP: 0,
        identity: "-",
        equipment: [],
        delayedEffects: [],
      },
    };
  },
  components: {
    championCard,
    Equipment,
    DelayedeffectComponent,
    playerCard,
    resultPage,
    playCard,
  },
  created() {
    this.lobbyId = this.lobbyStore.getLobby.id;
    this.username = this.userStore.getUser.username;
    this.initData();
    this.connect();
  },
  methods: {
    updateConditions() {
      //wenn Karte ausgewählt keine Skill auswählbar machen
      if (this.cardsPicked.length > 0) {
        this.activateCancel = true;
        this.skillConditions.skillId = [];
        this.skillConditions.count = [];
        this.cardConditions.cardIds = [...this.messageActivitysUsable.cardIds];
        this.cardConditions.count = [...this.messageActivitysUsable.cardCount];
        //wenn eine Karte ausgewählt ist und Gegner zur auswahl stehen, Gegner auswählbar machen
        if (
          this.cardsPicked.length === 1 &&
          this.getMax(this.messageActivitysUsable.cardCount) === 1 &&
          this.messageActivitysUsable.cardPlayerConditions[this.cardsPicked[0].index] != null
        ) {
          //spieler die man auswählen kann und dessen Anzahl holen
          let id = this.cardsPicked[0].index;
          let players = this.messageActivitysUsable.cardPlayerConditions[id].players;
          this.playerConditions.count = this.messageActivitysUsable.cardPlayerConditions[id].count;

          //check if not too many players are selected
          if (this.playersPicked.length >= this.getMax(this.playerConditions.count)) {
            this.playerConditions.players = [];
          } else {
            //filtere schon ausgewählte spieler raus
            this.playerConditions.players = players.filter((player) => !this.containsId(player, this.playersPicked));
          }

          //reset cardConditions because we have to select players
          this.cardConditions.cardIds = [];
          this.cardConditions.count = [];

          //sonst nicht
        } else {
          this.playerConditions.players = [];
          this.playerConditions.count = [];
        }
        //wenn ein Skill ausgewählt wurde keine Karten auswählbar machen
      } else if (this.skillPicked.index !== -1) {
        this.activateCancel = true;

        //keine Karte auswählbar
        this.cardConditions.cardIds = [];
        this.cardConditions.count = [];

        //keinen weiteren skill auswählbar
        this.skillConditions.skillIds = [];
        this.skillConditions.count = [...this.messageActivitysUsable.skillCount];
        //player abhängig von Skill auswählbar
        if (this.messageActivitysUsable.skillPlayerConditions.length !== 0) {
          let players = this.messageActivitysUsable.skillPlayerConditions[this.skillPicked.index].players;
          let count = this.messageActivitysUsable.skillPlayerConditions[this.skillPicked.index].count;

          this.playerConditions.players = [...players];
          this.playerConditions.count = [...count];
        } else {
          this.playerConditions.players = [];
          this.playerConditions.count = [];
        }

        //wenn weder skill noch karte ausgwählt ist, mach nur skill oder karte auswählbar
      } else {
        //der CANCEL BUTTON PRAKTISCH
        this.activateCancel = false;
        this.skillConditions.skillIds = [...this.messageActivitysUsable.skillIds];
        this.skillConditions.count = [...this.messageActivitysUsable.skillCount];
        this.cardConditions.cardIds = [...this.messageActivitysUsable.cardIds];
        this.cardConditions.count = [...this.messageActivitysUsable.cardCount];
        this.playerConditions.players = [];
        this.playerConditions.count = [];
      }

      let playerConfirm = false;
      let cardConfirm = false;
      let skillConfirm = false;

      for (const length of this.playerConditions.count) {
        if (length === this.playersPicked.length) {
          playerConfirm = true;
          this.axiosUseCard = true;
          break;
        }
      }
      for (const length of this.cardConditions.count) {
        if (length === this.cardsPicked.length) {
          cardConfirm = true;
          this.axiosUseCard = true;
          this.axiosSelectSkill = false;
          break;
        }
      }
      if (
        (this.containsId(0, this.skillConditions.count) && this.skillPicked.index === -1) ||
        (this.containsId(1, this.skillConditions.count) && this.skillPicked.index !== -1)
      ) {
        skillConfirm = true;
        this.axiosUseCard = false;
        this.axiosSelectSkill = true;
      }

      this.activateConfirm = playerConfirm || cardConfirm || skillConfirm;
    },


    resetHighlightMessage() {
      this.messageActivitysUsable = {
        cardIds: [],
        cardCount: [],
        cardPlayerConditions: [
          {
            players: [],
            count: [],
          },
        ],
        skillIds: [],
        skillCount: [],
        skillPlayerConditions: [
          {
            players: [],
            count: [],
          },
        ],
        activateEndTurn: false,
        reason: "",
      };
      this.updateConditions();
    },

    checkCardPicked(id) {
      for (const element of this.cardsPicked) {
        if (element.cardId === id) return true;
      }
      return false;
    },

    getMax(array) {
      let max = -1;
      for (let i = 0; i < array.length; i++) {
        if (array[i] > max) max = array[i];
      }
      return max;
    },


    //--------------------------------- AXIOS ----------------------------------------------------

    //alle Karten holen initialisieren
    async initData() {
      this.resetHighlightMessage();
      await resourceService.getCards().then(
        (response) => {
          this.cards = response.data;
          console.log(this.cards);
        },
        (error) => {
          console.log(error);
        },
      );
    },

    //wenn der Spieler auf eine Karte drückt
    useCard(index, id) {
      if (this.containsId(id, this.messageActivitysUsable.cardIds)) {
        if (this.checkCardPicked(id)) {
          this.cardsPicked = this.cardsPicked.filter((card) => card.cardId !== id);
          //reset players Picked
          this.playersPicked.splice(0, this.playersPicked.length);
        } else if (this.containsId(id, this.cardConditions.cardIds)) {
          let playerIndexCount = 0;
          //get id of card and add it t
          for (let i = 0; i < this.playerCards.length; i++) {
            if (i === index) {
              break;
            }
            if (this.containsId(this.playerCards[i], this.messageActivitysUsable.cardIds)) {
              playerIndexCount++;
            }
          }

          this.cardsPicked.push({ cardId: id, index: playerIndexCount });
        }
        this.updateConditions();
      }
    },
    //wenn der Spieler auf einen Spieler drückt
    pickPlayer(name) {
      if (this.containsId(name, this.playersPicked)) {
        this.playersPicked = this.playersPicked.filter((player) => player !== name);
      } else {
        if (this.containsId(name, this.playerConditions.players)) {
          this.playersPicked.push(name);
        }
      }
      this.updateConditions();
    },

    //wenn der Spieler seine Runde beenden will muss noch geprüft werden, ob er genug karten / leben hat
    async endTurn() {

      this.resetHighlightMessage();
      this.resetProgress();
      await gameService.end(this.lobbyId).then(
        (response) => {
          console.log(response);
          this.cardsPicked.splice(0, this.cardsPicked.length);
          this.activateCancel = false;
        },
        (error) => {
          console.log(error);
        },
      );
    },

    //wenn der Spieler einen Skill einsetzt
    useSkill(i, skillId) {

      if (this.containsId(skillId, this.skillConditions.skillIds)) {


        this.skillPicked = { skillId: skillId, index: i };

        this.updateConditions();

      }
    },

    //wenn der confirm button gedrückt wird
    async confirm() {

      if (this.axiosUseCard) {
        //array mit Karten Index erstellen
        let cardIndexArray = [];
        this.showNotice = false;
        for (const element of this.cardsPicked) {
          cardIndexArray.push(element.cardId);
        }

        let nameCardArray = [];
        for (const element of cardIndexArray) {
          nameCardArray.push({ id: element, name: this.getCard(element).name });
        }

        //has to be resetted before call, because response takes to long and then new highlightMessage is resetted
        this.resetHighlightMessage();

        this.resetProgress();
        gameService.useCard(this.lobbyId, cardIndexArray, this.playersPicked).then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          },
        );
      } else if (this.axiosSelectSkill) {
        this.showNotice = false;

        //has to be resetted before call, because response takes to long and then new highlightMessage is resetted
        this.resetHighlightMessage();
        this.resetProgress();
        gameService.useSkill(this.lobbyId, this.skillPicked.skillId, this.playersPicked).then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          },
        );
      }

      this.cardUsed = false;
      this.cardsPicked.splice(0, this.cardsPicked.length);
      this.playersPicked.splice(0, this.playersPicked.length);
      this.skillPicked = { skillId: -1, index: -1 };
      this.activateCancel = false;
    },

    //wenn der cancel button gedrückt wird
    cancel() {
      this.cardUsed = false;
      this.cardsPicked.splice(0, this.cardsPicked.length);
      this.playersPicked.splice(0, this.playersPicked.length);
      this.skillPicked = { skillId: -1, index: -1 };
      this.updateConditions();
    },

    //-------------------------------- WEBSOCKET ---------------------------------------------------
    connect() {
      let socket = new SockJS(service.WS_URL);
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, () => {

        //der public connection
        this.stompClient.subscribe("/games/" + this.lobbyId, (response) => {
          console.log(JSON.parse(response.body));
          this.gameStore.setGameData(JSON.parse(response.body));
          this.gameSetup();
        });

        //der private connection
        this.stompClient.subscribe("/games/" + this.lobbyId + "/" + this.userStore.getUser.username, (response) => {
          console.log(JSON.parse(response.body));
          this.gameStore.setGameData(JSON.parse(response.body));
          this.playerTurnSetup();
        });


      });
    },
    disconnect() {
      this.stompClient.unsubscribe("/games/" + this.lobbyId + "/" + this.userStore.getUser.username);
      this.stompClient.disconnect();
      window.removeEventListener("beforeunload", this.disconnect);
    },

    //der setup für private Connection
    playerTurnSetup() {
      //this.printSchnittstellen();
      if (this.gameStore.getGameData.messageType === "HIGHLIGHT") {
        this.messageActivitysUsable = this.gameStore.getGameData.payload;
        this.showNotice = true;
        this.notice = this.messageActivitysUsable.reason;
        this.updateConditions();
        this.startProgressbar();
      } else if (this.gameStore.getGameData.messageType === "CARD_MOVE") {
        this.cardMoveMessage = this.gameStore.getGameData.payload;
        console.log(this.cardMoveMessage);
        console.log("----------------------------------------------------------- CARDMOVEMESSAGE -----------------------------------------------------------");
        this.updateCardMoveMessage();
        console.log(this.cardMoveMessage);

      }
    },

    //der setup für public connection
    gameSetup() {
      //this.printSchnittstellen();
      if (this.gameStore.getGameData.messageType === "UPDATE_GAME") {
        this.playerDaten = this.gameStore.getGameData.payload;
        console.log("----------------------------------------------------------- UPDATEGAMEMESSAGE -----------------------------------------------------------");


      } else if (this.gameStore.getGameData.messageType === "CARD_MOVE") {
        this.cardMoveMessage = this.gameStore.getGameData.payload;
        console.log(this.cardMoveMessage);
        console.log("----------------------------------------------------------- CARDMOVEMESSAGE -----------------------------------------------------------");
        this.updateCardMoveMessage();
        console.log(this.cardMoveMessage);

      } else if (this.gameStore.getGameData.messageType === "LOG") {
        this.logText += "\n" + this.gameStore.getGameData.payload.message;
      } else if (this.gameStore.getGameData.messageType === "GAME_END") {
        this.playerSummarize = this.gameStore.getGameData.payload;
      }
    },

    //------------------------------ NORMAL --------------------------------------------------

    //wenn maus über das item hovert um 1s delay zu haben
    hoverStart(item) {
      this.hoverTimer = setTimeout(() => {
        item.showDescription = true;
      }, this.timerDelay);
    },

    //wenn maus nicht mehr das item hovert
    hoverEnd(item) {
      clearTimeout(this.hoverTimer);
      item.showDescription = false;
    },

    //die Abstände der Karten auf der Hand. Je mehr Karten, desto näher werden diese
    calculateMarginLeft(length, i) {
      if (i === 0) return 0;
      let margin = 0;
      if (length >= 10) margin = 8;
      else if (length >= 8) margin = 7;
      else if (length >= 6) margin = 5;
      else if (length >= 4) margin = 3;
      else if (length >= 2) margin = 1;
      else margin = 0;
      return `-${margin}rem`;
    },

    //methode bekommt eine art id und ein array und prüft ob die id im array drinn ist
    //wird verwendet um strings und nummern zu prüfen
    containsId(id, searchArray) {
      if (searchArray === null) searchArray = [];
      for (const element of searchArray) {
        if (element === id) return true;
      }
      return false;
    },


    /*sucht die Karte mit der bestimmten id */
    getCard(id) {
      for (const element of this.cards) {
        if (element.id === id) {
          return element;
        }
      }
    },


    getCardsFromArray(array) {
      let newArray = [];
      for (let i = 0; i < array.length; i++) {
        newArray.push(this.getCard(array[i]));
      }
      return newArray;
    },

    //sucht den Spieler mit der bestimmten id
    findPlayer(id) {
      for (const element of this.playerDaten) {
        if (id === element.username) return element;
      }
      return this.defaultPlayer;
    },

    resetProgress() {
      if (this.animation !== null) {
        this.animation.pause();
        this.$refs.progress.style.animation = "none";
      }
    },

    //startet den Timer
    startProgressbar() {
      console.log("------------------------------------------------------------startProgress----------------------------------------------------");
      console.log("-------------------------------------------------------------------------------------------------------------------------------");
      console.log("-------------------------------------------------------------------------------------------------------------------------------");
      console.log("-------------------------------------------------------------------------------------------------------------------------------");
      console.log("-------------------------------------------------------------------------------------------------------------------------------");
      console.log("-------------------------------------------------------------------------------------------------------------------------------");
      console.log("Messageactivity");
      console.log(this.messageActivitysUsable);
      if (this.messageActivitysUsable.cardCount !== 0 || this.activateConfirm || this.messageActivitysUsable.activateEndTurn) {
        console.log("can finish");
        this.animation = this.$refs.progress.animate([{ width: "100%" }, { width: "0%" }], {
          duration: this.gameDuration,
          easing: "ease-in",
          fill: "forwards",
        });
        this.animation.onfinish = () => {
          if (this.messageActivitysUsable.activateEndTurn) {
            this.resetProgress();
            this.endTurn();
          } else if (!this.activateConfirm) {
            let min = 9999;
            this.resetProgress();
            for (let p = 0; p < this.messageActivitysUsable.cardCount; p++) {
              if (this.messageActivitysUsable.cardCount[p] < min)
                min = this.messageActivitysUsable.cardCount[p];
            }

            for (let i = 0; i < min; i++) {
              for (let j = 0; j < this.playerCards.length; j++) {
                if (!this.checkCardPicked(this.playerCards[j]) && this.containsId(this.playerCards[j], this.cardConditions.cardIds)) {
                  this.useCard(i, this.playerCards[j]);
                  break;
                }
              }
            }
            this.confirm();

          } else if (this.activateConfirm) {
            console.log("shit");
            this.confirm();
            this.resetProgress();
          }
          if (this.animation !== null)
            this.animation.onfinish = null;
        };
        this.$refs.progress.style.animation = "progress-animation 20s ease-in forwards";
      }
    },

    removeCardsFromSource(copyDataMovingCards) {
      if (this.cardMoveMessage.source === "discardPile") {
        for (const element of this.cardMoveMessage.cardIds) this.discardPile.pop();
      } else if (this.cardMoveMessage.source === "drawPile") {
        for (const element of this.cardMoveMessage.cardIds) {
          copyDataMovingCards.push({
            xPoint: 0.01 * this.viewportWidth,
            yPoint: this.viewportHeight - 0.32 * this.viewportHeight,
            cardId: element,
          });
          this.drawPile.pop();
        }
      } else if (this.cardMoveMessage.source === "tablePile") {
        const cardIds = this.cardMoveMessage.cardIds;
        for (let i = 0; i < cardIds.length; i++) {
          const cardId = cardIds[i];
          let num = 0;
          for (let j = 0; j < this.tablePile.length; j++) {
            if (this.tablePile[j].cardId === cardId)
              num = j;
          }
          const cardElement = document.getElementById(`#tableCard-${num}`);
          const cardRect = cardElement.getBoundingClientRect();
          const cardX = cardRect.left * window.devicePixelRatio;
          const cardY = cardRect.top * window.devicePixelRatio;
          copyDataMovingCards.push({ xPoint: cardX, yPoint: cardY, cardId: cardId });
        }
        for (const element of this.cardMoveMessage.cardIds)
          this.tablePile.pop();

      } else if (this.cardMoveMessage.source === "equipment-" + this.username) {
        for (const element of this.cardMoveMessage.cardIds) {
          this.playerEquipment = this.playerEquipment.filter((card) => card !== element);

          copyDataMovingCards.push({ xPoint: 0, yPoint: 0.8 * this.viewportHeight, cardId: element });
        }
      } else if (this.cardMoveMessage.source === "delayedEffect-" + this.username) {
        for (const element of this.cardMoveMessage.cardIds) {
          this.playerDelayedEffect = this.playerDelayedEffect.filter(
            (card) => card !== element,
          );
          copyDataMovingCards.push({ xPoint: 0, yPoint: 0.7 * this.viewportHeight, cardId: element });
        }
      } else {
        let p = 0;
        for (const element of this.playerDaten) {
          if (element.username === this.cardMoveMessage.source) {
            element.cardCount -= this.cardMoveMessage.count;

            const cardIds = this.cardMoveMessage.cardIds;

            for (let i = 0; i < cardIds.length; i++) {
              const cardId = cardIds[i];
              let num = 0;
              for (let j = 0; j < this.playerCards.length; j++) {
                if (this.playerCards[j] === cardId)
                  num = j;
              }
              if (this.playerCards.length === 0) {
                if (element.username !== this.username) {
                  const championElement = document.getElementById(`#championCard-${p}`);
                  const championRect = championElement.getBoundingClientRect();
                  const championX = championRect.left * window.devicePixelRatio;
                  const championY = championRect.top * window.devicePixelRatio;
                  copyDataMovingCards.push({ xPoint: championX, yPoint: championY, cardId: cardId });

                }

              } else {
                const cardElement = document.getElementById(`#cardWrapper-${num}`);
                const cardRect = cardElement.getBoundingClientRect();
                const cardX = cardRect.left * window.devicePixelRatio;
                const cardY = cardRect.top * window.devicePixelRatio;
                copyDataMovingCards.push({ xPoint: cardX, yPoint: cardY, cardId: cardId });
              }

            }
            p++;
            for (const element of this.cardMoveMessage.cardIds)
              this.playerCards = this.playerCards.filter((card) => card !== element);

          }
        }
      }
    },

    addCardsToDestination() {
      if (this.cardMoveMessage.destination === "discardPile") {
        for (const element of this.cardMoveMessage.cardIds) {
          this.discardPile.push(element);
        }
      } else if (this.cardMoveMessage.destination === "drawPile") {
        for (const element of this.cardMoveMessage.cardIds) this.drawPile.push(element);
      } else if (this.cardMoveMessage.destination === "tablePile") {
        for (const element of this.cardMoveMessage.cardIds)
          this.tablePile.push({
            cardId: element,
            playerName: this.cardMoveMessage.source,
          });
      } else if (this.cardMoveMessage.destination === "equipment-" + this.username) {
        for (const element of this.cardMoveMessage.cardIds) {
          this.playerEquipment.push(element);
        }
      } else if (this.cardMoveMessage.destination === "delayedEffect-" + this.username) {
        for (const element of this.cardMoveMessage.cardIds) {
          this.playerDelayedEffect.push(element);
        }
      } else {
        console.log("this.cardMoveMessage.destination ");
        console.log(this.cardMoveMessage.destination);
        console.log("playerdaten");
        console.log(this.playerDaten);
        for (const element of this.playerDaten) {
          if (this.cardMoveMessage.destination === element.username) {
            console.log("username found: " + this.username);
            element.cardCount += this.cardMoveMessage.count;
            if (this.cardMoveMessage.destination === this.username) {
              for (const element of this.cardMoveMessage.cardIds) {
                this.playerCards.push(element);
                console.log("----------------------------------------------------------------------------this.playerCards");
                console.log(element);
              }
            }
          }
        }
      }
    },

    initializeStartingPositionAnimation(source, oldX, oldY, copyDataMovingCards) {
      if (copyDataMovingCards.length === 0) return;


      if (source === "drawPile") {
        let element = document.getElementById(`#drawPile`);
        let elementPos = element.getBoundingClientRect();
        let x = elementPos.left * window.devicePixelRatio;
        let y = elementPos.top * window.devicePixelRatio;
        for (let i = 0; i < this.cardMoveMessage.cardIds.length; i++) {
          oldX.push(x);
          oldY.push(y);
        }
      } else if (source === "tablePile") {
        for (let i = 0; i < copyDataMovingCards.length; i++) {
          oldX.push(copyDataMovingCards[i].xPoint);
          oldY.push(copyDataMovingCards[i].yPoint);
        }
      } else if (source === "discardPile") {

      } else if (source === "equipment-" + this.username) {
        for (let i = 0; i < copyDataMovingCards.length; i++) {
          oldX.push(copyDataMovingCards[i].xPoint);
          oldY.push(copyDataMovingCards[i].yPoint);
        }
      } else if (source === "delayedEffect-" + this.username) {

        for (let i = 0; i < copyDataMovingCards.length; i++) {
          oldX.push(copyDataMovingCards[i].xPoint);
          oldY.push(copyDataMovingCards[i].yPoint);
        }
      } else {
        if (source === this.username) {
          for (let i = 0; i < copyDataMovingCards.length; i++) {
            oldX.push(copyDataMovingCards[i].xPoint);
            oldY.push(copyDataMovingCards[i].yPoint);
          }
        } else {
          let num;
          let array = [...this.playerDaten];
          array = array.filter(player => player.username !== this.username);
          for (let p = 0; p < array.length; p++) {
            if (array[p].username === this.cardMoveMessage.source) {
              num = p;
              break;
            }
          }
          let playerElement = document.getElementById(`#championCard-${num}`);
          let playerPos = playerElement.getBoundingClientRect();
          const playerX = playerPos.left * window.devicePixelRatio;
          const playerY = playerPos.top * window.devicePixelRatio;
          for (let i = 0; i < copyDataMovingCards.length; i++) {
            oldX.push(playerX);
            oldY.push(playerY);
          }
        }
      }
    },

    moveAnimation(source, destination, oldX, oldY, copyDataMovingCards) {

      if (destination === "drawPile") {


      } else if (destination === "tablePile") {
        for (let i = 0; i < this.tablePile.length; i++) {
          if (this.containsId(this.tablePile[i].cardId, this.cardMoveMessage.cardIds)) {
            for (let j = 0; j < copyDataMovingCards.length; j++) {
              if (copyDataMovingCards[j].cardId === this.tablePile[i].cardId) {
                let element = document.getElementById(`#tableCard-${i}`);
                let elementPos = element.getBoundingClientRect();
                let newX = elementPos.left * window.devicePixelRatio;
                let newY = elementPos.top * window.devicePixelRatio;
                element.style.transition = "transform 1s ease-in-out";
                if (source === this.username) {
                  element.style.left = `${oldX[j] - newX}px`;
                  element.style.top = `${oldY[j] - newY - 0.04 * this.viewportHeight}px`;
                  element.style.transform = `translate(${newX - oldX[j]}px, ${newY - oldY[j] + 0.04 * this.viewportHeight}px)`;
                } else {
                  element.style.left = `${oldX[j] - newX}px`;
                  element.style.top = `${oldY[j] - newY}px`;
                  element.style.transform = `translate(${newX - oldX[j]}px, ${newY - oldY[j]}px)`;
                }
              }
            }
          }
        }

      } else if (destination === "discardPile") {
        for (let i = 0; i < this.discardPile.length; i++) {
          if (this.containsId(this.discardPile[i], this.cardMoveMessage.cardIds)) {
            for (let j = 0; j < copyDataMovingCards.length; j++) {
              if (copyDataMovingCards[j].cardId === this.discardPile[i]) {
                let element = document.getElementById(`#discardPile-${i}`);
                let elementPos = element.getBoundingClientRect();
                let newX = elementPos.left * window.devicePixelRatio;
                let newY = elementPos.top * window.devicePixelRatio;
                element.style.transition = "transform 1s ease-in-out";
                element.style.left = `${oldX[j] - newX}px`;
                element.style.top = `${oldY[j] - newY}px`;
                element.style.transform = `translate(${newX - oldX[j]}px, ${newY - oldY[j]}px)`;
              }
            }
          }
        }
      } else if (destination === "equipment-" + this.username) {
        for (let i = 0; i < this.playerEquipment.length; i++) {
          if (this.containsId(this.playerEquipment[i], this.cardMoveMessage.cardIds)) {
            for (let j = 0; j < copyDataMovingCards.length; j++) {
              if (copyDataMovingCards[j].cardId === this.playerEquipment[i]) {

                let element = document.getElementById(`#equipmentCard-${i}`);

                let elementPos = element.getBoundingClientRect();
                let newX = elementPos.left * window.devicePixelRatio;

                let newY = (i * 20 + elementPos.top) * window.devicePixelRatio;


                element.style.transition = "transform 1s ease-in-out";
                element.style.left = `${oldX[j] - newX}px`;
                element.style.top = `${oldY[j] - newY}px`;
                if (i === 0)
                  element.style.transform = `translate(${newX - oldX[j]}px, ${0.8 * this.viewportHeight - oldY[j]}px)`;
                else
                  element.style.transform = `translate(${newX - oldX[j]}px, ${0.9 * this.viewportHeight - oldY[j]}px)`;
              }
            }
          }
        }
      } else if (destination === "delayedEffect-" + this.username) {

        for (let i = 0; i < this.playerDelayedEffect.length; i++) {
          if (this.containsId(this.playerDelayedEffect[i], this.cardMoveMessage.cardIds)) {
            for (let j = 0; j < copyDataMovingCards.length; j++) {
              if (copyDataMovingCards[j].cardId === this.playerDelayedEffect[i]) {
                let element = document.getElementById(`#passiveCard-${i}`);
                let elementPos = element.getBoundingClientRect();
                let newX = elementPos.left * window.devicePixelRatio;
                let newY = 0.8 * this.viewportHeight;
                oldX[j] += 0.05 * this.viewportWidth;
                element.style.transition = "transform 1s ease-in-out";
                element.style.left = `${oldX[j] - newX}px`;
                element.style.top = `${oldY[j] - newY}px`;
                element.style.transform = `translate(${(i * 0.03 * this.viewportWidth) + newX - oldX[j]}px, ${0.2 * this.viewportHeight + newY - oldY[j]}px)`;


              }
            }
          }
        }
      } else {

        for (let i = 0; i < this.playerCards.length; i++) {
          if (this.containsId(this.playerCards[i], this.cardMoveMessage.cardIds)) {
            for (let j = 0; j < this.cardMoveMessage.cardIds.length; j++) {
              if (this.cardMoveMessage.cardIds[j] === this.playerCards[i]) {
                let element = document.getElementById(`#cardWrapper-${i}`);
                let elementPos = element.getBoundingClientRect();
                let newX = elementPos.left * window.devicePixelRatio;
                let newY = elementPos.top * window.devicePixelRatio;
                element.style.transition = "transform 1s ease-in-out";

                element.style.left = `${oldX[j] - newX}px`;
                element.style.top = `${oldY[j] - newY}px`;
                element.style.transform = `translate(${newX - oldX[j]}px, ${newY - oldY[j]}px)`;

              }
            }
          }
        }
      }
    },


    updateCardMoveMessage() {
      this.showNotice = false;
      //1. wir entfernen die Karten.
      //erst prüfen ob es eines der Stapeln ist
      //Wenn es auch nicht da ist prüfe ob es der Spieler seine equipment / passive ist
      let copyDataMovingCards = [];

      this.removeCardsFromSource(copyDataMovingCards);
      console.log("--------------------------------------- copyDataMovingCards : removeCardsFromSource ------------------------------------------");
      console.log(copyDataMovingCards);
      this.addCardsToDestination();
      console.log("--------------------------------------- copyDataMovingCards : addCardsToDestination ------------------------------------------");
      console.log(copyDataMovingCards);
      //2. wir fügen die Karte nun dahin wohin sie hingehört ein
      console.log("playerCards---------------------------------------------------------------------------------");
      console.log(this.playerCards);
      this.$nextTick(() => {

        const oldX = [];
        const oldY = [];

        const source = this.cardMoveMessage.source;
        this.initializeStartingPositionAnimation(source, oldX, oldY, copyDataMovingCards);

        const destination = this.cardMoveMessage.destination;
        this.moveAnimation(source, destination, oldX, oldY, copyDataMovingCards);


        copyDataMovingCards = 0;
      });
    },
  },
};
</script>

<style scoped>
.cardWrapper {
  position: relative;
  left: 0;
  top: 0;
}

.start-Progressbar {
  width: 10vw;
  height: 5vh;
  position: absolute;
  background-color: red;
  right: 0;
  top: 40vh;
}

.interrupt-Progressbar {
  width: 10vw;
  height: 5vh;
  position: absolute;
  background-color: red;
  right: 0;
  top: 30vh;
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
    width: 0;
  }
}

.notice-Animation-enter-from {
  opacity: 0;
  transform: translateY(-60px);
}

.notice-Animation-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.notice-Animation-enter-active {
  animation: wobble 0.5s ease;
}

.notice-Animation-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.notice-Animation-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}

.notice-Animation-leave-active {
  transition: all 1s ease-out;
}

@keyframes wobble {
  0% {
    opacity: 0;
    transform: translateY(-60px);
  }
  50% {
    opacity: 1;
    transform: translateY(0px);
  }
  60% {
    transform: translateX(8px);
  }
  70% {
    transform: translateX(-8px);
  }
  80% {
    transform: translateX(4px);
  }
  90% {
    transform: translateX(-4px);
  }
  100% {
    transform: translateX(0px);
  }
}

.notice-message {
  width: 15vw;
  height: 10vh;
  position: absolute;
  font-weight: bold;
  color: white;
  text-shadow: #000000 2px 2px 4px;
  border-radius: 15px;
  right: 1vw;
  bottom: 46vh;
  background: url("/elements/banner.png");
  background-size: cover;
}

.cardUsedStyle {
  transform: translateY(-3vh);
}

.endTurn {
  position: absolute;
  right: 1vw;
  bottom: 38vh;
}

.playerSummarizeStyle {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 15;
}

.player {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.logBtn {
  width: 7vw;
  height: 5vh;
  color: #ffffff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: "Lato", sans-serif;
  font-weight: bold;
  font-size: 3vh;
  right: 0;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5), 7px 7px 20px 0px rgba(0, 0, 0, 0.1),
  4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
}

.logTextArea {
  position: relative;
  width: 14vw;
  right: 0;
  top: 5vh;
  height: 37vh;
  font-weight: bold;
  color: white;
  text-shadow: #000000 2px 2px 4px;
  overflow-y: scroll;
  word-wrap: break-word;
  background: url("/elements/text_background.png");
  background-size: cover;
  border-radius: 15px;
}

.logClass {
  width: 14vw;
  height: 45vh;
  position: absolute;
  right: 0;
  top: 0;
  overflow: auto;
  z-index: 10;

}

.table-wrapper {
  display: flex;
  justify-content: center;
  width: 90vw;
  top: 10px;
  position: relative;
  z-index: 11

}

.tablePile {
  width: 10vw;
  height: 29vh;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 3px 3px 12px 2px rgba(black, 0.6);
  transition: 0.2s;
  border: solid black 2px;
}

.card-Container {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tableContainer {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tablePileSlot {
  position: absolute;
  display: flex;
  bottom: 32vh;
  left: 25vw;
  width: 50vw;
  height: 29vh;
}

.button {
  width: 10.25vw;
  min-height: 6vh;
  margin: 15px;
  color: white;
  font-size: 1vw;
  border-radius: 15px;
  background: url("/elements/button.png");
}

.button:hover {
  font-size: 1.1vw;
  font-weight: bold;
}


.drawPile {
  position: absolute;
  left: 1vw;
  bottom: 32vh;
  border-radius: 1rem;
  width: 10vw;
  height: 29vh;
  object-fit: contain;
}

.discardPile {
  position: absolute;
  left: 13vw;
  bottom: 32vh;
  width: 10vw;
  height: 29vh;
  background-color: pink;
}

.discardPileOverlay {
  position: absolute;
  left: 13vw;
  bottom: 32vh;
  width: 10vw;
  height: 29vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
}

.playerChampions {
  width: 10vw;
  height: 29vh;
  margin-left: 2vh;
  margin-right: 2vh;
}


.information p {
  border: solid yellow 1px;
}


.cancelButton {
  background: url("/elements/confirmbutton.png") no-repeat center center;
  position: absolute;
  left: 47vw;
  border-radius: 10px;
  bottom: 0;
}

.confirmButton {
  background: url("/elements/confirmbutton.png") no-repeat center center;
  position: absolute;
  left: 47vw;
  border-radius: 10px;
  bottom: 8vh;
}


.playCard {
  border-radius: 1rem;
  box-shadow: 3px 3px 12px 2px rgba(0, 0, 0, 0.6);
  transition: 0.2s;
  z-index: 3;
}

.not-first-card {
  margin-left: -3rem;
}

.not-last-card:hover,
.not-last-card:focus-within {
  transform: translateY(-1rem);
  z-index: 6;
}

.not-last-card:focus-within ~ .card {
  transform: translateX(2rem);
}

.handCardSlot {
  position: absolute;
  display: flex;
  bottom: 1px;
  left: 22vw;
  width: 61vw;
  height: 29vh;
}

.passiveSlot {
  width: 18vw;
  height: 30vh;
  position: absolute;
  display: flex;
  bottom: 16vh;
  z-index: 10
}

.passiveCircle {
  position: absolute;
  background-color: purple;
  top: 20vh;
  left: 0;
}


.equipmentSlot {
  position: relative;
  display: flex;
  left: 0;
  bottom: -2vh;
  width: 18vw;
  height: 15vh;
  z-index: 10;
}

.equipment {
  position: absolute;
  left: 0;
  z-index: 2;
  line-height: 350%;
}

.bg-image {
  background: url("/backgrounds/game_background.png");
  height: 100%;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
}

.btn {
  background: linear-gradient(0deg, rgb(126, 82, 15) 0%, rgba(251, 75, 2, 1) 100%);
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
  box-shadow: -7px -7px 20px 0px rgba(255, 255, 255, 0.9), -4px -4px 5px 0px rgba(255, 255, 255, 0.9),
  7px 7px 20px 0px rgba(0, 0, 0, 0.2), 4px 4px 5px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.btn:before {
  height: 0%;
  width: 2px;
}

.btn:after {
  width: 0%;
  height: 2px;
}

.btn:hover {
  color: rgba(251, 75, 2, 1);
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
  box-shadow: -7px -7px 20px 0px rgba(255, 255, 255, 0.9), -4px -4px 5px 0px rgba(255, 255, 255, 0.9),
  7px 7px 20px 0px rgba(0, 0, 0, 0.2), 4px 4px 5px 0px rgba(0, 0, 0, 0.3);
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
