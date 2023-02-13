<template>
  <div class="bg-image">
    <!-----------------------------------------------DIE ANDEREN SPIELER--------------------------------------------------------->
    <header class="table-wrapper">
      <table>
        <tr>
          <td
            v-for="player in playerDaten.filter(
              (player) => player.username !== this.username
            )"
            :key="player.username"
          >
            <championCard
              v-if="player.champion !== null"
              class="playerChampions"
              @click="
                pickPlayer(player.username, this.messageActivitysUsable.players)
              "
              :class="{ actualPlayer: player.username === this.currentPlayer }"
              :usable="
                containsId(player.username, this.messageActivitysUsable.players)
              "
              :isGame="true"
              :health="player.currentHp"
              :name="player.username"
              :championName="player.champion.name"
              :handcardNum="player.cardCount"
              :identity="player.identity"
              :equipment="player.equipment"
              :passiveEffect="player.passiveEffect"
              :activeSkills="player.champion.activeSkills"
              :passiveSkills="player.champion.passiveSkills"
            />
          </td>
        </tr>
      </table>
    </header>

    <!-----------------------------------------------DIE SPIELERGEBNISSE--------------------------------------------------------->

    <result-page
      v-if="this.playerSummarize.length !== 0"
      :users="this.playerSummarize"
      class="playerSummarizeStyle"
    />

    <!-----------------------------------------------DER LOGBUTTON--------------------------------------------------------->

    <div class="logClass">
      <button class="logBtn btn" @click="logOpen = !logOpen">
        <span>Log</span>
      </button>
      <div class="logTextArea" v-if="this.logOpen">
        <p v-html="logTextWithLineBreaks"></p>
      </div>
    </div>

    <!-----------------------------------------------DER SPIELER --------------------------------------------------------->

    <div class="player">
      <player-card
        :name="this.username"
        :championName="this.findPlayer(this.username).champion.name"
        :health="this.findPlayer(username).currentHp"
        :identity="this.findPlayer(this.username).identity"
        :messageActivitysUsable="this.messageActivitysUsable"
        :activeSkills="this.findPlayer(this.username).champion.activeSkills"
        :passiveSkills="this.findPlayer(this.username).champion.passiveSkills"
        :class="{ actualPlayer: this.username === this.currentPlayer }"
        @skillUsed="useSkill"
      />
    </div>

    <!-----------------------------------------------DIE DELAYED EFFEKTE & EQUIPMENT--------------------------------------------------------->

    <div class="passivePosNegSlot">
      <div class="passiveSlot">
        <table>
          <tr>
            <td
              v-for="(passive, j) in playerDelayedEffect"
              :key="passive.id"
              class="passiveCircle"
              :style="{ left: j * 3.5 + 'vw' }"
            >
              <delayedeffect-component :diameter="7" />
            </td>
          </tr>
        </table>
      </div>

      <div class="equipmentSlot">
        <table>
          <tr v-for="(equip, i) in playerEquipment" :key="equip.id">
            <td>
              <div class="equipment" :style="{ bottom: 15 - i * 8 + 'vh' }">
                <equipment-component
                  widthProp="18"
                  heightProp="6.5"
                  :name="getCard(equip).name"
                  :description="getCard(equip).description"
                  fontProp="2"
                />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-----------------------------------------------DIE HANDKARTEN--------------------------------------------------------->

    <div class="handCardSlot">
      <div class="cardContainer">
        <div
          v-for="(card, i) in this.playerCards"
          :key="i"
          :class="[{ 'not-first-card': i !== 0 }, 'not-last-card']"
          :style="{
            'margin-left': calculateMarginLeft(this.playerCards.length, i),
          }"
          @mouseenter="hoverStart(getCard(card))"
          @mouseleave="hoverEnd(getCard(card))"
        >
          <play-card
            class="playCard"
            :class="{ cardUsedStyle: containsId(card, this.cardsPicked) }"
            :usable="containsId(card, this.messageActivitysUsable.cardsId)"
            @click="useCard(card, this.messageActivitysUsable.cardsId)"
            :name="getCard(card).name"
            :description="getCard(card).description"
            :identity="null"
            :symbol="getCard(card).symbol"
            :value="getCard(card).point"
          />
        </div>
      </div>
    </div>

    <button class="testBtn" @click="printSchnittstellen()">TEST</button>

    <!-----------------DIE KARTEN AUF DEM TISCH UND DER CONFIRM/CANCEL BUTTON--------------------------------------------------------->

    <div class="tablePileSlot">
      <div class="tableContainer">
        <div
          v-for="(entry, i) in this.tablePile"
          :key="i"
          :class="[{ 'not-first-card': i !== 0 }, 'not-last-card']"
          :style="{
            'margin-left': calculateMarginLeft(this.tablePile.length, i),
          }"
          @mouseenter="hoverStart(getCard(entry.cardId))"
          @mouseleave="hoverEnd(getCard(entry.cardId))"
        >
          <play-card
            class="playCard"
            :name="getCard(entry.cardId).name"
            :description="getCard(entry.cardId).description"
            :usable="false"
            :identity="entry.playerName"
            :symbol="getCard(entry.cardId).symbol"
            :value="getCard(entry.cardId).value"
          />
        </div>
      </div>

      <div
        v-if="cardUsed"
        class="confirmB"
        @click="confirm()"
        :class="{
          usableClass: checkConfirmStatus(),
          notUsableClass: !checkConfirmStatus(),
        }"
      >
        <p>Confirm</p>
      </div>
      <button v-if="cardUsed" class="cancelB" @click="cancel()">Cancel</button>
    </div>

    <!-----------------------------------------------DER ZIEHSTAPEL--------------------------------------------------------->

    <div class="drawPile" v-if="this.drawPile.length > 0"></div>

    <!-----------------------------------------------DER ABLEGESTAPEL--------------------------------------------------------->

    <div class="discardPile" v-if="this.discardPile.length > 0">
      <play-card
        :name="getCard(this.discardPile[this.discardPile.length - 1]).name"
        :description="
          getCard(this.discardPile[this.discardPile.length - 1]).description
        "
        :identity="null"
        :symbol="getCard(this.discardPile[this.discardPile.length - 1]).symbol"
        :value="getCard(this.discardPile[this.discardPile.length - 1]).point"
      />
      <div class="discardPileOverlay"></div>
    </div>

    <!----------------------------------------DER BUTTON DER DIE RUNDE BEENDET----------------------------------------------->

    <button class="endTurn" @click="endTurn()">End Turn</button>

    <!----------------------------------------Der Alarm der den Spieler einen tippt gibt was er machen soll----------------------------------------------->

    <transition name="notice-Animation">
      <div class="notice-message" v-if="showNotice">{{ this.notice }}</div>
    </transition>

    <!----------------------------------------DER TIMER----------------------------------------------->

    <div class="progress-container">
      <progress ref="progress" value="100" max="100">100%</progress>
    </div>
    <button class="start-Progressbar" @click="startProgressbar">START</button>
    <button class="interrupt-Progressbar" @click="pause">PAUSE/RESUME</button>
  </div>
