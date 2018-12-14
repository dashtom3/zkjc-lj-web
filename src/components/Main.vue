<template>
  <div class="main">
    <div class="left-content">
      <div class="block">
        <div class="title"><h4>垃圾车</h4></div>
        <div class="tem-table">
          <el-table
            border
            size="mini"
            :data="carData"
            @current-change="selectCarData"
            style="width: 100%">
            <el-table-column
              prop="carName"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机" width="100">
            </el-table-column>
            <el-table-column
              prop="carNumber"
              label="车牌">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="block">
        <div class="title"><h4>环卫工</h4></div>
        <div class="tem-table">
          <el-table
            border
            size="mini"
            :data="personData"
            @current-change="selectPersonData"
            style="width: 100%">
            <el-table-column
              prop="personName"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机" width="100">
            </el-table-column>
            <el-table-column
              prop="kind"
              label="分工">
            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>
    <div class="amap-wrapper" v-loading="loading" element-loading-text="读取路径数据中">
      <el-button @click="cleanPoly" size="small" class="clean-btn">清空路径</el-button>
      <el-amap vid="amapDemo" :zoom="map.zoom" :center="map.position">
        <template v-for="items in markers">
          <el-amap-marker v-for="item in items" :position="item.position" :events="item.events" :visible="item.visible"
                 :offset="item.offset" :content="item.content" :zIndex="item.zIndex"></el-amap-marker>
        </template>
        <el-amap-polyline  :path="polyline.path" :visible="polyline.visible"></el-amap-polyline>

      </el-amap>
    </div>
    <div class="right-content">
      <div class="block2">
      <div class="title"><h4>垃圾桶</h4></div>
      <div class="tem-table2">
        <el-table
          border
          size="mini"
          :data="binData"
          style="width: 100%">
          <el-table-column
            prop="binName"
            label="地区">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <span>未满</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="temperature"
            label="温度">
          </el-table-column>
        </el-table>
      </div>
      </div>
    </div>
    <el-dialog
      title="选择起始日期"
      :visible.sync="isSelectOpen"
      width="60%">
        <el-date-picker
          v-model="datePicker"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSelectOpen = false">取 消</el-button>
        <el-button type="primary" @click="selectDate">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import html2canvas from 'html2canvas';
import { AMapManager } from 'vue-amap';


