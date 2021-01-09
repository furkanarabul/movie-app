<template>
  <div class="movie-detail">
    <div class="container">
      <div class="row">
        <div class="col-md-6 mt-5 text-white">
          <h3 class="text-white">{{ movie.Title }}</h3>
          <h4 class="text-white">{{ movie.Year }}</h4>
          <img class="mt-3" v-bind:src="movie.Poster" />
          <star-rating
            v-model="rating"
            v-if="!isMovieDetail"
            @rating-selected="setRating"
            class="mt-3"
          />
        </div>
        <div class="col-md-6 mt-5 text-white">{{ movie.Plot }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";
export default {
  components: {
    StarRating,
  },
  data: function () {
    return {
      imdbId: null,
      movie: null,
      rating: 0,
    };
  },
  computed: {
    isMovieDetail: function () {
      return this.$router.history.current.name === "MovieDetail";
    },
  },
  async created() {
    if (this.isMovieDetail) {
      this.imdbId = this.$route.params.imdbId;
    } else {
      const dbRecord = await this.getMovieFromDB(
        this.$route.params.firebaseKey
      );

      this.rating = dbRecord.rating;
      this.imdbId = dbRecord.id;
    }

    this.movie = await this.getMovieFromAPI(this.imdbId);
  },
  methods: {
    setRating: async function () {
      const response = await this.updateMovieRating(this.rating);

      console.log(response.rating);
    },
    getMovieFromDB: async function (key) {
      const response = await axios.get(
        `https://movie-app-52779-default-rtdb.firebaseio.com/movieList/${key}/.json`
      );

      return response.data;
    },
    getMovieFromAPI: async function (id) {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=f9179f20&i=${id}&plot=full`
      );

      return response.data;
    },
    updateMovieRating: async function (rating) {
      const response = await axios.patch(
        "https://movie-app-52779-default-rtdb.firebaseio.com/movieList/" +
          this.$route.params.firebaseKey +
          ".json",
        { rating: rating }
      );

      return response.data;
    },
  },
};
</script>

<style>
</style>