</template>

<script>
import championCard from "./ChampionCard.vue";
import equipmentComponent from "../components/blockWithDescription.vue";
import DelayedeffectComponent from "../components/DelayedeffectComponent.vue";
import playerCard from "./PlayerChampionCard.vue";
import resultPage from "../components/Statement.vue";
import playCard from "./PlayCard.vue";
import { useGameStore } from "@/stores/game";
import gameService from "@/services/gameService";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useLobbyStore } from "@/stores/lobby";
import { useUserStore } from "@/stores/user";
import resourceService from "@/services/resourceService";

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
  data() {
    return {
      /*---------- WEBSOCKET ----------*/
      stompClient: null,
      status: false, //boolean um zu prüfen ob erst eine private websocket gesendet wurde falls ja wird es auf true gesetzt und der nächste public websocket wird ignoriert -> wird gebraucht für cardmovemessage
      playerSummarize: [], // die Schnittstelle für die Ergebnisse
      messageActivitysUsable: {
        cardsId: [],
        players: [],
        skillsID: [],
        minCard: 0,
        maxCard: 0,
        minPlayer: 0,
        maxPlayer: 0,
        needsConfirm: true,
        reason:
          "Alles was der Spieler einsetzen kann: hier nur die Karten und skills mit den Ids",
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
          passiveEffect: [],
        },
      ], // die Schnittstelle um die Daten aller Spieler zu aktualisieren
      cardMoveMessage: {
        source: "-",
        destination: "-",
        count: 0,
        cardsId: [],
      }, // die Schnittstelle um eine Karte zu bewegen

      /*---------- ANIMATION PROGRESSBAR ----------*/
      paused: false,
      animation: null,

      /*---------- NOTICE BOX ----------*/
      notice: "",
      showNotice: false,

      /*---------- CONFIRM BUTTON ----------*/
      cardUsed: false, // wird genutzt um confirm und cancel button anzuzeigen wenn eine Karte verwendet wurde

      /*---------- ALLGEMEINE DATEN FÜR GAME ----------*/
      lobbyId: Number, //die LobbyId vom game wird mitgegeben
      backgroundImage: "@/assets/backgrounds/game_background.png", // backgroundimage
      timerDelay: 1000, // der delay für karten hover
      currentPlayer: "", // bekommen wir von websocket
      cards: [],
      gameDuration: 3000000,

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
      cardsPicked: [], // die Karten die der Spieler ausgewählt hat
      playerPicked: [], // ein Array das alle Spieler die ausgewählt wurde enthält

      /*---------- KARTEN STAPEL ----------*/
      tablePile: [], // der Stapel für die gerade ausgespielten Karten
      discardPile: [], // der AblegeStapel
      drawPile: [], // der Ziehstapel

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
        passiveEffect: [],
      },
    };
  },
  components: {
    championCard,
    equipmentComponent,
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
    getHealth(username) {
      return this.findPlayer(username).currentHp;
    },

    printSchnittstellen() {
      console.log(
        "___________________________________playerSummarize___________________________________"
      );
      console.log(this.playerSummarize);
      console.log(
        "___________________________________messageActivitysUsable___________________________________"
      );
      console.log(this.messageActivitysUsable);
      console.log(
        "___________________________________playerDaten___________________________________"
      );
      console.log(this.playerDaten);
      console.log(
        "___________________________________cardMoveMessage___________________________________"
      );
      console.log(this.cardMoveMessage);
      console.log(
        "___________________________________KARTEN VON PLAYER___________________________________"
      );
      console.log(this.playerCards);
    },

    //--------------------------------- AXIOS ----------------------------------------------------

    //alle Karten holen initialisieren
    async initData() {
      console.log(
        "----------------------------------- INIT DATA --------------------------------"
      );
      this.messageActivitysUsable = {
        cardsId: [],
        players: [],
        skillsID: [],
        minCard: 0,
        maxCard: 0,
        minPlayer: 0,
        maxPlayer: 0,
        needsConfirm: true,
        reason: "",
      };
      await resourceService.getCards().then(
        (response) => {
          this.cards = response.data;
          console.log("ALLE KARTEN");
          console.log(this.cards);
        },
        (error) => {
          console.log(error);
        }
      );
    },

    //wenn der Spieler auf eine Karte drückt
    async useCard(id, searchArray) {
      console.log(
        "---------------------------------- USE CARD -----------------------------------"
      );
      if (searchArray === null) console.log("search array ist null");
      console.log("useCard:   id-" + id);
      console.log("searchArray: ");
      console.log(searchArray);
      console.log("cardsPicked: ");
      console.log(this.cardsPicked);
      console.log("messageActivitysUsable: ");
      console.log(this.messageActivitysUsable);
      console.log("playerCards: ");
      console.log(this.playerCards);
      let count = this.cardsPicked.length;

      if (this.containsId(id, this.cardsPicked)) {
        //prüft ob karte bereits ausgewählt wurde falls ja wird es nicht mehr ausgewählt
        this.cardsPicked = this.cardsPicked.filter((card) => card !== id);
        if (this.cardsPicked.length < this.messageActivitysUsable.minCard)
          this.cardUsed = false;
      } else if (
        this.containsId(id, searchArray) &&
        count < this.messageActivitysUsable.maxCard &&
        !this.containsId(id, this.cardsPicked)
      ) {
        for (let i = 0; i < this.playerCards.length; i++) {
          if (this.playerCards[i] === id) {
            this.cardsPicked.push(id);
            if (this.cardsPicked.length >= this.messageActivitysUsable.minCard)
              this.cardUsed = true;
            break;
          }
        }
      }
      console.log("messageActivitysUsablee");
      console.log(this.messageActivitysUsable);
      count = this.cardsPicked.length;
      if (
        count >= this.messageActivitysUsable.minCard &&
        count <= this.messageActivitysUsable.maxCard &&
        !this.messageActivitysUsable.needsConfirm
      ) {
        console.log("axios call wird aufgerufen useCard");
        this.messageActivitysUsable = {
          cardsId: [],
          players: [],
          skillsID: [],
          minCard: 0,
          maxCard: 0,
          minPlayer: 0,
          maxPlayer: 0,
          needsConfirm: true,
          reason: "",
        };
        await gameService.useCard(this.lobbyId, this.cardsPicked).then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },
    //wenn der Spieler auf einen Spieler drückt
    async pickPlayer(name, searchArray) {
      console.log(
        "---------------------------------------------- PICK PLAYER----------------------------------"
      );
      console.log("name: " + name);
      console.log("searchArray: ");
      console.log(searchArray);
      console.log("playerPicked: ");
      console.log(this.playerPicked);
      console.log("messageActivitysUsable: ");
      console.log(this.messageActivitysUsable);

      if (searchArray === null) searchArray = [];
      let count = this.playerPicked.length;
      if (
        this.containsId(name, searchArray) &&
        count < this.messageActivitysUsable.maxPlayer &&
        !this.containsId(id, this.playerPicked)
      ) {
        for (let i = 0; i < searchArray.length; i++) {
          if (name === searchArray[i]) {
            this.playerPicked.push(name);
            break;
          }
        }
      }
      if (
        count >= this.messageActivitysUsable.minPlayer &&
        count <= this.messageActivitysUsable.maxPlayer &&
        count > 0
      ) {
        this.messageActivitysUsable = {
          cardsId: [],
          players: [],
          skillsID: [],
          minCard: 0,
          maxCard: 0,
          minPlayer: 0,
          maxPlayer: 0,
          needsConfirm: true,
          reason: "",
        };
        await gameService.pickPlayer(this.lobbyId, this.playerPicked).then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },

    //wenn der Spieler seine Runde beenden will muss noch geprüft werden, ob er genug karten / leben hat
    async endTurn() {
      console.log(
        "------------------------------------------ END TURN --------------------------------------------------"
      );
      this.messageActivitysUsable = {
        cardsId: [],
        players: [],
        skillsID: [],
        minCard: 0,
        maxCard: 0,
        minPlayer: 0,
        maxPlayer: 0,
        needsConfirm: true,
        reason: "",
      };
      await gameService.end(this.lobbyId).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    },

    //wenn der Spieler einen Skill einsetzt
    async useSkill(skillId) {
      console.log(
        "-------------------------------------------- USE SKILL----------------------------------------"
      );
      console.log("messageActivitysUsable: ");
      console.log(this.messageActivitysUsable);
      console.log("useSkill:   id-" + skillId);
      if (this.containsId(skilldId, this.messageActivitysUsable.skillsID)) {
        this.messageActivitysUsable = {
          cardsId: [],
          players: [],
          skillsID: [],
          minCard: 0,
          maxCard: 0,
          minPlayer: 0,
          maxPlayer: 0,
          needsConfirm: true,
          reason: "",
        };
        await gameService.useSkill(this.lobbyId, skillId).then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },

    //wenn der confirm button gedrückt wird
    async confirm() {
      console.log(
        "----------------------------------------------- CONFIRM --------------------------------------------"
      );
      console.log("cardsPicked: ");
      console.log(this.cardsPicked);
      console.log("messageActivitysUsable: ");
      console.log(this.messageActivitysUsable);

      let count = this.cardsPicked.length;

      if (
        count >= this.messageActivitysUsable.minCard &&
        count <= this.messageActivitysUsable.maxCard &&
        this.messageActivitysUsable.needsConfirm
      ) {
        this.messageActivitysUsable = {
          cardsId: [],
          players: [],
          skillsID: [],
          minCard: 0,
          maxCard: 0,
          minPlayer: 0,
          maxPlayer: 0,
          needsConfirm: true,
          reason: "",
        };
        await gameService.useCard(this.lobbyId, this.cardsPicked).then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
        this.messageActivitysUsable = null;
      }
    },

    //wenn der cancel button gedrückt wird
    async cancel() {
      console.log(
        "-------------------------------------------- CANCEL --------------------------------------------"
      );
      console.log("cardsPicked: ");
      console.log(this.cardsPicked);
      console.log("tablePile: ");
      console.log(this.tablePile);
      console.log("playerPicked: ");
      console.log(this.playerPicked);

      this.cardUsed = false;
      this.cardsPicked.splice(0, this.cardsPicked.length);
      this.playerPicked.splice(0, this.playerPicked.length);
      await gameService.cancel(this.lobbyId).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    },

    //-------------------------------- WEBSOCKET ---------------------------------------------------
    connect() {
      let socket = new SockJS("http://localhost:8080/updates");
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, (frame) => {
        console.log("Connected to Game " + frame);

        //der private connection
        this.stompClient.subscribe(
          "/games/" + this.lobbyId + "/" + this.userStore.getUser.username,
          (response) => {
            console.log(JSON.parse(response.body));
            this.gameStore.setGameData(JSON.parse(response.body));
            this.playerTurnSetup();
          }
        );

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
    playerTurnSetup() {
      console.log("PRIVATE MESSAGE");
      if (this.gameStore.getGameData.messageType === "HIGHLIGHT") {
        this.messageActivitysUsable = this.gameStore.getGameData.payload;
        this.showNotice = true;
        this.notice = this.messageActivitysUsable.reason;
        this.needsConfirm = this.messageActivitysUsable.needsConfirm;
        this.startProgressbar();
        console.log(" PRIVATE HIGHLIGHT aktiviert");
        console.log(this.messageActivitysUsable);
      } else if (this.gameStore.getGameData.messageType === "CARD_MOVE") {
        this.cardMoveMessage = this.gameStore.getGameData.payload;
        this.status = true;
        console.log(" PRIVATE CARDMOVE aktiviert");
        console.log(this.cardMoveMessage);
        this.updateCardMoveMessage();
      }
    },

    //der setup für public connection
    gameSetup() {
      if (this.status) {
        this.status = false;
        return;
      }
      console.log("PUBLIC MESSAGE");
      if (this.gameStore.getGameData.messageType === "UPDATE_GAME") {
        this.playerDaten = this.gameStore.getGameData.payload;
        console.log(" PUBLIC UPDATE_GAME aktiviert");
        console.log(this.playerDaten);
      } else if (this.gameStore.getGameData.messageType === "CARD_MOVE") {
        this.cardMoveMessage = this.gameStore.getGameData.payload;
        console.log(" PUBLIC CARD_MOVE aktiviert");
        console.log(this.cardMoveMessage);
      } else if (this.gameStore.getGameData.messageType === "LOG") {
        console.log(" PUBLIC LOG aktiviert");
        this.logText += "\n" + this.gameStore.getGameData.payload.message;
        console.log(this.gameStore.getGameData.payload);
        console.log(this.logText);
      } else if (this.gameStore.getGameData.messageType === "GAME_END") {
        this.playerSummarize = this.gameStore.getGameData.payload;
        console.log(" PUBLIC GAME_END aktiviert");
        console.log(this.playerSummarize);
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
      if (length >= 10) margin = 7;
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
      for (let i = 0; i < searchArray.length; i++) {
        if (searchArray[i] === id) return true;
      }
      return false;
    },

    //TODO: MUSS ÜBERARBEITET WERDEN
    checkConfirmStatus() {
      console.log("checkConfirm Status");
      if (
        this.playerPicked.length < this.messageActivitysUsable.minPlayer ||
        this.tablePile.length < this.messageActivitysUsable.minCard
      )
        return false;
      return true;
    },

    //TODO: MUSS ÜBERARBEITET WERDEN
    updateCardMoveMessage() {
      console.log("updateCardMoveMessage");
      this.showNotice = !this.showNotice;
      //1. wir entfernen die Karten.
      //erst prüfen ob es eines der Stapeln ist
      //Wenn es auch nicht da ist prüfe ob es der Spieler seine equipment / passive ist

      if (this.cardMoveMessage.source === "discardPile") {
        for (let i = 0; i < this.cardMoveMessage.cardsId.length; i++)
          this.discardPile.pop();
      } else if (this.cardMoveMessage.source === "drawPile") {
        for (let i = 0; i < this.cardMoveMessage.cardsId.length; i++)
          this.drawPile.pop();
      } else if (this.cardMoveMessage.source === "tablePile") {
        for (let i = 0; i < this.cardMoveMessage.cardsId.length; i++)
          this.tablePile.pop();
      } else if (this.cardMoveMessage.source === "equipment-" + this.username) {
        for (let j = 0; j < this.cardMoveMessage.cardsId.length; j++) {
          this.playerEquipment = this.playerEquipment.filter(
            (card) => card !== this.cardMoveMessage.cardsId[j]
          );
        }
      } else if (
        this.cardMoveMessage.source ===
        "delayedEffect-" + this.username
      ) {
        for (let j = 0; j < this.cardMoveMessage.cardsId.length; j++) {
          this.playerDelayedEffect = this.playerDelayedEffect.filter(
            (card) => card !== this.cardMoveMessage.cardsId[j]
          );
        }
      } else {
        for (let i = 0; i < this.playerDaten.length; i++) {
          if (this.playerDaten[i].username === this.cardMoveMessage.source) {
            this.playerDaten[i].cardCount -= this.cardMoveMessage.count;
            if (this.cardMoveMessage.source === this.username) {
              for (let j = 0; j < this.cardMoveMessage.cardsId.length; j++) {
                this.playerCards = this.playerCards.filter(
                  (card) => card !== this.cardMoveMessage.cardsId[j]
                );
              }
            }
          }
        }
      }
      //2. wir fügen die Karte nun dahin wohin sie hingehört ein
      if (this.cardMoveMessage.destination === "discardPile") {
        for (let i = 0; i < this.cardMoveMessage.cardsId.length; i++) {
          this.discardPile.push(this.cardMoveMessage.cardsId[i]);
        }
      } else if (this.cardMoveMessage.destination === "drawPile") {
        for (let i = 0; i < this.cardMoveMessage.cardsId.length; i++)
          this.drawPile.push(this.cardMoveMessage.cardsId[i]);
      } else if (this.cardMoveMessage.destination === "tablePile") {
        for (let i = 0; i < this.cardMoveMessage.cardsId.length; i++)
          this.tablePile.push({
            cardId: this.cardMoveMessage.cardsId[i],
            playerName: this.cardMoveMessage.source,
          });
      } else if (
        this.cardMoveMessage.destination ===
        "equipment-" + this.username
      ) {
        for (let j = 0; j < this.cardMoveMessage.cardsId.length; j++) {
          this.playerEquipment.push(this.cardMoveMessage.cardsId[j]);
        }
      } else if (
        this.cardMoveMessage.destination ===
        "delayedEffect-" + this.username
      ) {
        for (let j = 0; j < this.cardMoveMessage.cardsId.length; j++) {
          this.playerDelayedEffect.push(this.cardMoveMessage.cardsId[j]);
        }
      } else {
        for (let i = 0; i < this.playerDaten.length; i++) {
          if (
            this.cardMoveMessage.destination === this.playerDaten[i].username
          ) {
            this.playerDaten[i].cardCount += this.cardMoveMessage.count;
            if (this.cardMoveMessage.destination === this.username) {
              for (let j = 0; j < this.cardMoveMessage.cardsId.length; j++) {
                this.playerCards.push(this.cardMoveMessage.cardsId[j]);
              }
            }
          }
        }
      }
    },

    /*sucht die Karte mit der bestimmten id */
    getCard(id) {
      for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].id === id) return this.cards[i];
      }
    },

    //sucht den Spieler mit der bestimmten id
    findPlayer(id) {
      for (let i = 0; i < this.playerDaten.length; i++) {
        if (id === this.playerDaten[i].username) return this.playerDaten[i];
      }
      return this.defaultPlayer;
    },

    //startet den Timer
    startProgressbar() {
      console.log("startProgress");
      this.animation = this.$refs.progress.animate(
        [{ width: "100%" }, { width: "0%" }],
        {
          duration: this.gameDuration,
          easing: "ease-in",
          fill: "forwards",
        }
      );
      this.animation.onfinish = () => {
        this.endTurn();
      };
      this.$refs.progress.style.animation =
        "progress-animation 20s ease-in forwards";
    },
  },
};
</script>

<style scoped>
.testBtn {
  width: 5vw;
  height: 5vw;
  background-color: pink;
  position: absolute;
  right: 15vw;
  bottom: 50px;
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
    width: 0%;
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
  background-color: red;
  position: absolute;
  right: 1vw;
  bottom: 46vh;
}

.cardUsedStyle {
  transform: translateY(-3vh);
}

.endTurn {
  position: absolute;
  right: 1vw;
  width: 10vw;
  height: 5vh;
  bottom: 40vh;
  background-color: blueviolet;
}

.playerSummarizeStyle {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
}

.player {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.actualPlayer {
  border: solid red 5px;
}

.logBtn {
  width: 7vw;
  height: 5vh;
  color: #ffffff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: "Lato", sans-serif;
  font-weight: 500;
  font-size: 3vh;

  right: 0;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
}

.logTextArea {
  position: relative;
  width: 20vw;
  right: 0;
  top: 5vh;
  height: 38vh;
  background-color: rgb(241, 244, 92);
  color: black;
  overflow-y: scroll;
  word-wrap: break-word;
}

.logClass {
  width: 20vw;
  height: 45vh;
  position: absolute;
  right: 0;
  top: 0;
  overflow: auto;
}

.table-wrapper {
  display: flex;
  justify-content: center;
  width: 90vw;
  top: 10px;
  position: relative;
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

.cardContainer {
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
.clickCardMoveMessage {
  position: absolute;
  left: 19vw;
  bottom: 10vw;
  width: 5vw;
  height: 5vh;
  background-color: red;
  cursor: pointer;
}

.drawPile {
  position: absolute;
  left: 1vw;
  bottom: 32vh;
  border-radius: 1rem;
  width: 10vw;
  height: 29vh;
  background-image: url(../assets/card/pictures/shield.png);
}
.discardPile {
  position: absolute;
  left: 13vw;
  bottom: 32vh;
  border-radius: 1rem;
  width: 10vw;
  height: 29vh;
  background-color: pink;
}

.discardPileOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
}

.playerChampions {
  width: 10vw;
  height: 29vh;
  margin-left: 2vh;
  margin-right: 2vh;
}

.cardOverlay {
  width: 4vw;
  height: 4vw;
  background-color: red;
}

.information {
  background-color: rgb(54, 164, 215);
  height: 22vh;
  width: 10vw;
  position: absolute;
  right: 5px;
  bottom: 18vw;
}

.information p {
  border: solid yellow 1px;
}

.playerChampion {
  position: absolute;
  right: 5px;
  bottom: 5px;
  width: 11.5vw;
  height: 35vh;
  background-color: grey;
}

.skillContainer {
  position: absolute;
  display: flex;
  right: 0;
  bottom: 1vh;
}

.skill {
  border-radius: 0.5rem;
  transition: 0.2s;
  width: 13vw;
  left: 5px;
  margin-bottom: 1vh;
  text-align: center;
  height: 5vh;
  align-self: center;
  border: 2px solid red;
}
.skillDescription {
  position: relative;
  top: -6.5vw;
  width: 13vw;
  height: 5vw;
  background-color: green;
  z-index: 3;
}

.skill:hover + .skillDescription {
  display: block;
}

.cancelB {
  width: 7vw;
  height: 6vh;
  background-color: pink;
  position: absolute;
  left: 50vw;
  border-radius: 10px;
  bottom: 0;
}
.confirmB {
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

.usableClass {
  border: solid yellow 5px;
  cursor: pointer;
}

.notUsableClass {
  border: solid black 5px;
}

.playCard {
  border-radius: 1rem;
  box-shadow: 3px 3px 12px 2px rgba(black, 0.6);
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
  overflow: auto;
  position: absolute;
  bottom: 16vh;
}

.passiveCircle {
  position: relative;
  background-color: purple;
  top: 20vh;
}

.passiveDescription {
  position: relative;
  top: -13vw;
  width: 18vw;
  height: 13vw;
  background-color: green;
  z-index: 3;
}

.equipmentSlot {
  position: absolute;
  display: flex;
  left: 0;
  bottom: 0;
  width: 18vw;
  height: 15vh;
}
.equipment {
  position: absolute;
  left: 0;

  line-height: 350%;
}
.equipmentButton {
  width: 18vw;
  height: 6.5vh;
  background-color: green;
  border-radius: 1rem;
  transition: 0.2s;
}
.equipmentDescription {
  position: relative;
  top: -15.5vw;
  width: 18vw;
  height: 13vw;
  background-color: green;
  z-index: 3;
}

.equipmentSlot:hover + .overlayDescription {
  display: block;
}

.bg-image {
  background: url("@/assets/backgrounds/game_background.png");
  height: 100%;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
}

.btn {
  background: linear-gradient(
    0deg,
    rgb(126, 82, 15) 0%,
    rgba(251, 75, 2, 1) 100%
  );
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
  box-shadow: -7px -7px 20px 0px rgba(255, 255, 255, 0.9),
    -4px -4px 5px 0px rgba(255, 255, 255, 0.9),
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
  box-shadow: -7px -7px 20px 0px rgba(255, 255, 255, 0.9),
    -4px -4px 5px 0px rgba(255, 255, 255, 0.9),
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
