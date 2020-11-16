<template>
<div class="content">
	<div class="container-fluid">
		<h4 class="card-title"><i class="ion-archive"></i> Receive</h4>
		<div class="row">
			<div class="col-md-12">
			<button class="ui button violet" v-on:click="getnewaddress"><i class="ion-eye"></i>&nbsp;Get New Public Address</button>&nbsp;
			<button class="ui button black" v-on:click="getnewprivateaddress"><i class="ion-eye-disabled"></i>&nbsp;Get New Private Address</button>&nbsp;
			<router-link v-if="coin.bool_support_open_alias=='1'" to="/admin/open-alias"><button class="ui button blue"><i class="ion-arrow-return-right"></i>&nbsp;Open Alias</button></router-link>
			<router-link v-if="coin.bool_support_cold_staking=='1'" to="/admin/cold-staking"><button class="ui button teal"><i class="ion-ios-snowy"></i>&nbsp;Cold Staking</button></router-link>
			</div>
			<div class="col-md-12">
				<div style="margin-top:30px;">
					<sui-checkbox label="Hide zero balances" toggle v-model="checked"/>
				</div>
			</div>
			<div class="col-md-12" style="margin-top:15px;">
			<table class="ui celled padded table">
				<thead>
					<tr>
						<th></th>
						<th>Type</th>
						<th>Address</th>
						<th>Balance</th>
						<th>Account</th>
					</tr>
				</thead>
				<tbody v-if="addresslist.length>0">
					<tr :key=addresslist.address v-for="item of addresslist" v-if="(!checked) || checked && item.balance!='0'">
					<td nowrap>
						<button role="button" title='Copy to clipboard' class='ui icon button' v-on:click='copytoclipboard(item.address)'><i class='ion-android-clipboard'></i></button>
						<button role="button" title='Show QR Code' class='ui icon button' v-on:click='getqrcode(item.address)'><i class='ion-qr-scanner'></i></button>
					</td>
					<td>
						{{(item.address.length=="34"?"Public":"Private")}}
					</td>
					<td>
						<div v-bind:id="item.address"><pre style='width:250px;'>{{item.address}}</pre></div>
					</td>
					<td><pre>{{formatNumbers(item.balance)}}</pre></td>
					<td style="width:100%"><pre>{{item.account}}</pre></td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import axios from 'axios';
import {
  mapState,
  mapActions
} from "vuex";
function errorhandler(data) {
  if (data) {
    if (data["error"]) {
      swal("Error!", data["error"]["message"], "error");
    }
  }
}
export default {
 computed: {
  ...mapState({
     coin: "coin",
	 listunspent: "listunspent",
   })
  },
  data: function() {
    return {
      addresslist: [],
      privateunspentaddresslist:[],
      checked: false
    }
  },
  components: {},
  created: function() {
    this.listaddressgroupings();
    this.listprivateaddresses();
	this.listreceivedbyaddress();
	this.listprivateunspent();
	this.getListUnspent();
  },
  methods: {
   ...mapActions({
	  getListUnspent: "getListUnspent",
    }),
    getnewaddress: function(event) {
      let vm=this;
	  axios.post(window.hostname + 'getnewaddress', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
	    if (res.data)
		{
			if (res.data["error"])
			{
				swal("Error!", res.data["error"]["message"], "error");
			}
			else
			{
				var prefix=vm.coin.qrcode_prefix+":";
				var qrcode=new QRCode(prefix+res.data);
				var svg=qrcode.svg();
				swal({type:"success",title:"Success!",html:"<div>New public address generated</div><div style='margin-top:20px;'><code>" + res.data + "</code></div><div>" + svg + "</div>"});
			}
		}
      }).catch(function(err) {
        console.log(err);
      })
    },
    getnewprivateaddress: function(event) {
      let vm=this;
	  axios.post(window.hostname + 'getnewprivateaddress', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
	    if (res.data)
		{
			if (res.data["error"])
			{
				swal("Error!", res.data["error"]["message"], "error");
			}
			else
			{
				var prefix=vm.coin.qrcode_prefix+":";
				var qrcode=new QRCode(prefix+res.data);
				var svg=qrcode.svg();
				swal({type:"success",title:"Success!",html:"<div>New private address generated</div><div style='margin-top:20px;'><code>" + res.data + "</code></div><div>" + svg + "</div>"});
			}
		}
      }).catch(function(err) {
        console.log(err);
      })
    },
	formatNumbers: function(n) {
	      if (n==undefined) return;
	      var parts = n.toString().split(".");
	      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
	},
    copytoclipboard: function(selector) {
      copy(selector);
    },
    getqrcode: function(address) {
		let vm=this;
		var prefix=vm.coin.qrcode_prefix+":";
		var qrcode=new QRCode(prefix+address);
		var svg=qrcode.svg();
		swal({type:"info",title:"QR Code",html:"<div style='margin-top:20px;'><code>" + address + "</code></div><div>" + svg + "</div>"});
    },
    listaddressgroupings: function(event) {
      let vm=this;
      axios.post(window.hostname + 'listaddressgroupings', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
		if (!res.data["error"])
		{
			var account = "";
			jsonQ.each(res.data, function(key, value)
			{
				jQuery.each(value, function(index, item)
				{
					if (item[2] != undefined) account = item[2]; else account = "";
					vm.addresslist.push({address: item[0],balance: item[1],account: account});
				});
			});
		}
      }).catch(function(err) {
        console.log(err)
      })
    },
    listprivateaddresses: function(event) {
      let vm=this;
      axios.post(window.hostname + 'listprivateaddresses', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
		if (!res.data["error"])
		{
			console.log(res.data);
			var account = "";
			jsonQ.each(res.data, function(key, value)
			{
				vm.addresslist.push({address: value["address"],balance: "0",account: account});
			});
		}
      }).catch(function(err) {
        console.log(err)
      })
    },
    listprivateunspent: function(event) {
      let vm=this;
      axios.post(window.hostname + 'listprivateunspent', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
		if (!res.data["error"])
		{
			jsonQ.each(res.data, function(key, value)
			{
				console.log(value["amount"]);
				vm.privateunspentaddresslist[value["address"]]+=value["amount"];
				vm.addresslist.forEach((element, index) =>
				{
	    			if(element.address === value["address"])
	    			{
	        			vm.addresslist[index].balance=parseFloat(vm.addresslist[index].balance)+parseFloat(value["amount"]);
	    			}
				});
			});

		}
      }).catch(function(err) {
        console.log(err)
      })
    },
  listreceivedbyaddress: function(event) {
      let vm=this;
      axios.post(window.hostname + 'listreceivedbyaddress', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
		if (!res.data["error"])
		{
			vm.addresslist.push({address: res.data,balance: "0",account: account});
		}
      }).catch(function(err) {
        console.log(err)
      })
    }
  }
}
</script>