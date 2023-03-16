<template>
  <div class="d-flex justify-center">
    <v-col cols="3" id="left-bar" class="text-center">
      <img :src="'/avatars/avatar' + userStore.getUser.avatarNumber + '.png'" class="avatar"/>
      <v-divider inset></v-divider>
      <div class="text-h4 pa-4">
        <div class="pa-5">
          <v-btn class="button" @click="getLobbies">Refresh Lobby</v-btn>
        </div>
        <span id="text">Join lobby</span>
        <v-text-field
          class="text-field pt-5"
          label="LobbyID"
          v-model="lobbyId"
          variant="outlined"
          clearable
        ></v-text-field>
        <v-btn class="button" @click="joinLobby">Join</v-btn>
        <div class="pt-10">
          <v-btn class="button" @click="createLobby">Create Lobby</v-btn>
        </div>
        <button class="image back" @click="back"></button>
      </div>
      
      <v-alert v-show="alertStatus" type="error">
          <h3 class="text-center">{{ this.alertMessage }}</h3>
        </v-alert>
    </v-col>
    <v-col cols="9" id="right-bar">
      <div class="table">
        <v-table theme="dark" height="98vh">
          <thead>
            <tr>
              <th class="text-left">Status</th>
              <th class="text-left">LobbyID</th>
              <th class="text-left">Owner</th>
              <th class="text-left">Mode</th>
              <th class="text-left">Players</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lobby in lobbies" :key="lobby.id">
              <td>{{ lobby.status }}</td>
              <td>{{ lobby.id }}</td>
              <td>{{ lobby.owner }}</td>
              <td>{{ lobby.mode }}</td>
              <td>{{ lobby.numberPlayers }}/{{ lobby.maxPlayers }}</td>
              <td>
                <v-btn variant="outlined" @click="joinLobbyById(lobby.id)">Join</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-col>
  </div>
</template>

<style scoped>
#left-bar {
  background-image: url("/backgrounds/lobbyview.png");
  background-repeat: round;
  background-position: center;
  background-size: cover;
  background-color: #9c3b33;
  height: 100vh;
}

tr:hover {
  background-color: black;
}

#right-bar {
  background-color: #1d1d1f;
  height: 100vh;
}

#text {
  color: white;
  font-size: 2vw;
  text-decoration-line: underline;
  text-decoration-color: white;
  text-decoration-thickness: 2px;
}

.avatar{
  width:15vw;
}

.text-field {
  color: white;
}
.back {
  position: absolute;
  background-image: url("/elements/return.png");
  width: 94px;
  height: 64px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  left: 92%;
  top: 2%;
}

.button {
  width: 9vw;
  min-height: 5.70vh;
  color: white;
  font-size: 1vw;
  border-radius: 15px;
  background: url("/elements/button.png") no-repeat center center;
  background-size: contain;
}

.image:active {
  box-shadow: 0 3px rgba(0, 0, 0, 0.05);
  transform: translateY(3px);
}
</style>

<script>
import lobbyService from "@/services/lobbyService";
import { useUserStore } from "@/stores/user";
import { useLobbyStore } from "@/stores/lobby";

export default {
  data: () => ({
    lobbies: [],
    lobbyId: "",
    alertMessage:"",
    alertStatus: false
  }),
  setup() {
    const userStore = useUserStore();
    const lobbyStore = useLobbyStore();

    return { lobbyStore, userStore };
  },
  methods: {
    async getLobbies() {
      await lobbyService.getLobbies().then(
        (response) => {
          console.log(response);
          this.lobbies = response.data;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async joinLobby() {
      console.log(this.lobbyId);
      await lobbyService.joinLobby(this.lobbyId).then(
        (response) => {
          this.lobbyStore.setLobby(response.data);
          this.$router.push({ path: "./Lobby" });
          console.log(response);
        },
        (error) => {
          console.log(error);
          this.showAlert(error.response.data.message);
        }
      );
    },
    async joinLobbyById(id) {
      console.log(id);
      await lobbyService.joinLobby(id).then(
        (response) => {
          this.lobbyStore.setLobby(response.data);
          this.$router.push({ path: "./Lobby" });
          console.log(response);
        },
        (error) => {
          console.log(error);
          this.showAlert(error.response.data.message);
        }
      );
    },
    async createLobby() {
      await lobbyService.createLobby().then(
        (response) => {
          this.lobbyStore.setLobby(response.data);
          this.$router.push({ path: "./Lobby" });
        },
        (error) => {
          console.log(error);
          this.showAlert(error.response.data.message);
        }
      );
    },
    back() {
      this.$router.push({ path: "./home" });
    },
    showAlert(message) {
      this.alertMessage = message;
      this.alertStatus = true;
      setTimeout(() => {
        this.alertStatus = false;
      }, 7000);
    },
  },
  created() {
    this.getLobbies();
  },
};
</script>
