import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Login from '@/views/Login'
import Users from '@/views/Users'
import MyTokenBalance from '@/views/MyBalance'
import Purchase from '@/views/Purchase'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'users',
          name: 'Users',
          component: Users
        },
        {
          path: 'mybalance',
          name: 'MyBalance',
          component: MyTokenBalance
        },
        {
          path: 'purchase',
          name: 'Purchase',
          component: Purchase
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
