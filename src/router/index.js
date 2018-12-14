import Vue from 'vue'
import Vuex from 'vuex'

import Router from 'vue-router'
import Main from '@/components/Main'
import Index from '@/components/Index'
import Layout from '@/components/layout/Layout'

Vue.use(Router)
Vue.use(Vuex)

export default new Router({
  routes: [{
      path: '/',
      name: 'Layout',
      component: Layout,
      children:[{
        path: '/',
        name: 'Index',
        component: Index
      },{
        path: '/main',
        name: 'Main',
        component: Main
      }]
    }]
})
