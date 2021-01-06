<template>
  <div class="movie-detail">
    <div class="container">
      <div class="row">
        <div class="col-md-6 mt-5">
          <h3 class="text-white">{{this.movie.Title}}</h3>
          <h4 class="text-white">{{this.movie.Year}}</h4>
          <img class="mt-3" v-bind:src="movie.Poster">
        </div>
        <div class="col-md-6 mt-5 text-white">{{this.movie.Plot}}</div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from "axios";
import {onBeforeMount} from 'vue';
export default {
  data: function () {
    return {
      id: this.$route.params.id,
      movie: [],
    };
  },
  created() {
    console.log(this.id);
    axios
      .get(`https://www.omdbapi.com/?apikey=f9179f20&i=${this.id}&plot=full`)
      .then((response) => {
        let movie = [];
        this.movie = response.data;
        console.log(this.movie.Title)
      });
  },
};
</script>

<style>
</style>