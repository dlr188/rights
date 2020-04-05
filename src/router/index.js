import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/Login'
import Home from 'components/Home'
import User from 'components/User/User'
import Cate from 'components/Goods/Cate'
import Roles from 'components/Roles/Roles'
import Params from 'components/Goods/Params'
import Goods from 'components/Goods/Goods'
import Add from 'components/Goods/Add'
import Order from 'components/Order/Order'
import Report from 'components/Report/Report'
import Rights from 'components/Rights/Rights'

Vue.use(Router)

const router= new Router({
  mode:'history',
  routes: [
    {path: '/',redirect:'/login'},
    {path: '/login',name: 'login',component: Login},
    {path: '/home',name: 'home',component: Home,
      children:[
        {path: '/users',name: 'user',component: User},
        { path: '/rights', name: 'rights',component: Rights },
        { path: '/roles',name: 'roles', component: Roles },
        { path: '/categories',name: 'categories', component: Cate },
        { path: '/params', name: 'params',component: Params },
        { path: '/goods',name: 'goods', component: Goods },
        { path: '/goods/add', name: 'goodsadd',component: Add },
        { path: '/orders', name: 'orders',component: Order },
        { path: '/reports', name: 'reports',component: Report }
      ]
    },
    
  ]
})

// 路由守卫 出登录页面其余均需token验证
router.beforeEach((to, from, next) => {
  if(to.path ==='/login'){
    next()
  }else{
    if(sessionStorage.getItem('token')){
      next()
    }else{
      console.log(to.path)
      next('/login')
    }
  }  
})

  export default router