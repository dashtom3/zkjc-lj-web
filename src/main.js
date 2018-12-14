// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'element-ui'
import Vuex from 'vuex'
import MuseUI from 'muse-ui'
import MintUI from 'mint-ui';
import theme from 'muse-ui/lib/theme';
import VueAMap from 'vue-amap';
import global from './global/global.js'
import transform from 'coordtransform'
import dtime from 'time-formater'
import 'mint-ui/lib/style.css';
import 'muse-ui/dist/muse-ui.css'
// import 'muse-ui/dist/theme-carbon.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'material-design-icons/iconfont/material-icons.css'
import "babel-polyfill"

Vue.use(VueAMap);
Vue.use(MintUI);
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'e0268e0680ae4032e44af0a21fb7c3a6',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});

theme.use('light');

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(axios)
Vue.use(Vuex)
Vue.use(MuseUI)

Vue.prototype.$dtime = dtime
Vue.prototype.$global = global
Vue.prototype.$transform = transform
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
