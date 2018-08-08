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
const urlParams=new URLSearchParams(window.location.search);
const rpcuser=urlParams.get('rpcuser');
const token=urlParams.get('rpcpassword');
const rpcport=urlParams.get('rpcport');
window.isDemo=false;
window.acceptTC=false;
window.config={headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
if (rpcuser && token && rpcport)
{
	window.hostname='http://localhost:3000/';
	window.rpcuser=rpcuser;
	window.token=token;
	window.rpcport=rpcport;
}
else
{
	if (window.isDemo)
	{
		window.hostname='http://navcommunity.net:3000/';
	}
	else
	{
		window.hostname='http://localhost:3000/';
	}
	window.rpcuser="test";
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