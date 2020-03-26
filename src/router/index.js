import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import Goods from '@/components/Goods/Goods'

Vue.use(Router)

export default new Router({
  module:history,
  routes: [
    {path: '/',redirect:'/home'},
    {path: '/home',name: 'home',component: Home},
    {path: '/goods',name: 'goods',component: Goods}

  ]
})
