<template>
<div class="content">
	<div class="container-fluid">
		<h4 class="card-title"><i class="ion-archive"></i> Receive</h4>
		<div class="row">
			<div class="col-md-12">
			<button class="btn btn-success btn-fill" v-on:click="getnewaddress"><i class="ion-asterisk"></i>&nbsp;Get New Address</button>&nbsp;
			<router-link v-if="coin.bool_support_open_alias=='1'" to="/admin/open-alias"><button class="btn btn-info btn-fill"><i class="ion-arrow-return-right"></i>&nbsp;Open Alias</button></router-link>
			</div>
			<div class="col-md-12">
			<div style="display:none">
				<sui-checkbox label="Hide zero balances" toggle v-model="checked"/>
			</div>
			</div>
			<div class="col-md-12"><br>
			<h4>Available addresses with balance</h4>
			<table style="display:none" class="ui celled padded table">
				<thead>
					<tr>
						<th></th>
						<th>Address</th>
						<th>Balance</th>
						<th style="display:none">Account</th>
					</tr>
				</thead>
				<tbody v-if="listunspent">
					<tr v-for="item of listunspent" v-if="(!checked) || checked && item.amount!='0'">
						<td nowrap>
							<button role="button" title='Copy to clipboard' class='ui icon button' v-on:click='copytoclipboard(item.address)'><i class='ion-android-clipboard'></i></button>
							<button role="button" title='Show QR Code' class='ui icon button' v-on:click='getqrcode(item.address)'><i class='ion-qr-scanner'></i></button>
						</td>
						<td>
						<div v-bind:id="item.address"><pre>{{item.address}}</pre></div>
						</td>
						<td style="width:100%"><pre>{{item.amount}}</pre></td>
						<td style="display:none;width:100%">{{item.account}}</td>
					</tr>
				</tbody>
			</table>
			<table class="ui celled padded table">
				<thead>
					<tr>
						<th></th>
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
						<div v-bind:id="item.address"><pre>{{item.address}}</pre></div>
					</td>
					<td><pre>{{item.balance}}</pre></td>
					<td style="width:100%"><pre>{{item.account}}</pre></td>
					</tr>
				</tbody>
			</table>
			<h4>Available addresses</h4>
			<table class="ui celled padded table">
				<thead>
					<tr>
						<th></th>
						<th>Address</th>
						<th style="display:none">Balance</th>
						<th style="display:none">Account</th>
					</tr>
				</thead>
				<tbody v-if="receivedaddresslist">
					<tr v-for="item of receivedaddresslist">
						<td nowrap>
							<button role="button" title='Copy to clipboard' class='ui icon button' v-on:click='copytoclipboard(item.address)'><i class='ion-android-clipboard'></i></button>
							<button role="button" title='Show QR Code' class='ui icon button' v-on:click='getqrcode(item.address)'><i class='ion-qr-scanner'></i></button>
						</td>
						<td style="width:100%"><div v-bind:id="item.address"><pre>{{item.address}}</pre></div></td>
						<td style="display:none">{{item.amount}}</td>
						<td style="display:none;width:100%">{{item.account}}</td>
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
      total_address: 0,
	  receivedaddresslist:"",
      checked: true
    }
  },
  components: {},
  created: function() {
    this.listaddressgroupings();
	this.listreceivedbyaddress();
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
				swal("Success!", "Address generated\r\n\r\n" + res.data + svg, "success");
			}
		}
      }).catch(function(err) {
        console.log(err);
      })
    },
    copytoclipboard: function(selector) {
      copy(selector);
    },
    getqrcode: function(address) {
		let vm=this;
		var prefix=vm.coin.qrcode_prefix+":";
		var qrcode=new QRCode(prefix+address);
		var svg=qrcode.svg();
		swal("QR Code", address + svg, "info");
    },
    listaddressgroupings: function(event) {
      let vm=this;
      axios.post(window.hostname + 'listaddressgroupings', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
		if (!res.data["error"])
		{
			var account = "";
			var i=0;
			jsonQ.each(res.data, function(key, value)
			{
				jQuery.each(value, function(index, item)
				{
					if (item[2] != undefined) account = item[2]; else account = "";
					vm.addresslist.push({address: item[0],balance: item[1],account: account});
					i++;
				});
				vm.total_address = i;
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
			vm.receivedaddresslist=res.data;
		}
      }).catch(function(err) {
        console.log(err)
      })
    }
  }
}
</script>