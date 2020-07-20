import Vue from 'vue'
import App from './App'
import store from './store'
import hxNavbar from "./components/hx-navbar/hx-navbar.vue"
Vue.component('hx-navbar',hxNavbar)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
  store,
})
app.$mount()
