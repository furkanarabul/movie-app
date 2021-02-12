<template>
  <div class="movie-detail mb-5">
    <div class="container">
      <div class="row">
        <div class="col-md-6 mt-3">
          <router-link
            v-if="isMovieDetail"
            :to="{
              path: `/search/`,
              query: { searchQuery: this.$route.query.searchQuery },
            }"
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
          <img
            v-if="!(movie.Poster === 'N/A')"
            class="mt-3"
            v-bind:src="movie.Poster"
          />
          <p class="mt-3" v-else>
            <i class="fas fa-unlink mr-2"></i>Cover has not found
          </p>
          <p class="mt-3" v-if="!(movie.Plot === 'N/A')">{{ movie.Plot }}</p>
          <p class="mt-3" v-else>
            <i class="fas fa-unlink mr-2"></i>Description has not found
          </p>
        </div>
        <div class="col-md-6 mt-5 text-white">
          <div class="col-md-4" style="padding: 0">
            <button
              v-if="isMovieDetail"
              @click="addToList"
              class="add-btn mt-2"
            >
              Add to list
              <i class="ml-1 fas fa-plus-square"></i>
            </button>
          </div>
          <div v-if="!isMovieDetail" class="myReview">
            <h1>My Review</h1>
            <star-rating
              text-class="custom-text"
              v-model="rating"
              v-if="!isMovieDetail"
              :increment="0.5"
              @rating-selected="setRating"
              class="mt-5"
            />
            <i
              class="fas fa-quote-right float-right fa-2x"
              style="opacity: 0.2"
            ></i>

            <textarea
              placeholder="Type your review"
              class="mt-3"
              type="text"
              v-model="review"
            />
            <hr />
            <button @click="updateMovieReview">Save Review</button>
          </div>
        </div>
      </div>
    </div>
    <!--spin loader-->
    <div class="vld-parent">
      <loading
        :active.sync="isLoading"
        :can-cancel="true"
        :is-full-page="fullPage"
      ></loading>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";
import Loading from "vue-loading-overlay";

export default {
  components: {
    StarRating,
    Loading,
  },
  data: function () {
    return {
      imdbId: null,
      movie: null,
      rating: 0,
      review: null,
      isLoading: false,
      fullPage: true,
    };
  },
  computed: {
    //check if request come from List or Search page
    isMovieDetail: function () {
      return this.$router.history.current.name === "MovieDetail";
    },
  },
  watch: {
    // push doesnt worked so I forced to go this url
    $route(to, from) {
      this.$router.go(this.$router.currentRoute);
    },
  },
  async created() {
    this.isLoading = true;
    // simulate AJAX
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
    if (this.isMovieDetail) {
      this.imdbId = this.$route.params.imdbId;
    } else {
      const dbRecord = await this.getMovieFromDB(
        this.$route.params.firebaseKey
      );

      this.rating = dbRecord.rating;
      this.imdbId = dbRecord.id;
      this.review = dbRecord.review;
    }

    this.movie = await this.getMovieFromAPI(this.imdbId);
  },
  methods: {
    addToList: async function (e) {
      const sendData = await axios.post(
        `https://movie-db1-default-rtdb.firebaseio.com/movieList/.json`,
        {
          title: this.movie.Title,
          id: this.movie.imdbID,
          poster: this.movie.Poster,
          year: this.movie.Year,
          plot: this.movie.Plot,
          rating: 0,
        }
      );
      this.$alert("Movie added to your list.", "", "success").then(() =>
        this.$router.push(`/list/${sendData.data.name}`)
      );
    },
    setRating: async function () {
      const response = await this.updateMovieRating(this.rating);
    },
    setReview: async function () {
      const response = await this.updateMovieReview(this.review);
    },
    getMovieFromDB: async function (key) {
      const response = await axios.get(
        `https://movie-db1-default-rtdb.firebaseio.com/movieList/${key}/.json`
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
        "https://movie-db1-default-rtdb.firebaseio.com/movieList/" +
          this.$route.params.firebaseKey +
          ".json",
        { rating: this.rating }
      );

      return response.data;
    },
    updateMovieReview: async function (review) {
      const response = await axios.patch(
        "https://movie-db1-default-rtdb.firebaseio.com/movieList/" +
          this.$route.params.firebaseKey +
          ".json",
        { review: this.review }
      );
      this.$alert("Review saved.", "", "success");
    },
  },
};
</script>

<style lang="scss">
img {
  border: 5px solid white;
}
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
  &:active {
    outline: none;
  }
  &:focus {
    outline: none;
  }
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
.myReview {
  h1 {
    color: #e49f1f;
  }
  button {
    width: 100%;
    appearance: none;
    border: none;
    background: #e49f1f;
    color: #312205;
    font-weight: 700;
    text-transform: uppercase;
    border-radius: 5px;
    min-height: 40px;
    &:hover {
      background: #c78a19;
      transition: all 0.4s ease;
    }
    &:focus {
      outline: none;
    }
  }
  textarea {
    color: rgb(224, 224, 224);
    background: rgb(15, 15, 15);
    border: 1px solid rgb(90, 90, 90);
    padding: 10px;
    appearance: none;
    width: 100%;
    border-radius: 5px;
    min-height: 10rem;

    outline: none;
    &:focus {
      appearance: none;
      border: 1px solid #e49f1f;
      outline: none;
    }
  }
}
</style>
