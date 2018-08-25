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
import Issue from '@/views/Issue'
import NewIssue from '@/views/NewIssue'
import EditIssue from '@/views/EditIssue'
import TokensRequests from '@/views/TokensRequests'
import Profile from '@/views/Profile'
import Approve from '@/views/Approve'
import Receipt from '@/views/Receipt'
import MyTokens from '@/views/MyTokens'

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
          name: '사용자',
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
          path: 'admin',
          redirect: '/admin/tokens-requests',
          name: '관리자메뉴',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'tokens-requests',
              name: '토큰충전요청',
              component: TokensRequests
            }
          ]
        },
        {
          path: 'issues',
          name: '이슈',
          component: Issues,
          beforeEnter: requireAuth
        },
        {
          path: 'issues/',
          redirect: '/issues',
          name: '이슈',
          component: {
            render (c) { return c('router-view') }
          },
          beforeEnter: requireAuth,
          children: [
            {
              path: 'new-issue',
              name: '생성하기',
              component: NewIssue
            },
            {
              path: ':id',
              name: '상세보기',
              component: Issue
            },
            {
              path: ':id/edit',
              name: '수정하기',
              component: EditIssue
            }
          ]
        },
        {
          path: 'profile',
          name: '프로필',
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
          name: '거래내역',
          component: Receipt,
          beforeEnter: requireAuth
        },
        {
          path: 'my-tokens',
          name: '토큰 관리',
          component: MyTokens,
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
