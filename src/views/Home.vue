<template>
  <div class="home">
    <!-- 
    <div class="feature-card">
      <router-link to="/movie/tt0409591">
        <img
          src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/movies-to-watch-1585258004.jpg?crop=1.00xw:1.00xh;0,0&resize=980:*"
          class="feature-imd"
          alt="movie"
        />
        <div class="detail">
          <h3>Movie</h3>
          <p>Desc</p>
        </div>
      </router-link>
    </div>
    -->
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
        <li v-for="movie in movieList" :key="movie.imdbID" >
          <router-link :to="'/movie/' + movie.imdbID" >
            <img v-bind:src="movie.Poster" v-bind:alt="movie.Title" >
              <div class="movie-details mt-3">
                <p>{{movie.Title}}</p>
                <p>{{movie.Year}}</p>
              </div>
          </router-link>  
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
      movieList: []
    };
  },
  methods: {
    searchMovie: function () {
      if (this.search != "") {
        axios
          .get(`http://www.omdbapi.com/?apikey=f9179f20&s=${this.search}`)
          .then((response) => {
            console.log(response.data);
            this.movieList = response.data.Search
            console.log(this.movieList)
            this.search = ""
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
  a {
  text-decoration: none;
  color:#cad5e0 !important;

  }
  a:hover {
    opacity: 1;
    color:white!important;
    transition: all 0.5s ease;
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
    input {
      display: block;
      appearance: none;
      border: none;
      outline: none;
      background: none;
      &[type="text"] {
        width: 100%;
        color: white;
        background-color: #496583;
        font-size: 20px;
        padding: 10px 16px;
        border-radius: 8px;
        margin-bottom: 15px;
        transition: 0.4s;
        &::placeholder {
          color: #f3f3f3;
        }
        &:focus {
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
        }
      }
      &[type="submit"] {
        width: 100%;
        max-width: 300px;
        background-color: #42b883;
        padding: 16px;
        border-radius: 8px;
        color: #fff;
        font-size: 20px;
        text-transform: uppercase;
        transition: 0.4s;
        &:active {
          background-color: #309668;
        }
      }
    }
  }
  .movies-list{
    display: flex;
    .movie-container{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      list-style-type: none;
      li{
        padding: 25px;
        margin:10px;
        width: 300px;
        height: fit-content;
        border-radius: 8px;
        background-color: #496583;
        
        img{
          object-fit: cover;
          max-width: 100%;
          min-height: 80%;
          
        }
      }
    }
  }
}
</style>