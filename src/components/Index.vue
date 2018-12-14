<template>
  <div class="main">
    <div>
      <el-carousel height="400px">
        <el-carousel-item v-for="item in picture" :key="item">
          <img :src="item" class="main-img">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="item-main">
      <div v-for="item in blocks" @click=goPage(item[2]) class="item-block">
        <img :src=item[0] style="max-width:100px;max-height:100px">
        <h4>{{item[1]}}</h4>
      </div>
    </div>
    <div class="item-bottom">
      <h2>咨询通告</h2>
      <img src="../assets/welcome.jpg" style="width:100%">
    </div>
  </div>
</template>

<script>


export default {
  name: 'Main',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      picture:[require('../assets/hb_01.jpg'),require('../assets/hb_02.jpg'),require('../assets/hb_03.jpg'),require('../assets/hb_04.jpg')],
      blocks:[[require('../assets/ab_01.png'),'定位系统','Main'],
              [require('../assets/ab_02.png'),'上报事情',''],
              [require('../assets/ab_03.png'),'例会列表',''],
              [require('../assets/ab_04.png'),'综合查询',''],
              [require('../assets/ab_05.png'),'信息录入',''],
              [require('../assets/ab_06.png'),'代办任务',''],
              [require('../assets/ab_06.png'),'奖惩信息','']]
    }
  },
  created(){
  },
  mounted(){

  },
  methods:{
    goPage(val){
      this.$router.push({name:val})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  height: 100%;
  width: 100%;
  text-align: center;
  /* background-color: #eeeeee; */
}
.main-img {
  height: 400px;
}
.item-main {
  width: 60%;
  margin: auto;
  text-align: left;
  margin-top: 40px;
  margin-bottom: 40px;
}
.item-block {
  /* margin: 20px; */

  text-align: center;
  width: 33%;
  display: inline-block;
}
.item-bottom {
  text-align: left;
}
.item-bottom h2 {
  margin-left: 300px;
}

</style>
