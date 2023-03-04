<template>
  <div class="bg-image">
    <Mode-selection
      v-if="isModeShown"
      @close:Mode="toggleModeSelection"
      @confirm:Mode="changeMode"
      :isLobbyOwner="this.isLobbyOwner"
      :modes="this.gameModes"
      :currentModeId="this.currentModeId"
    />

    <div class="slotStyle">
      <SlotView
        :lobbyId="this.lobbyId"
        :lobbyOwner="this.currentOwner"
        :isLobbyOwner="this.isLobbyOwner"
        :slotsProp="this.slots"
        :gameModeName="this.currentModeName"
        @confirm:Mode="changeMode"
        @update:Mode="toggleModeSelection"
        @update:leave="leave"
        @open:game="start"
        @update:bot="addBot"
        @update:seat="changeSeat"
      />
    </div>
  </div>
</template>

<script>
import SlotView from "../components/SlotField.vue";
import ModeSelection from "../components/ModeSelection.vue";
import lobbyService from "@/services/lobbyService";
import resourceService from "@/services/resourceService";
import { useLobbyStore } from "@/stores/lobby";
import { useUserStore } from "@/stores/user";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import service from "@/services/service";
export default {
  data() {
    return {
      slots: [],
      gameModes: [],
      currentModeName: "",
      currentOwner: "",
      currentModeId: null,
      lobbyId: 0,
      isModeShown: false,
      isLobbyOwner: true,
      stompClient: null,
      lobbyData: [],
    };
  },
  setup() {
    const lobbyStore = useLobbyStore();
    const userStore = useUserStore();

    return { lobbyStore, userStore };
  },
  components: {
    SlotView,
    ModeSelection,
  },
  methods: {
    async addBot() {
      await lobbyService.addBot(this.lobbyId).then(
        (response) => {
          console.log(response);
          console.log("add Bot");
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async start() {
      await lobbyService.start(this.lobbyId).then(
        (response) => {
          console.log(response);
          console.log("start");
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async changeMode(newMode) {
      await lobbyService.changeMode(this.lobbyId, newMode).then(
        (response) => {
          this.currentModeId = newMode;
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    toggleModeSelection() {
      this.isModeShown = !this.isModeShown;
    },
    async leave() {
      await lobbyService.leave(this.lobbyId).then(
        (response) => {
          this.$router.push({ path: "./lobbyoverview" });
          console.log(response);
          console.log("leave");
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async changeSeat(newSeatId) {
      await lobbyService.changeSeat(this.lobbyId, newSeatId).then(
        (response) => {
          console.log(response);
          console.log("change to " + newSeatId);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async initModes() {
      await resourceService.getModes().then(
        (response) => {
          this.gameModes = response.data;
          this.currentModeId = 0;
          console.log(response.data);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    lobbySetup() {
      this.lobbyId = this.lobbyStore.getLobby.id;
      if(this.lobbyId != "undefined"){
        localStorage.setItem("lobbyId", this.lobbyId);
      }
      console.log(this.lobbyStore.getLobby.id);
      this.currentModeName = this.lobbyStore.getLobby.mode;
      console.log(this.currentModeName);
      this.currentOwner = this.lobbyStore.getLobby.owner;
      this.isLobbyOwner = this.currentOwner == this.userStore.getUser.username;
      this.slots = this.lobbyStore.getLobby.seats;
    },
    connect() {
      this.stompClient.connect({}, (frame) => {
        console.log("Connected to " + frame);
        this.stompClient.subscribe("/lobbies/" + this.lobbyId, (response) => {
          let lobbyData = JSON.parse(response.body);
          console.log(lobbyData);
          this.lobbyStore.setLobby(lobbyData);
          this.lobbySetup();
        });
        this.stompClient.subscribe(
          "/lobbies/" + +this.lobbyId + "/" + this.userStore.getUser.username,
          (response) => {
            let readyPhaseData = JSON.parse(response.body);
            console.log(readyPhaseData);
            this.lobbyStore.setChampions(readyPhaseData.champions);
            this.lobbyStore.setIdentity(readyPhaseData.identity);
            this.$router.push({ path: "./championselection" });
          }
        );
      });
    },
    disconnect() {
      this.stompClient.unsubscribe("/lobbies/" + this.lobbyId + "/" + this.userStore.getUser.username);
      this.stompClient.disconnect();
    },
    initStompClient() {
      let socket = new SockJS(service.WS_URL);
      this.lobbyStore.setStompClient(Stomp.over(socket));
      this.stompClient = this.lobbyStore.getStompClient();
    },
  },
  created() {
    this.initModes();
    this.initStompClient();
    this.lobbySetup();
  },
  mounted() {
    this.connect();
  },
  unmounted() {
    this.disconnect();
  },
};
</script>

<style scoped>
.bg-image {
  background: url("/backgrounds/lobby_background.png");
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}
.slotStyle {
  position: relative;
  height: 100%;
  width: 100%;
}

header h1 {
  text-align: center;
}
</style>
