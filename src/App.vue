<template>
  <div>
    <header>
      <router-link to="/">
        <h1><span>Vue</span>Movies</h1></router-link
      >
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Helvetica";
  &::selection {
    background: transparentize(#42b883, 0.5);
  }
}
body {
  background-color: #222124;
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
  justify-content: center;
  padding: 10px 16px;
  background-color: #171718;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
}
h1 {
  color: #fff;
  span {
    color: #f7af2b;
    font-weight: 700;
  }
}
</style>
