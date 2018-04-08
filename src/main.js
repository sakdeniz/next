import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import LightBootstrap from './light-bootstrap-main'
import routes from './routes/routes'
var jsonQ=require("jsonq");
Vue.use(VueRouter)
Vue.use(LightBootstrap)
const router = new VueRouter({
  routes,
  linkActiveClass: 'nav-item active'
})
//window.hostname='http://navcoin-vue.navcommunity.net:3000/';
window.hostname='http://localhost:3000/';
var vm = new Vue({
  el: '#app',
  data:{},
  methods:{}, 
  render: h => h(App),
  router
})