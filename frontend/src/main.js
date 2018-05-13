// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueSession from 'vue-session'

axios.defaults.baseURL = 'http://localhost:3000'

Vue.prototype.$http = axios

Vue.use(VueSession, {persist: true})
Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  created: function () {
    var _this = this
    axios.interceptors.request.use(function (config) {
      config.headers['x-access-token'] = _this.$session.get('user-token')
      return config
    }, function (error) {
      return Promise.reject(error)
    })
    axios.interceptors.response.use(function (response) {
      console.trace(response)
      return response
    }, function (error) {
      if (error.response && error.response.status === 403) {
        if (!error.config.url.endsWith('/api/auth/login')) {
          console.error(error)
          alert(error.response.data.message)
          location.href = 'login'
          return
        }
      }

      return Promise.reject(error)
    })
  }
})
