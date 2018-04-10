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
var arr=document.URL.match(/rpcpassword=([0-9A-Za-z]+)/)
window.token=arr[1];
window.hostname='http://localhost:3000/';
window.config={headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
var vm = new Vue({
  el: '#app',
  data:{},
  methods:{}, 
  render: h => h(App),
  router
})