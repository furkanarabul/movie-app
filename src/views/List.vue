<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div v-if="!isEmpty">
          <h3 class="text-white">Your List</h3>
          <h4 class="text-white">
            Here you can list your movies, you can review and rate them.
          </h4>
        </div>

        <div class="mt-3 text-right" v-if="!isEmpty">
          <div class="counter">
            You have
            <span>{{ movieList.length }}</span> movies in your list
          </div>
        </div>
        <ul class="movieList">
          <router-link
            v-for="(movie, index) in movieList"
            :to="{
              path: `/list/${movie.id}`,
            }"
            :key="movie.id"
          >
            <li class="movieItem">
              {{ movie.title }}
              <button
                @click.stop.prevent="removeMovie(index)"
                class="removeBtn"
              >
                <i class="fas fa-trash"></i>
              </button>
            </li>
          </router-link>
        </ul>
        <div v-if="isEmpty" class="empty">
          <p class="text-uppercase">
            List is empty.
            <br />
          </p>
          <router-link to="/search">
            <button class="mt-3 submit">
              Add film to the list
              <i class="ml-3 fas fa-plus-square"></i>
            </button>
          </router-link>
          <div class="vld-parent">
            <loading
              :active.sync="isLoading"
              :is-full-page="fullPage"
            ></loading>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "vue-loading-overlay";

export default {
  data() {
    return {
      movieList: [],
      isLoading: false,
      fullPage: true,
    };
  },
  components: {
    Loading,
  },
  created() {
    this.isLoading = true;
    // simulate AJAX
    setTimeout(() => {
      this.isLoading = false;
    }, 750);
    axios
      .get("https://movie-d9b-default-rtdb.firebaseio.com/movieList.json")
      .then((response) => {
        for (let key in response.data) {
          let movieList = {
            title: response.data[key].title,
            id: key,
            imdb: response.data[key].id,
            rating: response.data[key].rating,
          };
          this.movieList.push(movieList);
        }
      });
  },
  computed: {
    isEmpty: function () {
      return this.movieList.length === 0;
    },
  },
  methods: {
    removeMovie: function (index) {
      this.$confirm("Are you sure?").then(() => {
        axios
          .delete(
            "https://movie-d9b-default-rtdb.firebaseio.com/movieList/" +
              this.movieList[index].id +
              ".json"
          )
          .then((response) => {});
        this.movieList.splice(index, 1);
      });
    },
  },
};
</script>

<style lang="scss">
h3 {
  opacity: 0.8;
}
h4 {
  opacity: 0.5;
}
a {
  &:hover {
    text-decoration: none !important;
  }
}
.movieList {
  display: flex;
  flex-direction: column;
  .movieItem {
    margin-top: 20px;
    background: rgb(20, 20, 20);
    border: 2px solid rgb(37, 37, 37);
    color: white;
    min-height: 50px;
    padding: 20px;
    border-radius: 8px;
    display: flex;

    &:hover {
      background: rgb(54, 54, 54);
      transition: 0.4s;
      cursor: pointer;
    }
    .removeBtn {
      appearance: none;
      border: none;
      outline: none;
      min-height: 30px;
      min-width: 30px;
      border-radius: 5px;
      margin-left: auto;
      background: rgb(180, 66, 66);
      &:hover {
        background: rgb(206, 67, 67);
      }
      .fa-trash {
        color: white;
      }
    }
  }
}
.empty {
  color: white;
  font-size: 2rem;
  text-align: center;
  p {
    opacity: 0.7;
  }
}
.submit {
  width: 100%;
  max-width: 300px;
  appearance: none;
  border: none;
  outline: none;
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
.counter {
  color: rgb(100, 100, 100);
  span {
    font-weight: 700;
    color: #cc8d19;
  }
}
</style>
