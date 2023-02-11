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
export default {
  data() {
    return {
      slots: [],
      gameModes: [],
      currentModeName: "",
      currentOwner: "Holder",
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
          this.$router.push({ path: "./championselection" });
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async changeMode(newMode) {
      await lobbyService.changeMode(this.lobbyId, this.currentModeId).then(
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
      this.lobbyId = this.lobbyStore.getLobbyData.id;
      this.currentModeName = this.lobbyStore.getLobbyData.mode;
      this.currentOwner = this.lobbyStore.getLobbyData.owner;
      this.isLobbyOwner =
        this.currentOwner == this.userStore.getUserData.username;
      this.slots = this.lobbyStore.getLobbyData.seats;
    },
    connect() {
      let socket = new SockJS("http://localhost:8080/updates");
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, (frame) => {
        console.log("Connected to " + frame);
        this.stompClient.subscribe("/lobbies/" + this.lobbyId, (response) => {
          console.log(JSON.parse(response.body));
          this.lobbyStore.setLobbyData(JSON.parse(response.body));
          this.lobbySetup();
        });
      });
    },
    disconnect() {
      this.stompClient.disconnect();
    },
  },
  created() {
    this.initModes();
    this.lobbySetup();
  },
  mounted() {
    this.connect();
  },
  unmounted() {
    this.disconnect();

    this.leave();
  },
};
</script>

<style scoped>
.bg-image {
  background: url("@/assets/backgrounds/lobby_background.png");
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
