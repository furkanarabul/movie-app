<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <ul class="movieList">
          <li class="movieItem" v-for="movie in movieList" :key="movie.id">
            <router-link :to="'/movie/' + movie.id">
              {{
              movie.title
              }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      movieList: [],
    };
  },
  created() {
    axios
      .get("https://movie-app-52779-default-rtdb.firebaseio.com/movieList.json")
      .then((response) => {
        for (let key in response.data) {
          let movieList = {
            title: response.data[key].title,
            id: response.data[key].id,
          };
          this.movieList.push(movieList);
          console.log(movieList);
        }
      });
  },
};
</script>

<style lang="scss">
.movieList {
  display: flex;
  flex-direction: column;
  .movieItem {
    margin-top: 20px;
    background: black;
    opacity: 0.5;
    min-height: 50px;
    padding: 20px;
    border-radius: 8px;
    &:hover {
      opacity: 1;
      transition: 0.4s;
    }
  }
}
</style>
