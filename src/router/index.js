import Vue from "vue";
import VueRouter from "vue-router";
import Search from "../views/Search.vue";
import MovieDetail from "../views/MovieDetail.vue";
import List from "../views/List.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "List",
    component: List,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
  {
    path: "/movie/:imdbId",
    name: "MovieDetail",
    component: MovieDetail,
  },
  {
    path: "/list/:firebaseKey",
    name: "MovieListDetail",
    component: MovieDetail,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
