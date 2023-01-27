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
      path: "/",
      name: "LobbyOverview",
      component: () => import("../views/LobbyOverview.vue"),
    },
    {
      path: "/game",
      name: "Game",
      component: () => import("../views/game.vue"),
    },
  ],
});

export default router;
