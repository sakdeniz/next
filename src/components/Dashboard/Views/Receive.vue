<template>
<div class="content">
	<div class="container-fluid">
		<h4 class="card-title"><i class="ion-archive"></i> Receive ({{total_address}} Addresses)</h4>
		<div class="row">
			<div class="col-md-12"><button class="btn btn-success btn-fill" v-on:click="getnewaddress"><i class="ion-asterisk"></i>&nbsp;Get New Address</button></div>
			<div class="col-md-12"><br>
			<div class="ui toggle checkbox">
				<input name="check1" type="checkbox" v-model="checked">
				<label>Hide zero balances</label>
			</div>
			</div>
			<div class="col-md-12"><br>
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
						<div v-bind:id="item.address">{{item.address}}</div>
					</td>
					<td>{{item.balance}}</td>
					<td style="width:100%">{{item.account}}</td>
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
export default {
  data: function() {
    return {
      addresslist: [],
      total_address: 0,
      checked: true
    }
  },
  components: {},
  created: function() {
    this.listaddressgroupings();
  },
  methods: {
    getnewaddress: function(event) {
      axios.post(window.hostname + 'getnewaddress', {token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
		var qrcode=new QRCode(res.data);
		var svg=qrcode.svg();
        swal("Success!", "Address generated\r\n\r\n" + res.data + svg, "success");
      }).catch(function(err) {
        console.log(err);
      })
    },
    copytoclipboard: function(selector) {
      copy(selector);
    },
    getqrcode: function(address) {
		var qrcode = new QRCode(address);
		var svg = qrcode.svg();
		swal("QR Code", address + svg, "info");
    },
    listaddressgroupings: function(event) {
      let vm = this;
      axios.post(window.hostname + 'listaddressgroupings', {token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
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
    }
  },
}
</script>