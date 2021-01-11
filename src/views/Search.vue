<template>
  <div class="container">
    <div class="home">
      <form @submit.prevent="searchMovie" class="search-box">
        <div class="col-md-12 mt-3 d-flex">
          <input
            v-model="search"
            type="text"
            placeholder="What are you searching for ?"
          />
          <i @click="removeQuery" class="fas fa-times-circle"></i>
        </div>
        <input type="submit" value="Search" />
      </form>
      <div class="movies-list">
        <ul class="movie-container">
          <li v-for="(movie, index) in movieList" :key="movie.imdbID">
            <img v-bind:src="movie.Poster" v-bind:alt="movie.Title" />
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
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  name: "movie",
  data() {
    return {
      search: "",
      movieList: [],
      isLoading: false,
      fullPage: true,
    };
  },
  components: {
    Loading,
  },
  methods: {
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
      console.log(this.search);
    },
    addToList: function (index) {
      axios
        .post(
          "https://movie-app-52779-default-rtdb.firebaseio.com/movieList.json",
          {
            id: this.movieList[index].imdbID,
            title: this.movieList[index].Title,
            rating: 0,
            comment: "",
          }
        )
        .then((response) => {});
      this.$alert("Movie added to your list.", "", "success");
      console.log(this.search);
    },
    removeQuery: function () {
      this.search = "";
    },
  },
  async created() {
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
  @media only screen and (min-width: 778px) {
    background: no-repeat center/100% url("images/bg.jpg");
    padding-bottom: 30rem;
  }
  @media only screen and (max-width: 778px) {
    background: no-repeat center/100% url("images/bg.jpg");
    padding-bottom: 20rem;
  }

  .feature-card {
    position: relative;
  }

  .featured-img {
    display: block;
    height: 300px;
    width: 100%;
    object-fit: cover;
    position: relative;
    z-index: 0;
  }
  .detail {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    h3 {
      color: white;
      padding: 10px;
    }
    p {
      color: white;
      padding: 10px;
    }
  }
  .search-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 16px;
    align-items: center;
    .fa-times-circle {
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
        color: black;
        background-color: white;
        border: 5px solid rgb(48, 48, 48);
        font-size: 20px;
        padding: 10px 16px;
        border-radius: 8px;
        margin-bottom: 15px;
        transition: 0.4s;
        &::placeholder {
          color: gray;
        }
        &:focus {
          opacity: 1;
        }
      }
      &[type="submit"] {
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
