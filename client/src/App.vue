<template>
  <div id="app" class="phone-viewport">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img :src="logo" alt="Panda Academy">
          <b class="title is-4">&nbsp;Panda Academy</b>
        </a>

        <button class="button navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
    <div class="container">
    <router-view/>
    </div>
  </div>
</template>

<script>
import logo from './assets/panda-logo.png'

export default {
  name: 'app',
  data: () => ({
    logo: logo
  }),
  methods: {
    toggleLeftSidenav () {
      this.$refs.leftSidenav.toggle()
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
