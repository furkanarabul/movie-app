<template>
  <div>
    <header>
      <router-link to="/">
        <h1>
          <span>My</span>Movies
        </h1>
      </router-link>

      <router-link v-if="!notHomePage" class="ml" to="/">
        <button class="myListBtn">
          <span>
            <i class="fas fa-list-ul text-white mr-2"></i>
          </span>My List
        </button>
      </router-link>
      <router-link v-if="notHomePage" class="ml" to="/search">
        <button class="myListBtn">
          <span>
            <i class="fas fa-plus-square text-white mr-2"></i>
          </span>Add Movie
        </button>
      </router-link>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
<script>
export default {
  computed: {
    notHomePage() {
      return this.$route.path === "/";
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: "Rubik", sans-serif;
  box-sizing: border-box;
  &::selection {
    background: transparentize(#42b883, 0.5);
  }
}
body {
  background: url("views/images/bg.jpg");
  background-color: #000000;
  background-size: inherit;
}
a {
  text-decoration: none;
  color: #cad5e0 !important;
}
a:hover {
  opacity: 1;
  color: white !important;
  transition: all 0.5s ease;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 25px 25px;
  text-align: left;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  h1 {
    color: #fff;
    span {
      color: #f7af2b;
      font-weight: 700;
    }
  }
  h2 {
  }
}
.myListBtn {
  width: 100%;
  appearance: none;
  border: 2px solid white;
  outline: none;
  background-color: transparent;
  padding: 8px;
  min-width: 100px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  &:active {
    outline: none;
  }
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #3f3f3f;
    transition: all 0.4s ease;
  }
}
</style>
