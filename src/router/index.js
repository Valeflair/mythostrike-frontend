import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/start",
      name: "Start",
      component: () => import("../views/Start.vue"),
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/lobby",
      name: "Lobby",
      component: () => import("../views/LobbyView.vue"),
    },
    {
      path: "/championselect",
      name: "ChampionSelection",
      component: () => import("../views/ChampionSelectionView.vue"),
    },
    {
      path: "/lobbyoverview",
      name: "LobbyOverview",
      component: () => import("../views/LobbyOverview.vue"),
    },
    {
      path: "/",
      name: "Game",
      component: () => import("../views/Game.vue"),
    }
  ],
});

export default router;
