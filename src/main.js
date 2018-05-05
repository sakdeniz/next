import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import SuiVue from 'semantic-ui-vue'

import App from './App.vue'
import store from './store'
import routes from './routes/routes'
import LightBootstrap from './light-bootstrap-main'

var vm;
var jsonQ=require("jsonq");
Vue.use(VueRouter);
Vue.use(LightBootstrap);
Vue.use(SuiVue);

const router = new VueRouter({
const router=new VueRouter({
  routes,
  linkActiveClass: 'nav-item active'
})

new Vue({
  el: '#app',
  store: store,
  data:{},
  methods:{},
  render: h => h(App),
  router
})
if (!rpcpassword || !rpcport)
{
	vm = new Vue({
	el: '#app',
	data:{},
	methods:{},
	render: h => h(NotFound),
	router
	})
}
else
{
	vm = new Vue({
	el: '#app',
	data:{},
	methods:{},
	render: h => h(App),
	router
	})
}