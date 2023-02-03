import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/start",
      name: "Start",
      component: () => import("../views/Start.vue")
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("../views/Home.vue")
    },
    {
      path: "/lobby",
      name: "Lobby",
      component: () => import("../views/Lobby.vue")
    },
    {
      path: "/lobbyoverview",
      name: "LobbyOverview",
      component: () => import("../views/LobbyOverview.vue")
    },
    {
      path: "/",
      name: "ChampionSelect",
      component: () => import("../views/ChampionSelect.vue")
    },
    {
      path: "/game",
      name: "Game",
      component: () => import("../views/game.vue")
    },
    {
      path: "/asdads",
      name: "Card",
      component: () => import("../views/Card.vue")
    },
    {
      path: "/description",
      name: "Description",
      component: () => import("../views/Description.vue")
    },
    {
      path: "/asdds",
      name: "ChampionCard",
      component: () => import("../views/ChampionCard.vue")
    },
    {
      path: "/skill",
      name: "Skill",
      component: () => import("../views/Skill.vue")
    }
  ],
});

export default router;
