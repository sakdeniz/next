import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import SuiVue from 'semantic-ui-vue'

import App from './App.vue'
import store from './store'
import routes from './routes/routes'
import LightBootstrap from './light-bootstrap-main'

var jsonQ=require("jsonq");
Vue.use(VueRouter);
Vue.use(LightBootstrap);
Vue.use(SuiVue);

const router = new VueRouter({
  routes,
  linkActiveClass: 'nav-item active'
})

// Old way. New way is using API.js and accessed from the store.js
window.hostname='http://localhost:3000/';
var rpcpassword=document.URL.match(/rpcpassword=([0-9A-Za-z]+)/)
var rpcport=document.URL.match(/rpcport=([0-9]+)/)
if (rpcpassword && rpcport) {
  window.token=rpcpassword[1];
  window.rpcport=rpcport[1];
  window.config={headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
}
// end old way

new Vue({
  el: '#app',
  store: store,
  data:{},
  methods:{},
  render: h => h(App),
  router
})