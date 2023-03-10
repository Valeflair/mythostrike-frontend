<template>
  <div class="d-flex justify-center">
    <v-col cols="3" id="left-bar" class="text-center">
      <img :src="'/avatars/avatar' + userStore.getUser.avatarNumber + '.png'" />
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
  text-decoration-line: underline;
  text-decoration-color: white;
  text-decoration-thickness: 2px;
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
  width: 197px;
  min-height: 61px;
  color: white;
  font-size: 20px;
  border-radius: 15px;
  background: url("/elements/button.png");
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
        }
      );
    },
    back() {
      this.$router.push({ path: "./home" });
    },
  },
  created() {
    this.getLobbies();
  },
};
</script>
