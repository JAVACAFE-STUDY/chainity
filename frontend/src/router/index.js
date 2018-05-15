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
import Issues from '@/views/Issues'
import IssueDetail from '@/views/IssueDetail'
import AddIssue from '@/views/AddIssue'

Vue.use(Router)

function requireAuth (to, from, next) {
  // TODO
  // get user-token from Local storage with vue-session
  var localSess = localStorage.getItem('vue-session-key')
  if (localSess) {
    localSess = JSON.parse(localSess)
    if (localSess['user-token']) {
      next()
      return
    }
  }
  location.href = 'login'
}

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
          component: Users,
          beforeEnter: requireAuth
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
        },
        {
          path: 'issues',
          name: 'Issues',
          component: Issues
        },
        {
          path: 'issueDetail',
          name: 'IssueDetail',
          component: IssueDetail
        },
        {
          path: 'addIssue',
          name: 'AddIssue',
          component: AddIssue
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
