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
              :activeSkills="player.champion.activeSkills"
              :championName="player.champion.name"
              :class="{ actualPlayer: player.username === this.currentPlayer }"
              :currentPlayer="player.isCurrentPlayer"
              :equipment="player.equipment"
              :handcardNum="player.cardCount"
              :health="player.currentHp"
              :identity="player.identity"
              :isGame="true"
              :name="player.username"
              :passiveEffect="player.passiveEffect"
              :passiveSkills="player.champion.passiveSkills"
              :usable="
                containsId(player.username, this.playerConditions.players)
              "
              class="playerChampions"
              @click="pickPlayer(player.username)"
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
      <div v-if="this.logOpen" class="logTextArea">
        <p v-html="logTextWithLineBreaks"></p>
      </div>
    </div>

    <!-----------------------------------------------DER SPIELER --------------------------------------------------------->

    <div class="player">
      <player-card
        :activeSkills="this.findPlayer(this.username).champion.activeSkills"
        :championName="this.findPlayer(this.username).champion.name"
        :class="{ actualPlayer: this.username === this.currentPlayer }"
        :currentPlayer="this.findPlayer(this.username).isCurrentPlayer"
        :health="this.findPlayer(username).currentHp"
        :identity="this.findPlayer(this.username).identity"
        :messageActivitysUsable="this.messageActivitysUsable"
        :name="this.username"
        :passiveSkills="this.findPlayer(this.username).champion.passiveSkills"
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
              :style="{ left: j * 3.5 + 'vw' }"
              class="passiveCircle"
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
              <div :style="{ bottom: 15 - i * 8 + 'vh' }" class="equipment">
                <equipment-component
                  :description="getCard(equip).description"
                  :name="getCard(equip).name"
                  fontProp="2"
                  heightProp="6.5"
                  widthProp="18"
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
            :class="{ cardUsedStyle: containsId(card, this.cardsPicked) }"
            :description="getCard(card).description"
            :identity="null"
            :name="getCard(card).name"
            :symbol="getCard(card).symbol"
            :usable="containsId(card, this.cardConditions.cardIds)"
            :value="getCard(card).point"
            class="playCard"
            @click="useCard(i, card)"
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
            :description="getCard(entry.cardId).description"
            :identity="entry.playerName"
            :name="getCard(entry.cardId).name"
            :symbol="getCard(entry.cardId).symbol"
            :usable="false"
            :value="getCard(entry.cardId).value"
            class="playCard"
          />
        </div>
      </div>

      <button v-if="this.activateConfirm" class="confirmB" @click="confirm()">
        Confirm
      </button>
      <button v-if="this.activateCancel" class="cancelB" @click="cancel()">
        Cancel
      </button>
    </div>

    <!-----------------------------------------------DER ZIEHSTAPEL--------------------------------------------------------->

    <div v-if="this.drawPile.length > 0" class="drawPile"></div>

    <!-----------------------------------------------DER ABLEGESTAPEL--------------------------------------------------------->

    <div v-if="this.discardPile.length > 0" class="discardPile">
      <play-card
        :description="
          getCard(this.discardPile[this.discardPile.length - 1]).description
        "
        :identity="null"
        :name="getCard(this.discardPile[this.discardPile.length - 1]).name"
        :symbol="getCard(this.discardPile[this.discardPile.length - 1]).symbol"
        :value="getCard(this.discardPile[this.discardPile.length - 1]).point"
      />
      <div class="discardPileOverlay"></div>
    </div>

    <!----------------------------------------DER ENDBUTTON----------------------------------------------->

    <button
      v-if="this.messageActivitysUsable.activateEndTurn"
      class="endTurn"
      @click="endTurn()"
    >
      End Turn
    </button>

    <!-------------------------------NOTICE----------------------------------------------->

    <transition name="notice-Animation">
      <div v-if="showNotice" class="notice-message">{{ this.notice }}</div>
    </transition>

    <!----------------------------------------DER TIMER----------------------------------------------->

    <div class="progress-container">
      <progress ref="progress" max="100" value="100">100%</progress>
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
        cardIds: [],
        countCount: [],
        cardPlayerConditions: [
          {
            players: [],
            count: [],
          },
        ],
        skillIds: [],
        skillPlayerConditions: [
          {
            players: [],
            count: [],
          },
        ],
        activateEndTurn: false,
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
        cardIds: [],
      }, // die Schnittstelle um eine Karte zu bewegen

      /*---------- ANIMATION PROGRESSBAR ----------*/
      paused: false,
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
      backgroundImage: "@/assets/backgrounds/game_background.png", // backgroundimage
      timerDelay: 1000, // der delay für karten hover
      currentPlayer: "", // bekommen wir von websocket
      cards: [],
      gameDuration: 1000000,

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
    updateConditions() {
      //wenn Karte ausgewählt keine Skill auswählbar machen
      if (this.cardsPicked.length > 0) {
        this.activateCancel = true;
        this.skillConditions.skillId = [];

        this.cardConditions.cardIds = [...this.messageActivitysUsable.cardIds];
        this.cardConditions.count = [...this.messageActivitysUsable.cardCount];

        console.log(
          "CARDPLAYERCONDITION COUNT: " +
            this.messageActivitysUsable.cardPlayerConditions.length
        );
        console.log(this.cardsPicked[0].cardId);
        //wenn eine Karte ausgewählt ist, Gegner auswählbar machen
        if (this.cardsPicked.length === 1) {
          if (this.cardsPicked[0].cardId === -1) return;

          var id = this.cardsPicked[0].index;
          console.log("HIGHLIGHT: in updateGameConditions");
          console.log(this.messageActivitysUsable);
          console.log("ID: " + id);
          console.log(this.messageActivitysUsable.cardPlayerConditions.length);
          let players =
            this.messageActivitysUsable.cardPlayerConditions[id].players;
          let count =
            this.messageActivitysUsable.cardPlayerConditions[id].count;
          console.log(players);

          this.playerConditions.players = [...players];
          this.playerConditions.players = players.filter(
            (player) => !this.containsId(player, this.playersPicked)
          );
          this.playerConditions.count = [...count];
          this.cardConditions.cardIds = [];
          console.log("ID: " + this.cardConditions.cardIds);
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

        //player abhängig von Skill auswählbar
        id = this.skillPicked.index;
        let players =
          this.messageActivitysUsable.skillPlayerConditions[id].players;
        let count = this.messageActivitysUsable.skillPlayerConditions[id].count;

        this.playerConditions.players = [...players];
        this.playerConditions.count = [...count];
        //wenn weder skill noch karte ausgwählt ist, mach nur skill oder karte auswählbar
      } else {
        this.activateCancel = false;
        this.skillConditions.skillIds = [
          ...this.messageActivitysUsable.skillIds,
        ];
        this.cardConditions.cardIds = [...this.messageActivitysUsable.cardIds];
        this.cardConditions.count = [...this.messageActivitysUsable.cardCount];

        this.playerConditions.players = [];
        this.playerConditions.count = [];
      }

      let playerConfirm = false;
      let cardConfirm = false;
      let skillConfirm = false;

      for (let i = 0; i < this.playerConditions.count.length; i++) {
        if (this.playerConditions.count[i] === this.playersPicked.length) {
          playerConfirm = true;
          break;
        }
      }
      for (let i = 0; i < this.cardConditions.count.length; i++) {
        if (this.cardConditions.count[i] === this.cardsPicked.length) {
          cardConfirm = true;
          break;
        }
      }
      if (this.skillPicked.index !== -1 && this.cardsPicked.length === 0) {
        skillConfirm = true;
      }

      this.activateConfirm = playerConfirm || cardConfirm || skillConfirm;
      console.log("PLAYERPICKED");
      console.log(this.playersPicked);
      console.log("confirm button activated: " + this.activateConfirm);
    },

    resetHighlightMessage() {
      this.messageActivitysUsable = {
        cardIds: [],
        count: [],
        cardPlayerConditions: [
          {
            players: [],
            count: [],
          },
        ],
        skillIds: [],
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

    containsCardId(id) {
      for (let i = 0; i < this.messageActivitysUsable.cardIds.length; i++) {
        if (this.cardConditions.cardIds[i] === id) return true;
      }

      return false;
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
      console.log(
        "___________________________________AUSGEWÄHLTE SPIELER___________________________________"
      );
      console.log(this.playerPicked);
      console.log(
        "___________________________________AUSGEWÄHLTE KARTEN___________________________________"
      );
      console.log(this.cardsPicked);
    },

    //--------------------------------- AXIOS ----------------------------------------------------

    //alle Karten holen initialisieren
    async initData() {
      console.log(
        "----------------------------------- INIT DATA --------------------------------"
      );
      this.resetHighlightMessage();
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
    async useCard(index, id) {
      console.log(
        "---------------------------------- USE CARD -----------------------------------"
      );
      if (this.containsId(id, this.messageActivitysUsable.cardIds)) {
        console.log("karte kann genutzt werden");
        var playerIndexCount = 0;
        for (let i = 0; i < this.playerCards; i++) {
          if (i === index) {
            break;
          }
          if (
            this.containsId(
              this.playerCards[i],
              this.messageActivitysUsable.cardIds
            )
          ) {
            playerIndexCount++;
          }
        }
        this.cardsPicked.push({ cardId: id, index: playerIndexCount });
        this.updateConditions();
      }

      // if (this.containsCardId(id,this.cardsPicked)) {
      //   //prüft ob karte bereits ausgewählt wurde falls ja wird es nicht mehr ausgewählt
      //   this.cardsPicked = this.cardsPicked.filter((card) => card.cardId !== id);
      //   this.cancel();
      //   if (this.cardsPicked.length < this.messageActivitysUsable.minCard)
      //     this.cardUsed = false;
      // } else if (
      //   this.containsId(id, searchArray) &&
      //   count < this.messageActivitysUsable.maxCard &&
      //   !this.containsCardId(id, this.cardsPicked)
      // ) {
      //   for (let i = 0; i < this.playerCards.length; i++) {
      //     if (this.playerCards[i] === id) {
      //       this.cardsPicked.push({index,id});
      //       if (this.cardsPicked.length >= this.messageActivitysUsable.minCard)
      //         this.cardUsed = true;
      //       break;
      //     }
      //   }
      // }
    },
    //wenn der Spieler auf einen Spieler drückt
    async pickPlayer(name) {
      console.log("-----------------PICK PLAYER------------------");
      console.log("this.containsId(name, this.playerConditions.players)");
      console.log(this.containsId(name, this.playerConditions.players));
      if (this.containsId(name, this.playerConditions.players)) {
        console.log("funkt spieler gepusht");
        this.playersPicked.push(name);
        this.updateConditions();
      }
    },
    // console.log(
    //   "---------------------------------------------- PICK PLAYER----------------------------------"
    // );
    // console.log("name: " + name);
    // console.log("searchArray: ");
    // console.log(searchArray);
    // console.log("messageActivitysUsable: ");
    // console.log(this.messageActivitysUsable);

    // if (searchArray === null) searchArray = [];

    // if (this.containsId(name, this.playerPicked)) {
    //   this.playerPicked = this.playerPicked.filter(
    //     (player) => player !== name
    //   );
    //   console.log(this.playerPicked.length);
    // }

    // console.log("playerPicked: ");
    // console.log(this.playerPicked);
    // let count = this.playerPicked.length;
    // console.log("count: " + count);
    // if (
    //   this.containsId(name, searchArray) &&
    //   count < this.messageActivitysUsable.maxPlayer &&
    //   !this.containsId(name, this.playerPicked)
    // ) {
    //   console.log("es wird geadded");
    //   console.log("searchArraylength: " + searchArray.length);
    //   for (let i = 0; i < searchArray.length; i++) {
    //     if (name === searchArray[i]) {
    //       console.log("found: " + name);
    //       this.playerPicked.push(name);
    //       break;
    //     }
    //   }
    // }
    // count = this.playerPicked.length;
    // console.log("count after: " + count);
    // if (
    //   count >= this.messageActivitysUsable.minPlayer &&
    //   count <= this.messageActivitysUsable.maxPlayer &&
    //   count > 0
    // ) {
    //   console.log("REST pick player");
    //   this.resetHighlightMessage();
    //   this.axiosPickPlayer = true;
    //   if (!this.messageActivitysUsable.activateConfirm) {
    //     this.axiosPickPlayer = false;
    //     console.log(
    //       "activateConfirm: " + this.messageActivitysUsable.activateConfirm
    //     );
    //     console.log("axios schicken pickplayer");
    //     await gameService.pickPlayer(this.lobbyId, this.playerPicked).then(
    //       (response) => {
    //         console.log(response);
    //       },
    //       (error) => {
    //         console.log(error);
    //       }
    //     );
    //   }
    // }

    //wenn der Spieler seine Runde beenden will muss noch geprüft werden, ob er genug karten / leben hat
    async endTurn() {
      console.log(
        "------------------------------------------ END TURN --------------------------------------------------"
      );
      this.resetHighlightMessage();
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
    async useSkill(i, skillId) {
      if (this.containsId(skillId, this.skillConditions.skillIds)) {
        this.skillPicked = { skillId: skillId, index: i };
        this.updateConditions();
      }

      // console.log(
      //   "-------------------------------------------- USE SKILL----------------------------------------"
      // );
      // console.log("messageActivitysUsable: ");
      // console.log(this.messageActivitysUsable);
      // console.log("useSkill:   id-" + skillId);

      // if (!this.containsId(skilldId, this.messageActivitysUsable.skillsID)) {
      //   this.resetHighlightMessage();
      //   this.axiosSelectSkill = true;
      //   if (this.messageActivitysUsable.activateConfirm) {
      //     this.axiosSelectSkill = false;
      //     await gameService.useSkill(this.lobbyId, skillId).then(
      //       (response) => {
      //         console.log(response);
      //       },
      //       (error) => {
      //         console.log(error);
      //       }
      //     );
      //   }
      // }
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
        count <= this.messageActivitysUsable.maxCard
      ) {
        this.resetHighlightMessage();
        if (this.axiosUseCard) {
          //array mit Karten Index erstellen
          let cardIndexArray;
          for (let card in this.cardsPicked) {
            cardIndexArray.push(card.cardId);
          }
          await gameService
            .useCard(this.lobbyId, cardIndexArray, this.playersPicked)
            .then(
              (response) => {
                console.log(response);
              },
              (error) => {
                console.log(error);
              }
            );
        } else if (this.axiosSelectSkill) {
          await gameService
            .useSkill(
              this.lobbyId,
              this.skillPicked.skillId,
              this.playersPicked
            )
            .then(
              (response) => {
                console.log(response);
              },
              (error) => {
                console.log(error);
              }
            );
        }
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
      this.resetHighlightMessage();

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
      console.log("versuche dich zu connecten");
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
        this.cardConditions = this.messageActivitysUsable.cardIds;
        this.skillIds = this.messageActivitysUsable.skillIds;
        this.skillPlayerConditions =
          this.messageActivitysUsable.skillPlayerConditions;
        console.log("HIGHLIGHT CARDCOUNT: ");
        console.log(this.messageActivitysUsable.cardCount);

        this.showNotice = true;
        this.notice = this.messageActivitysUsable.reason;
        this.startProgressbar();
        this.updateConditions();
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
      console.log("status: " + this.status);
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
        this.updateCardMoveMessage();
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
      return !(
        this.playerPicked.length < this.messageActivitysUsable.minPlayer ||
        this.tablePile.length < this.messageActivitysUsable.minCard
      );
    },

    //TODO: MUSS ÜBERARBEITET WERDEN
    updateCardMoveMessage() {
      console.log("updateCardMoveMessage");
      this.showNotice = !this.showNotice;
      //1. wir entfernen die Karten.
      //erst prüfen ob es eines der Stapeln ist
      //Wenn es auch nicht da ist prüfe ob es der Spieler seine equipment / passive ist

      if (this.cardMoveMessage.source === "discardPile") {
        for (let i = 0; i < this.cardMoveMessage.cardIds.length; i++)
          this.discardPile.pop();
      } else if (this.cardMoveMessage.source === "drawPile") {
        for (let i = 0; i < this.cardMoveMessage.cardIds.length; i++)
          this.drawPile.pop();
      } else if (this.cardMoveMessage.source === "tablePile") {
        for (let i = 0; i < this.cardMoveMessage.cardIds.length; i++)
          this.tablePile.pop();
      } else if (this.cardMoveMessage.source === "equipment-" + this.username) {
        for (let j = 0; j < this.cardMoveMessage.cardIds.length; j++) {
          this.playerEquipment = this.playerEquipment.filter(
            (card) => card !== this.cardMoveMessage.cardIds[j]
          );
        }
      } else if (
        this.cardMoveMessage.source ===
        "delayedEffect-" + this.username
      ) {
        for (let j = 0; j < this.cardMoveMessage.cardIds.length; j++) {
          this.playerDelayedEffect = this.playerDelayedEffect.filter(
            (card) => card !== this.cardMoveMessage.cardIds[j]
          );
        }
      } else {
        for (let i = 0; i < this.playerDaten.length; i++) {
          if (this.playerDaten[i].username === this.cardMoveMessage.source) {
            this.playerDaten[i].cardCount -= this.cardMoveMessage.count;
            if (this.cardMoveMessage.source === this.username) {
              for (let j = 0; j < this.cardMoveMessage.cardIds.length; j++) {
                this.playerCards = this.playerCards.filter(
                  (card) => card !== this.cardMoveMessage.cardIds[j]
                );
              }
            }
          }
        }
      }
      //2. wir fügen die Karte nun dahin wohin sie hingehört ein
      if (this.cardMoveMessage.destination === "discardPile") {
        for (let i = 0; i < this.cardMoveMessage.cardIds.length; i++) {
          this.discardPile.push(this.cardMoveMessage.cardIds[i]);
        }
      } else if (this.cardMoveMessage.destination === "drawPile") {
        for (let i = 0; i < this.cardMoveMessage.cardIds.length; i++)
          this.drawPile.push(this.cardMoveMessage.cardIds[i]);
      } else if (this.cardMoveMessage.destination === "tablePile") {
        for (let i = 0; i < this.cardMoveMessage.cardIds.length; i++)
          this.tablePile.push({
            cardId: this.cardMoveMessage.cardIds[i],
            playerName: this.cardMoveMessage.source,
          });
      } else if (
        this.cardMoveMessage.destination ===
        "equipment-" + this.username
      ) {
        for (let j = 0; j < this.cardMoveMessage.cardIds.length; j++) {
          this.playerEquipment.push(this.cardMoveMessage.cardIds[j]);
        }
      } else if (
        this.cardMoveMessage.destination ===
        "delayedEffect-" + this.username
      ) {
        for (let j = 0; j < this.cardMoveMessage.cardIds.length; j++) {
          this.playerDelayedEffect.push(this.cardMoveMessage.cardIds[j]);
        }
      } else {
        for (let i = 0; i < this.playerDaten.length; i++) {
          if (
            this.cardMoveMessage.destination === this.playerDaten[i].username
          ) {
            this.playerDaten[i].cardCount += this.cardMoveMessage.count;
            if (this.cardMoveMessage.destination === this.username) {
              for (let j = 0; j < this.cardMoveMessage.cardIds.length; j++) {
                this.playerCards.push(this.cardMoveMessage.cardIds[j]);
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
        this.animation.onfinish = null;
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
