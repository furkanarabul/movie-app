<template>
  <div class="container">
    <div class="home">
      <div class="row">
        <div class="col-md-12">
          <h4
            class="text-white text-center text-uppercase"
          >Keep track of the movies you have watched!</h4>
          <h5 class="text-white text-center mt-3">Search from thousands of movies</h5>
        </div>
      </div>

      <form @submit.prevent="searchMovie" class="search-box">
        <div class="col-md-12 p-0 mt-3 d-flex justify-content-between flex-row">
          <i class="fas fa-search"></i>
          <input
            v-on:keyup="dropdownSearch"
            v-model="search"
            type="text"
            placeholder="Search Movie"
          />
          <i v-if="search.length > 0" @click="removeQuery" class="fas fa-times"></i>
        </div>
        <div
          v-if="showDropdown"
          class="col-xl-6 col-lg-10 col-md-8 col-sm-6 col-10 text-white dropdown"
        >
          <ul>
            <li v-for="movie in movieListDropdown" :key="movie.imdbID">
              <router-link
                class="text-white d-flex"
                :to="{
                  path: `/movie/${movie.imdbID}`,
                  query: { searchQuery: search },
                }"
              >
                <img v-if="!(movie.Poster === 'N/A')" v-bind:src="movie.Poster" />
                <span class="ml-2 flex-grow-2 align-self-center">
                  {{
                  movie.Title
                  }}
                </span>
                <span class="ml-3float-right movie-year align-self-center">
                  {{
                  movie.Year
                  }}
                </span>
              </router-link>
            </li>
          </ul>
        </div>
        <!--
        <input class="mt-3" type="submit" value="Search" />
        -->
      </form>

      <div class="movies-list">
        <ul class="movie-container">
          <li v-for="(movie, index) in movieList" :key="movie.imdbID">
            <img
              v-if="!(movie.Poster === 'N/A')"
              v-bind:src="movie.Poster"
              v-bind:alt="movie.Title"
            />
            <div class="movie-details mt-3">
              <p class="year">{{ movie.Year }}</p>
              <p class="title">{{ movie.Title }}</p>
              <router-link
                :to="{
                  path: `/movie/${movie.imdbID}`,
                  query: { searchQuery: search },
                }"
              >
                <button class="details-btn">Movie Details</button>
              </router-link>
              <button @click="addToList(index)" class="add-btn mt-2">
                Add to list
                <i class="ml-1 fas fa-plus-square"></i>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--spin loader-->
    <div class="vld-parent">
      <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  name: "movie",
  data() {
    return {
      search: "",
      movieList: [],
      movieListDropdown: [],
      isLoading: false,
      fullPage: true,
    };
  },
  components: {
    Loading,
  },
  computed: {
    showDropdown: function () {
      return !(this.movieListDropdown === undefined);
    },
  },
  methods: {
    dropdownSearch: async function () {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=f9179f20&s=${this.search}&plot=full`
      );
      console.log(this.search);
      console.log(response.data.Search);
      this.movieListDropdown = response.data.Search;
      console.log(this.movieListDropdown === undefined);
    },
    searchMovie: function () {
      if (this.search.trim().length == 0) {
        this.$alert("Search query cannot be empty.", "", "warning");
        return;
      }
      if (this.search != "") {
        axios
          .get(
            `https://www.omdbapi.com/?apikey=f9179f20&s=${this.search}&plot=full`
          )
          .then((response) => {
            // 0.5 second delay on purpose for more realistic search behavior
            const vm = this;
            setTimeout(() => {
              vm.movieList = response.data.Search;
            }, 1000);
            //this.movieList = response.data.Search;
            if (response.data.Response === "False") {
              this.$alert("Movie not found!.", "", "warning");
            } else {
              this.isLoading = true;
              // simulate AJAX
              setTimeout(() => {
                this.isLoading = false;
              }, 1000);
            }
            //this.search = "";
          });
      }
    },
    addToList: function (index) {
      axios
        .post(
          "https://movie-app-52779-default-rtdb.firebaseio.com/movieList.json",
          {
            id: this.movieList[index].imdbID,
            title: this.movieList[index].Title,
            rating: 0,
            review: "",
            inList: true,
          }
        )
        .then((response) => {});
      this.$alert("Movie added to your list.", "", "success");
      console.log(this.search);
    },
    removeQuery: function () {
      this.search = "";
      this.movieListDropdown = [];
      this.movieListDropdown = undefined;
    },
  },
  async created() {
    this.isLoading = true;
    // simulate AJAX
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
    this.movieListDropdown = undefined;
    if (this.$route.query.searchQuery != undefined) {
      axios
        .get(
          `https://www.omdbapi.com/?apikey=f9179f20&s=${this.$route.query.searchQuery}&plot=full`
        )
        .then((response) => {
          console.log(response);
          this.movieList = response.data.Search;
          this.search = this.$route.query.searchQuery;
        });
    }
  },
};
</script>
<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.home {
  h4 {
    opacity: 0.8;
  }
  h5 {
    opacity: 0.5;
  }
  .search-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 16px;
    align-items: center;
    .dropdown {
      background: white;
      position: absolute;
      padding: 20px;
      max-height: 50vh;
      overflow: auto;
      top: 285px;
      @media only screen and (max-width: 768px) {
        top: 320px;
      }
      width: 100%;
      border: 5px solid rgb(90, 90, 90);
      border-radius: 8px;
      a {
        color: rgb(41, 41, 41) !important;
        &:hover {
          text-decoration: none;
        }
      }
      ul {
        margin-bottom: 0;
        list-style-type: none;
        li {
          color: black;
          margin-top: 10px;
          padding: 7px;
          img {
            width: 8%;
            @media only screen and (max-width: 768px) {
              width: 15%;
              height: 15%;
            }
          }
          .flex-grow-2 {
            flex-grow: 2;
          }
          .movie-year {
            background: #f7af2b;
            border-radius: 2px;
            color: #3b2b0c;
            font-weight: bolder;
            padding: 3px;
            height: 50%;
            font-size: 0.9rem;
          }
          &:hover {
            color: #000000;
            background: #f1f1f1;
            border-radius: 5px;
            padding: 7px;
            transition: 0.4s;
          }
        }
      }
    }
    .fa-search {
      color: gray;
      position: relative;
      left: 35px;
      top: 22px;
    }
    .fa-times {
      color: black;
      position: relative;
      right: 35px;
      top: 22px;
      opacity: 0.5;
      &:hover {
        opacity: 1;
        cursor: pointer;
      }
    }
    input {
      display: block;
      appearance: none;
      border: none;
      outline: none;
      background: none;
      &[type="text"] {
        width: 100%;
        color: rgb(65, 65, 65);
        background-color: white;
        border: 5px solid rgb(48, 48, 48);
        font-size: 20px;
        padding: 10px 40px 16px;
        border-radius: 8px;
        margin-bottom: 15px;
        transition: 0.4s;
        &::placeholder {
          color: gray;
        }
        &:focus {
          border: 5px solid rgb(90, 90, 90);
        }
      }
      &[type="submit"] {
        @media only screen and (max-width: 778px) {
          width: 50% !important;
        }
        width: 100%;
        max-width: 300px;
        background-color: #f7af2b;
        padding: 16px;
        border-radius: 8px;
        color: #5f420c;
        font-size: 20px;
        text-transform: uppercase;
        transition: 0.4s;
        font-weight: 700;
        &:hover {
          background-color: #e49f1f;
          transition: 0.4s;
        }
        &:active {
          background-color: #cc8d19;
        }
      }
    }
  }
  .movies-list {
    display: flex;
    .movie-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      list-style-type: none;
      li {
        padding: 25px;
        margin: 10px;
        width: 300px;
        height: fit-content;
        border-radius: 8px;
        background-color: #191919;
        &:hover {
          background-color: #171719;
          transition: all 0.4s ease;
        }
        img {
          object-fit: cover;
          max-width: 100%;
          min-height: 80%;
          border: 5px solid white;
        }
      }
      .movie-details {
        .year {
          font-size: 14px;
          font-weight: 700;
          color: #cad5e0;
        }
        .title {
          color: #cad5e0;
        }
        .details-btn {
          width: 100%;
          appearance: none;
          border: 1px solid rgb(61, 61, 61);
          outline: none;
          background-color: transparent;
          padding: 8px;
          border-radius: 8px;
          color: gray;
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 700;
          &:hover {
            background-color: #353535;
            transition: all 0.4s ease;
            color: white;
          }
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
          &:hover {
            background-color: #1faf4f;
            transition: all 0.4s ease;
          }
        }
      }
    }
  }
}
</style>
