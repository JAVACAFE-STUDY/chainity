import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Page404 from '@/views/Page404'
import Page500 from '@/views/Page500'
import Users from '@/views/Users'
import Purchase from '@/views/Purchase'
import Issues from '@/views/Issues'
import IssueDetail from '@/views/IssueDetail'
import NewIssue from '@/views/NewIssue'
import PurchaseList from '@/views/PurchaseList'
import PurchaseDetail from '@/views/PurchaseDetail'
import Profile from '@/views/Profile'
import Approve from '@/views/Approve'
import Receipt from '@/views/Receipt'
import Payments from '@/views/Payments'

import crypto from 'crypto'

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
  next('/login')
}

function decode (encodedData) {
  var decipher = crypto.createDecipher('aes-256-cbc', 'CHANGE_THIS_TO_SOMETHING_RANDOM') // TODO
  var decodedData = decipher.update(encodedData, 'base64', 'utf8')
  decodedData += decipher.final('utf8')
  return decodedData
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
          path: 'purchase',
          name: 'Purchase',
          component: Purchase,
          beforeEnter: requireAuth
        },
        {
          path: 'purchaseList',
          name: 'PurchaseList',
          component: PurchaseList,
          beforeEnter: requireAuth
        },
        {
          path: 'purchaseDetail',
          name: 'PurchaseDetail',
          component: PurchaseDetail,
          beforeEnter: requireAuth
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
          path: 'new-issue',
          name: 'NewIssue',
          component: NewIssue
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile,
          beforeEnter: requireAuth
        },
        {
          path: 'approve',
          name: 'Approve',
          component: Approve,
          beforeEnter: requireAuth
        },
        {
          path: 'receipt',
          name: 'Receipt',
          component: Receipt,
          beforeEnter: requireAuth
        },
        {
          path: 'payments',
          name: 'Payments',
          component: Payments,
          beforeEnter: requireAuth
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/invitation/*',
      beforeEnter: function (to, from, next) {
        try {
          var decodedArray = decode(to.params[0]).split('::')
          next({name: 'Register', params: {_id: decodedArray[0], email: decodedArray[1]}})
        } catch (error) {
          next({name: 'Page500', params: {msg: error.message}})
        }
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      beforeEnter: function (to, from, next) {
        if (to.params._id && to.params.email) {
          next()
        } else {
          next({name: 'Page500', params: {msg: 'Invalid access.'}})
        }
      }
    },
    {
      path: '/500',
      name: 'Page500',
      component: Page500
    },
    {
      path: '/404',
      alias: '*',
      name: 'Page404',
      component: Page404
    }
  ]
})
