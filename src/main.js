import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import NotFound from './NotFound.vue'
import LightBootstrap from './light-bootstrap-main'
import SuiVue from 'semantic-ui-vue';
import routes from './routes/routes'
var jsonQ=require("jsonq");
Vue.use(VueRouter);
Vue.use(LightBootstrap);
Vue.use(SuiVue);
const router = new VueRouter({
  routes,
  linkActiveClass: 'nav-item active'
})
window.hostname='http://localhost:3000/';
var rpcpassword=document.URL.match(/rpcpassword=([0-9A-Za-z]+)/)
var rpcport=document.URL.match(/rpcport=([0-9]+)/)
if (rpcpassword && rpcport) {
  window.token=rpcpassword[1];
  window.rpcport=rpcport[1];
  window.config={headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
}

var vm

if (!rpcpassword || !rpcport) {
  vm = new Vue({
    el: '#app',
    data:{},
    methods:{},
    render: h => h(NotFound),
    router
  })
} else {
  vm = new Vue({
    el: '#app',
    data:{},
    methods:{},
    render: h => h(App),
    router
  })
}