import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import ManageMetadata from '@/pages/ManageMetadata'
import ManageUser from '@/pages/ManageUser'
import ManageChance from '@/pages/ManageChance'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      // name: 'HelloWorld',
      // component: HelloWorld
      redirect: '/home/chanceManager'
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [{
        path: '/home',
        redirect: '/home/chanceManager'
      },
      {
        path: 'userManager',
        name: '用户管理',
        meta: {
          requiredAuth: true
        },
        component: ManageUser
      },
      {
        path: 'metadataManager',
        name: '元数据管理',
        meta: {
          requiredAuth: true
        },
        component: ManageMetadata
      },
      {
        path: 'chanceManager',
        name: '机会管理',
        meta: {
          requiredAuth: true
        },
        component: ManageChance
      }]
    }
  ]
})
