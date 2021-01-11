<template>
  <div class="movie-detail mb-5">
    <div class="container">
      <div class="row">
        <div class="col-md-6 mt-3">
          <router-link
            v-if="isMovieDetail"
            :to="{path:`/search/`,query:{searchQuery:this.$route.query.searchQuery}}"
            class="back"
          >
            <i class="fas fa-long-arrow-alt-left"></i>
            <span class="ml-2">Back to Search</span>
          </router-link>
          <router-link v-else to="/" class="back">
            <i class="fas fa-long-arrow-alt-left"></i>
            <span class="ml-2">Back to List</span>
          </router-link>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mt-3 text-white">
          <h3 class="text-white">{{ movie.Title }}</h3>
          <h4 class="text-white">{{ movie.Year }}</h4>
          <img class="mt-3" v-bind:src="movie.Poster" />
          <star-rating
            text-class="custom-text"
            v-model="rating"
            v-if="!isMovieDetail"
            :increment="0.5"
            @rating-selected="setRating"
            class="mt-5"
          />
        </div>
        <div class="col-md-6 mt-5 text-white">
          {{ movie.Plot }}
          <div class="col-md-4 mt-3 mb-5" style="padding: 0">
            <button v-if="isMovieDetail" @click="addToList" class="add-btn mt-2">
              Add to list
              <i class="ml-1 fas fa-plus-square"></i>
            </button>
          </div>
        </div>
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
    //check if request come from List or Search page
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
    addToList: async function (e) {
      const sendData = await axios.post(
        `https://movie-app-52779-default-rtdb.firebaseio.com/movieList/.json`,
        {
          title: this.movie.Title,
          id: this.movie.imdbID,
          poster: this.movie.Poster,
          year: this.movie.Year,
          plot: this.movie.Plot,
          rating: 0,
        }
      );
      e.target.parentElement.remove();
      this.$alert("Movie added to your list.", "", "success");
    },
    setRating: async function () {
      const response = await this.updateMovieRating(this.rating);
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

<style lang="scss">
.add-btn {
  width: 100%;
  appearance: none;
  border: none;
  outline: none;
  background-color: #15a044;
  padding: 8px;
  border-radius: 8px;
  color: #053f18;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 700;
  &:hover {
    background-color: #1faf4f;
    transition: all 0.4s ease;
  }
}
.custom-text {
  font-weight: bold;
  font-size: 1.5em;
  border: 1px solid #2b2b2b;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  color: rgb(207, 207, 207);
  background: rgb(65, 65, 65);
}
span:hover {
  color: #e49f1f;
  transition: all 0.4s ease;
  text-decoration: underline;
}
.fa-long-arrow-alt-left {
  color: #e49f1f;
}
</style>

