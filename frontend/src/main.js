// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueSession from 'vue-session'
import HttpStatus from 'http-status'
import moment from 'moment'
import Vuelidate from 'vuelidate'
import Toastr from 'vue-toastr'

axios.defaults.baseURL = 'http://localhost:3000'

Vue.prototype.$http = axios
Vue.prototype.$eventHub = new Vue()

Vue.use(require('vue-moment'), {moment})
Vue.use(VueSession, {persist: true})
Vue.use(BootstrapVue)
Vue.use(Vuelidate)
require('vue-toastr/src/vue-toastr.scss')
Vue.use(Toastr)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  },
  created: function () {
    this.$toastr.defaultPosition = 'toast-bottom-right'
    this.$toastr.defaultProgressBar = false
    var _this = this
    axios.interceptors.request.use(function (config) {
      config.headers['Authorization'] = 'Bearer ' + _this.$session.get('user-token')
      return config
    }, function (error) {
      return Promise.reject(error)
    })
    axios.interceptors.response.use(function (response) {
      console.trace(response)
      return response
    }, function (error) {
      if (error.response && error.response.status === HttpStatus.UNAUTHORIZED) {
        if (!error.config.url.endsWith('/api/auth/login')) {
          console.error(error)
          location.href = '/login'
          return
        }
      }

      return Promise.reject(error)
    })
  }
})
