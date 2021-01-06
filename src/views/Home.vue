<template>
  <div class="home">
    <form @submit.prevent="searchMovie" class="search-box">
      <input
        v-model="search"
        type="text"
        placeholder="What are you searching for ?"
      />
      <input type="submit" value="Search" />
    </form>
    <div class="movies-list">
      <ul class="movie-container">
        <li v-for="movie in movieList" :key="movie.imdbID">
          
            <img v-bind:src="movie.Poster" v-bind:alt="movie.Title" />
            <div class="movie-details mt-3">
              <p class="year">{{ movie.Year }}</p>
              <p class="title">{{ movie.Title }}</p>
              <router-link :to="'/movie/' + movie.imdbID">
                <button class="details-btn">Movie Details</button>
              </router-link>
            </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "movie",
  data() {
    return {
      search: "",
      movieList: [],
    };
  },
  methods: {
    searchMovie: function () {
      if (this.search != "") {
        axios
          .get(`https://www.omdbapi.com/?apikey=f9179f20&s=${this.search}`)
          .then((response) => {
            console.log(response.data);
            this.movieList = response.data.Search;
            console.log(this.movieList);
            this.search = "";
          });
      }
    },
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
    input {
      display: block;
      appearance: none;
      border: none;
      outline: none;
      background: none;
      &[type="text"] {
        width: 100%;
        color: white;
        background-color: #171719;
        border: 1px solid gray;
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
        background-color: #3d3d3d;
        &:hover {
          background-color: #171719;
          border: 1px solid #2d2d30;
          transition: all 0.4s ease;
        }
        img {
          object-fit: cover;
          max-width: 100%;
          min-height: 80%;
        }
      }
      .movie-details {
        .year {
          font-size: 14px;
          font-weight: 700;
          color: #cad5e0;
        }
        .title{
          color:#cad5e0;
        }
        .details-btn{
          width: 100%;
          appearance: none;
          border: none;
          outline: none;
          background-color: #f7af2b;
          padding: 8px;
          border-radius: 8px;
          color: #5f420c;
          font-size: 14px;
          font-weight: 700;
          &:hover {
            background-color: #e49f1f;
            transition: all 0.4s ease;
        }
        }
      }
    }
  }
}
</style>