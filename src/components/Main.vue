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
      <div class="clean-btn">
        <el-radio v-model="checkSelect" :label="index" v-for="(item,index) in checkBox" @change="clickCheckBox">{{item}}</el-radio>

        <el-button @click="cleanPoly" size="small" >清空路径</el-button>
      </div>

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
      checkBox:['全部','人员','车辆','垃圾桶'],
      checkSelect:'全部',
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
    getRad(d){
        var PI = Math.PI;
        return d*PI/180.0;
    },
    getFlatternDistance(lat1,lng1,lat2,lng2){
        var EARTH_RADIUS = 6378137.0;
        var f = this.getRad((lat1 + lat2)/2);
        var g = this.getRad((lat1 - lat2)/2);
        var l = this.getRad((lng1 - lng2)/2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s,c,w,r,d,h1,h2;
        var a = EARTH_RADIUS;
        var fl = 1/298.257;

        sg = sg*sg;
        sl = sl*sl;
        sf = sf*sf;

        s = sg*(1-sl) + (1-sf)*sl;
        c = (1-sg)*(1-sl) + sf*sl;

        w = Math.atan(Math.sqrt(s/c));
        r = Math.sqrt(s*c)/w;
        d = 2*w*a;
        h1 = (3*r -1)/2/c;
        h2 = (3*r +1)/2/s;

        return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
    },
    clickCheckBox(val){
      switch (val) {
        case 0:
          this.showMarkers()
          break;
        case 1:
          this.showMarkers('person')
          break;
        case 2:
          this.showMarkers('car')
          break;
        case 3:
          this.showMarkers('bin')
          break;
        default:

      }
    },
    showMarkers(val){
      this.markers.forEach(item=>{
        if(val == null || item[0].data.kind == val){
          item[0].visible = true
        }else {
          item[0].visible = false
          item[1].visible = false
        }
      })
    },
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

            marker[0].data.target = [item.longitude,item.latitude]
            if(marker[0].data.kind == 'car'){
              var tempImg = item.longitude > marker[0].position[0]? require('../assets/car_r.png'):require('../assets/car_l.png')
              marker[0].content = '<div style="width:60px;text-align:center"><img src="'+tempImg+'" style="width:25px"><div style="font-size:12px;background-color:white;margin-top:-10px">'+marker[0].data.carNumber+'</div></div>'
            }
            marker[0].data.times = 0
            if(this.getFlatternDistance(marker[0].position[0],marker[0].position[1],item.longitude,item.latitude)>2000){
              marker[0].position = [item.longitude,item.latitude],
              marker[1].position = [item.longitude,item.latitude]
            }
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
                  // if(marker[0].data.kind !='bin'){
                  this.markers.forEach(item=>{
                    item[1].visible = false
                  })
                  marker[1].visible = !marker[1].visible
                  // }
                }
              },
              zIndex:item.kind == 'car'? 2:1,
              visible:true
          },{
              content: '',
              position:[item.longitude,item.latitude],
              offset:[40,-20],
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
            // marker[1].content = '<div style="width:200px;height:30px;text-align:left;background-color:white;border-radius:4px;border:1px solid #666666;padding:4px"><el-button size="mini" style="background-color:#cccccc;padding:3px;color:#333333 !important;">回放</el-button><span style="padding-left:5px">编号:'+item.employeeId+'</span></div>',
            this.binData.forEach(item2=>{
              if(item2.employeeId = item.employeeId){
                var tempR = item2.currentV != item2.maxV ? '未满':'已满'
                marker[1].content = '<div style="width:200px;height:140px;text-align:left;background-color:white;border-radius:4px;border:1px solid #666666;padding:4px">'
                +'<table style="width:100%"><tr><td>编号</td><td>'+item2.employeeId+'</td></tr><tr><td>名称</td><td>'+item2.binName+'</td></tr><tr><td>乡镇</td><td>'+item2.area+'</td></tr><tr><td>温度</td><td>'+item2.temperature+'</td></tr><tr><td>容量</td><td>'+tempR+'</td></tr></table></div>'
              }

            })
          }else if(item.kind == 'car'){
            tempImg = require('../assets/car_l.png')
            marker[0].content = '<div style="width:25px;text-align:center;"><img src="'+tempImg+'" style="width:100%"></div>'
            this.carData.forEach(item2=>{
              if(item2.employeeId == item.employeeId){
                var tempQQ = item2.carNumber == '临时牌照'? item2.carName:item2.carNumber
                marker[0].data.carNumber = tempQQ
                marker[0].content = '<div style="width:60px;text-align:center"><img src="'+tempImg+'" style="width:25px"><div style="font-size:12px;background-color:white;margin-top:-10px">'+tempQQ+'</div></div>'
                marker[1].content = '<div style="width:200px;height:160px;text-align:left;background-color:white;border-radius:4px;border:1px solid #666666;padding:4px">'
                +'<el-button size="mini" style="background-color:#cccccc;padding:3px;color:#333333 !important;">回放</el-button><span style="padding-left:5px">编号:'+item.employeeId+'</span>'
                +'<div style="width=100%;height:1px;background-color:#999999;margin-top:3px"></div>'
                +'<table style="width:100%"><tr><td>车牌号</td><td>'+item2.carNumber+'</td></tr><tr><td>类型</td><td>'+item2.carType+'</td></tr><tr><td>姓名</td><td>'+item2.carName+'</td></tr><tr><td>乡镇</td><td>'+item2.area+'</td></tr><tr><td>手机号</td><td>'+item2.phone+'</td></tr></table></div>'
              }
            })
          }else if(item.kind == 'person'){
            tempImg = require('../assets/person.png')
            marker[0].content = '<div style="width:25px;text-align:center;"><img src="'+tempImg+'" style="width:100%"></div>'
            this.personData.forEach(item2=>{
              if(item2.employeeId == item.employeeId){
                marker[0].content = '<div style="width:40px;text-align:center;"><img src="'+tempImg+'" style="width:25px"><div style="font-size:12px;background-color:white;margin-top:-10px">'+item2.personName+'</div></div>'
                marker[1].content = '<div style="width:200px;height:180px;text-align:left;background-color:white;border-radius:4px;border:1px solid #666666;padding:4px">'
                +'<el-button size="mini" style="background-color:#cccccc;padding:3px;color:#333333 !important;">回放</el-button><span style="padding-left:5px">编号:'+item.employeeId+'</span>'
                +'<div style="width=100%;height:1px;background-color:#999999;margin-top:3px"></div>'
                +'<table style="width:100%"><tr><td>姓名</td><td>'+item2.personName+'</td></tr><tr><td>职务</td><td>'+item2.job+'</td></tr><tr><td>工种</td><td>'+item2.kind+'</td></tr><tr><td>乡镇</td><td>'+item2.area+'</td></tr><tr><td>手机</td><td>'+item2.phone+'</td></tr></table></div>'
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
/* table,table tr th, table tr td { border:1px solid #0094ff; } */
.main{
  height: 100%;
  width: 100%;
  background-color: #eeeeee;
}

.amap-wrapper {
  width: 60%;
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
  background-color: white;
  border:1px solid #eeeeee;
  padding-left: 10px;
}
.left-content {
  width:20%;
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
