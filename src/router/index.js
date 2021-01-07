import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import MovieDetail from "../views/MovieDetail.vue";
import MyList from "../views/MyList.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/movie/:id",
    name: "Movie Details",
    component: MovieDetail,
  },
  {
    path: "/MyList",
    name: "MyList",
    component: MyList,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
