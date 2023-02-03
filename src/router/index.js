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
      component: () => import("../views/Lobby.vue"),
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
    },
    
    {
      path: "/as",
      name: "ChampionCard",
      component: () => import("../views/ChampionCard.vue"),
    },
    
    {
      path: "/Library",
      name: "Library",
      component: () => import("../views/Library.vue"),
    },
  ],
});

export default router;
