<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {

    }
  },
  methods:{

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
  /* margin-top: 60px; */
  height: 100%;
}
.mu-appbar{
  -webkit-box-shadow:0 0 0 0 !important;
  border-bottom: 1px solid #DBDBDB;
}
html,body{
  height: 100%;
}
</style>
