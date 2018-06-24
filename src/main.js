import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import SuiVue from 'semantic-ui-vue'
import App from './App.vue'
import NotFound from './NotFound.vue'
import store from './store'
import routes from './routes/routes'
import LightBootstrap from './light-bootstrap-main'
var vm;
var jsonQ=require("jsonq");
Vue.use(VueRouter);
Vue.use(LightBootstrap);
Vue.use(SuiVue);
const router=new VueRouter({
  routes,
  linkActiveClass: 'nav-item active'
})
//
const urlParams=new URLSearchParams(window.location.search);
const token=urlParams.get('rpcpassword');
const rpcport=urlParams.get('rpcport');
const warning=urlParams.get('warning');
//
window.isDemo=false;
window.acceptTC=false;
window.config={headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
//
if (token && rpcport && warning)
{
	window.hostname='http://localhost:3000/';
	window.token=token;
	window.rpcport=rpcport;
	window.warning=warning;
}
else
{
	if (window.isDemo) window.hostname='http://navcommunity.net:3000/'; else window.hostname='http://localhost:3000/';
	window.token="test";
	window.rpcport="44445";
	window.warning="0";
}
new Vue({
  el: '#app',
  store: store,
  data:{},
  methods:{},
  render: h => h(App),
  router
})

/*if (!rpcpassword || !rpcport)
{
	vm = new Vue({
	el: '#app',
	data:{},
	methods:{},
	render: h => h(NotFound),
	router
	})
}*/