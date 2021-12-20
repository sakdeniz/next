<template>
<div class="content">
	<div class="container-fluid">
		<div class="content">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-6">
						<div class="card">
							<div class="card-header">
								<h4 class="card-title">Create Token</h4>
							</div>
							<div class="card-body">
								<div class="form-group">
									Name :
									<input type="text" class="form-control" style="width:100%;" v-model="name"/>
								</div>
								<div class="form-group">
									Symbol :
									<input type="text" class="form-control" style="width:100%;" v-model="symbol"/>
								</div>
								<div class="form-group">
									Max Supply :
									<input type="text" class="form-control" style="width:100%;" v-model="max_supply"/>
								</div>
								<div class="form-group">
									<button class='btn btn-fill btn-info' v-on:click='createToken'><i class="ion-asterisk"></i>&nbsp;Create</button>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-6">
						<div class="card">
							<div class="card-header">
								<h4 class="card-title">Mint / Burn Token</h4>
							</div>
							<div class="card-body">
								<div class="form-group">
									Token :
									<select class="form-control form-control-lg" v-model="mint_token_id">
										<option v-bind:value="item.id" v-for="(item,index) in tokens.filter(item => item.version==0)">{{item.name}}</option>
									</select>
								</div>
								<div class="form-group">
									Target Address : 
									<select class="form-control form-control-lg" v-model="mint_token_destination">
										<option v-for="(item,index) in address_list"><pre>{{item.text}}</pre></option>
									</select>
								</div>
								<div class="form-group">
									Amount :
									<input type="text" class="form-control" style="width:100%;" v-model="mint_token_amount"/>
								</div>
								<div class="form-group">
									<button class='btn btn-fill btn-success' v-on:click='mintToken'><i class="ion-hammer"></i>&nbsp;Mint</button>&nbsp;&nbsp;&nbsp;
									<button class='btn btn-fill btn-danger' v-on:click='burnToken'><i class="ion-flame"></i>&nbsp;Burn</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<h4 class="card-title"><i class="ion-grid"></i> Available Tokens</h4>
				<div class="row">
					<div class="col-md-12">
						<div class="card">
							<div class="card-body">
								<!--<div class="form-group">
									<button class='btn btn-fill btn-info' v-on:click='listTokens'><i class="ion-hammer"></i>&nbsp;Refresh</button>
								</div>!-->
								<table class="table table-bordered table-striped">
									<thead>
										<th>
											ID
										</th>
										<th>
											Name
										</th>
										<th>
											Symbol
										</th>
										<th>
											Current Supply
										</th>
										<th>
											Max Supply
										</th>
										<th>
											Balance
										</th>
									</thead>
									<tbody>
										<tr v-for="(item,index) in tokens.filter(item => item.version==0)">
											<td>
												<pre>{{item.id}}</pre>
											</td>
											<td>
												{{item.name}}
											</td>
											<td>
												{{item.token_code}}
											</td>
											<td>
												{{item.current_supply}}
											</td>
											<td>
												{{item.max_supply}}
											</td>
											<td>
												{{item.balance}}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script type="text/javascript">
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";

export default {
	data: function ()
	{
		return {
			name:'',
			symbol:'',
			max_supply: 0,
			tokens:[],
			address_list: [],
			mint_token_id:'',
			mint_token_destination:'',
			mint_token_amount:0
		}
	},
	computed:
	{
	},
	created: function()
	{
		this.listTokens();
		this.listPrivateAddresses();
	},
	methods:
	{
		listPrivateAddresses: function()
		{
			let vm=this;
			axios.post(window.hostname + 'listprivateaddresses', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
			{
				console.log(res.data);
				if (!res.data["error"])
				{
					console.log(res.data);
					var account = "";
					var i=0;
					jsonQ.each(res.data, function(key, value)
					{
						vm.address_list.push({text: value["address"],value: value["address"]});
					});
				}
			}).catch(function(err)
			{
				console.log(err)
			})
		},
		createToken: function()
		{
			console.log(this.name);
			console.log(this.symbol);
			console.log(this.max_supply);
			console.log("Creating...");
			axios.post(window.hostname + 'createtoken', {
				rpcuser: window.rpcuser,
				token: window.token,
				rpcport: window.rpcport,
				name: this.name,
				symbol: this.symbol,
				max_supply: this.max_supply
			}, window.config).then(function(res) {
			console.log("Status:" + res.status)
			console.log("Return:" + res.data)
			if (!res.data["error"])
			{
				this.name='';
				this.symbol='';
				this.max_supply=0;
				swal({type: 'success',title: 'Success!',html: "Token creation success!"});
			}
			else
			{
				swal({
					type: 'warning',
					title: 'Oops...',
					text: res.data["error"]["message"]
				});
			}
			}).catch(function(err)
			{
				console.log(err);
			})
		},
		mintToken: function()
		{
			console.log(this.mint_token_id);
			console.log(this.mint_token_destination);
			console.log(this.mint_token_amount);
			console.log("Minting...");
			axios.post(window.hostname + 'minttoken', {
				rpcuser: window.rpcuser,
				token: window.token,
				rpcport: window.rpcport,
				mint_token_id: this.mint_token_id,
				mint_token_destination: this.mint_token_destination,
				mint_token_amount: this.mint_token_amount
			}, window.config).then(function(res) {
			console.log("Status:" + res.status)
			console.log("Return:" + res.data)
			if (!res.data["error"])
			{
				swal({type: 'success',title: 'Success!',html: "Token minting success!"});
			}
			else
			{
				swal({
					type: 'warning',
					title: 'Oops...',
					text: res.data["error"]["message"]
				});
			}
			}).catch(function(err)
			{
				console.log(err);
			})
		},
		burnToken: function()
		{
			console.log(this.mint_token_id);
			console.log(this.mint_token_amount);
			console.log("Burning...");
			axios.post(window.hostname + 'burntoken', {
				rpcuser: window.rpcuser,
				token: window.token,
				rpcport: window.rpcport,
				mint_token_id: this.mint_token_id,
				mint_token_amount: this.mint_token_amount
			}, window.config).then(function(res) {
			console.log("Status:" + res.status)
			console.log("Return:" + res.data)
			if (!res.data["error"])
			{
				swal({type: 'success',title: 'Success!',html: "Token burning success!"});
			}
			else
			{
				swal({
					type: 'warning',
					title: 'Oops...',
					text: res.data["error"]["message"]
				});
			}
			}).catch(function(err)
			{
				console.log(err);
			})
		},
		listTokens: function()
		{
			let vm=this;
			axios.post(window.hostname + 'listtokens', {
				rpcuser: window.rpcuser,
				token: window.token,
				rpcport: window.rpcport
			}, window.config).then(function(res) {
			console.log("Status:" + res.status)
			console.log("Return:" + res.data)
			if (!res.data["error"])
			{
				vm.tokens=res.data;
			}
			else
			{
				swal({
					type: 'warning',
					title: 'Oops...',
					text: res.data["error"]["message"]
				});
			}
			}).catch(function(err)
			{
				console.log(err);
			})
		}
	}
}
</script>