export default {
  name: 'Main',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      mode:0,
      isSelectOpen:false,
      loading:false,
      datePicker:[new Date(new Date().getTime()-6*60*60*1000),new Date()],
      personData:[],
      binData:[],
      carData:[],
      selectData:null,
      polyline:{
        visible:false,
        path:[]
      },
      map:{
        zoom:11,
        position:[121.5273285, 31.21715058]
      },
      markers:[],
      tInterval:null,
      sInterval:null,
      number:0,
    }
  },
  created(){
    this.init()
  },
  mounted(){

  },
  methods:{
    async init(){

      await this.getPerson()
      await this.getBin()
      await this.getCar()
      await this.getPosition()
      this.tInterval = setInterval(()=>{
        this.getPosition()
      },10000)
      this.sInterval = setInterval(()=>{
        this.nextStep()
      },1000)
    },
    async getBin(){
      const res = await this.$global.httpGet(this,'Bins')
      this.binData = res.data
      console.log(1,res)
    },
    async getPerson(){
      const res = await this.$global.httpGet(this,'Persons')
      this.personData = res.data
      console.log(2,res)
    },
    async getCar(){
      const res = await this.$global.httpGet(this,'Cars')
      this.carData = res.data
      console.log(3,res)
    },
    async getPosition(){
      const res = await this.$global.httpGet(this,'Positions')
      this.addMarker(res.data)
    },
    cleanPoly(){
      this.polyline.path = []
      this.polyline.visible = false
    },
    selectCarData(val){
      this.map.zoom = 13
      this.markers.forEach(item=>{
        if(item[0].data.id == val.employeeId){
          this.map.position = item[0].position
          item[1].visible = true
        }else {
          item[1].visible = false
        }
      })
    },
    selectPersonData(val){
      this.markers.forEach(item=>{
        if(item[0].data.id == val.employeeId){
          this.map.zoom = 13
          this.map.position = item[0].position
          item[1].visible = true
        }else {
          item[1].visible = false
        }
      })
    },
    nextStep(){
      this.markers.forEach(item=>{
        if(item[0].data.times < 10){
          var temp = [item[0].position[0]+(item[0].data.target[0]-item[0].position[0])/(10-item[0].data.times),item[0].position[1]+(item[0].data.target[1]-item[0].position[1])/(10-item[0].data.times)]
          item[0].position = temp
          item[1].position = temp
        }else {
          item[0].position =[item[0].data.target[0],item[0].data.target[1]]
          item[1].position =[item[0].data.target[0],item[0].data.target[1]]
        }
        item[0].data.times++;
      })
    },
    showReplay(item){

      this.selectData = item[0].data
      this.isSelectOpen = !this.isSelectOpen

    },
    selectDate(){
      // console.log(this.datePicker,this.$dtime(this.datePicker[0]).format('YYYY-MM-DD HH:mm:ss'),this.$dtime(this.datePicker[1]).format('YYYY-MM-DD HH:mm:ss'))
      this.isSelectOpen = !this.isSelectOpen
      this.loading = true
      var temp = {startDay:this.$dtime(this.datePicker[0]).format('YYYY-MM-DD HH:mm:ss'),endDay:this.$dtime(this.datePicker[1]).format('YYYY-MM-DD HH:mm:ss')}
      this.$global.httpGet(this,'Stores/'+this.selectData.id,temp).then(res=>{
        this.loading = false

        var tempRes = []
        var tempQ = []
        res.data.forEach(item=>{
          var tempCoord = this.$transform.wgs84togcj02(item.longitude,item.latitude)
          item.longitude = tempCoord[0]
          item.latitude = tempCoord[1]
          if(tempQ.length == 0) {
            tempQ = [item.longitude,item.latitude]
          }else if(tempQ[0] != item.longitude || tempQ[1] != item.latitude){
            tempRes.push([item.longitude,item.latitude])
          }
        })
        this.polyline.path = tempRes
        this.polyline.visible = true
      })

    },
    addMarker(data){
      data.forEach((item,index)=>{
        var tempCoord = this.$transform.wgs84togcj02(item.longitude,item.latitude)
        item.longitude = tempCoord[0]
        item.latitude = tempCoord[1]
        if(index == 0 && this.markers.length <1){
          this.map.position = [item.longitude,item.latitude]
        }
        var temp = false
        this.markers.forEach(marker=>{
          if(marker[0].data.id == item.employeeId){
            temp = true

            marker[0].data.target = [item.longitude,item.latitude],
            marker[0].data.times = 0
          }
        })
        if(temp == false){
          var marker = [{
              content: '',
              position:[item.longitude,item.latitude],
              offset:[0,0],
              data:{
                id:item.employeeId,
                target:[item.longitude,item.latitude],
                times:0,
                kind:item.kind
              },
              events: {
                click: () => {
                  if(marker[0].data.kind !='bin'){
                    marker[1].visible = !marker[1].visible
                  }
                }
              },
              zIndex:item.kind == 'car'? 2:1,
              visible:true
          },{
              content: '<div style="width:200px;height:30px;text-align:left;background-color:white;border-radius:4px;border:1px solid #666666;padding:4px"><el-button size="mini" style="background-color:#cccccc;padding:3px;color:#333333 !important;">回放</el-button><span style="padding-left:5px">编号:'+item.employeeId+'</span></div>',
              position:[item.longitude,item.latitude],
              offset:[20,-20],
              events: {
                click: () => {
                  // this.$router.push({name:"user_data",params:""})
                  this.showReplay(marker)
                  marker[1].visible = !marker[1].visible
                }
              },
              zIndex:3,
              visible:false
          }]
          //
          var tempImg
          if(item.kind == 'bin'){
            tempImg = require('../assets/bin.png')
            marker[0].content = '<div style="width:25px;text-align:center;"><img src="'+tempImg+'" style="width:100%"></div>'
          }else if(item.kind == 'car'){
            tempImg = require('../assets/car.png')
            marker[0].content = '<div style="width:25px;text-align:center;"><img src="'+tempImg+'" style="width:100%"></div>'
            this.carData.forEach(item2=>{
              if(item2.employeeId == item.employeeId){
                marker[0].content = '<div style="width:60px;text-align:center"><img src="'+tempImg+'" style="width:25px"><div style="font-size:12px;background-color:white;margin-top:-10px">'+item2.carNumber+'</div></div>'
              }
            })
          }else if(item.kind == 'person'){
            tempImg = require('../assets/person.png')
            marker[0].content = '<div style="width:25px;text-align:center;"><img src="'+tempImg+'" style="width:100%"></div>'
            this.personData.forEach(item2=>{
              if(item2.employeeId == item.employeeId){
                marker[0].content = '<div style="width:40px;text-align:center;"><img src="'+tempImg+'" style="width:25px"><div style="font-size:12px;background-color:white;margin-top:-10px">'+item2.personName+'</div></div>'
              }
            })
          }
          this.markers.push(marker)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  height: 100%;
  width: 100%;
  background-color: #eeeeee;
}

.amap-wrapper {
  width: 55%;
  /* height:100vh; */
  height: 100%;
  float: left;
  /* display: inline-block; */
  position:relative;
  z-index: 1;
}
.clean-btn{
  right: 0;
  position: absolute;
  z-index:2;
}
.left-content {
  width:25%;
  float: left;
  padding:10px;
  height: 100%;
}
.tem-table {
  overflow-y: scroll;
  height: 80%;
}
.tem-table2 {
  overflow-y: scroll;
  height: 90%;
}
.right-content {
  width: 20%;
  display: inline-block;
  padding:10px;
  float: left;
  height: 100%;
}
.block{
  height: 50%;
  border:1px solid #cccccc;
  background-color: white;
}
.block2 {
  border:1px solid #cccccc;
  background-color: white;
  height: 100%;
}
.title {
  background-color: #eeeeee;
}
.title h4 {
  margin:0px;
  padding:10px;
}

</style>
