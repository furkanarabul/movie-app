<template>
  <div class="movie-detail">
    <div class="container">
      <div class="row">
        <div class="col-md-6 mt-5 text-white">
          <h3 class="text-white">{{movie.Title}}</h3>
          <h4 class="text-white">{{movie.Year}}</h4>
          <img class="mt-3" v-bind:src="movie.Poster" />
          <star-rating v-model="rating" @rating-selected="setRating" class="mt-3" />
        </div>
        <div class="col-md-6 mt-5 text-white">{{movie.Plot}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";
export default {
  props: {
    firebase_id: String,
  },
  data: function () {
    return {
      id: this.$route.params.id,
      firebase_key: this.$route.query.firebase_id,
      movie: [],
      rating: 0,
    };
  },
  created() {
    console.log(this.$route.query.firebase_id);
    console.log(this.$route);
    console.log(this.id);
    axios
      .get(`https://www.omdbapi.com/?apikey=f9179f20&i=${this.id}&plot=full`)
      .then((response) => {
        let movie = [];
        this.movie = response.data;
        console.log(this.movie.Title);
      });
      //
      axios
        .get(
          "https://movie-app-52779-default-rtdb.firebaseio.com/movieList/" +
            this.firebase_key +
            ".json",
        )
        .then((response) => {
          this.rating = response.data.rating
        });
  },
  components: {
    StarRating,
  },
  methods: {
    setRating: function () {
      let setRating = this.rating;
      console.log(setRating);
      axios
        .patch(
          "https://movie-app-52779-default-rtdb.firebaseio.com/movieList/" +
            this.firebase_key +
            ".json",{rating: setRating}
        )
        .then((response) => {
          console.log(response.data.rating);
        });
    },
  },
};
</script>

<style>
</style>