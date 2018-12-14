<template>
  <div class="app-wrapper">
    <div class="main-container">
      <div class="navbar">
        <img src='../../assets/logo.jpg'>
        <span class="title">光大国际 智慧环卫一体化管理平台</span>
      </div>
      <section class="app-main">
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <router-view />
          </keep-alive>
        </transition>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      // http://61.190.61.78:3658/information/Bins
    }
  },
  created(){
    // console.log(this.$router)

  },
  methods: {

  }
}
</script>

<style scoped>
.navbar {
  height: 80px;
  line-height: 50px;
  border-radius: 0px !important;
  border-bottom: 1px solid #e6e6e6;
  text-align: left;
  padding-top: 10px;
  padding-left: 10px;
}
.main-container {
  height: 100%;
  transition: margin-left .28s;
  position: relative;
}
.navbar img {
  float: left;

}
.title{
  font-size: 40px;
  font-weight: bold;
  margin-left: 300px;
}


  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

.app-main {
  position: absolute;
  width: 100%;
  bottom: 0px;
  top:80px;
}
</style>
