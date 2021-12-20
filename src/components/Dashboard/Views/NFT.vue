<template>
<div class="content">
	<div class="container-fluid">
		<div class="content">
			<div class="container-fluid">
				<div class="ui top attached tabular menu">
					<a class="item active" data-tab="first">NFTs</a>
					<a class="item" data-tab="second">Create</a>
					<a class="item" data-tab="third">Mint</a>
				</div>
				<div class="ui bottom attached tab segment active" data-tab="first">
					<div class="row">
						<div class="col-md-12">
							<h4 class="card-title"><i class="ion-grid"></i> NFTs ({{tokens.filter(item => item.version==1).length}})</h4>
							<div class="ui styled fluid accordion">
								<template v-for="(item,index) in tokens.filter(item => item.version==1)">
									<div class="title">
										<i class="dropdown icon"></i>
										{{item.name}}
									</div>
									<div class="content">
										<p>Current Supply : {{item.current_supply}}</p>
										<p>Max Supply : {{item.max_supply}}</p>
										<h3>Schema</h3>
										<pre v-if="item.scheme!=''" v-html="syntaxHighlight(item.scheme)">
										</pre>
										<h3>NFTs</h3>
										<table class="ui collapsing striped table" v-if="item.nfts.length>0">
											<thead>
												<th>
													ID
												</th>
												<th>
													Balance
												</th>
												<th>
													Metadata
												</th>
											</thead>
											<tbody>
												<tr v-for="(item,index) in item.nfts">
													<td>
														{{item.index}}
													</td>
													<td>
														{{item.balance}}
													</td>
													<td>
														<code>{{item.metadata}}</code>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</template>
							</div>
						</div>
					</div>
				</div>
				<div class="ui bottom attached tab segment" data-tab="second">
					<div class="row">
						<div class="col-md-12">
							<h4 class="card-title">Create NFT</h4>
							<div class="form-group">
								NFT Name :
								<input type="text" class="form-control" style="width:100%;" v-model="name"/>
							</div>
							<div class="form-group">
								<JsonEditor
									:options="{
									confirmText: 'confirm',
									cancelText: 'cancel',
									}"
									:objData="jsonData" 
									v-model="jsonData" >
								</JsonEditor>
								Scheme :
								<textarea class="form-control" style="width:100%;height:200px;" v-model="scheme"></textarea>
							</div>
							<div class="form-group">
								Max Supply :
								<input type="number" class="form-control" style="width:100%;" v-model="max_supply"/>
							</div>
							<div class="form-group">
								<button class='btn btn-fill btn-info' v-on:click='createNFT'><i class="ion-asterisk"></i>&nbsp;Create</button>
							</div>
						</div>
					</div>
				</div>
				<div class="ui bottom attached tab segment" data-tab="third">
					<div class="row">
						<div class="col-md-12">
							<h4 class="card-title">Mint NFT</h4>
							<div class="form-group">
								NFT :
								<select class="form-control form-control-lg" v-model="mint_token_id">
									<option v-bind:value="item.id" v-for="(item,index) in tokens.filter(item => item.version==1)">{{item.name}}</option>
								</select>
							</div>
							<div class="form-group">
								NFT ID :
								<input type="number" class="form-control" style="width:100%;" v-model="mint_nft_id"/>
							</div>
							<div class="form-group">
								Target Address : 
								<select class="form-control form-control-lg" v-model="mint_nft_destination">
									<option v-for="(item,index) in address_list"><pre>{{item.text}}</pre></option>
								</select>
							</div>
							<div class="form-group">
								Metadata :
								<JsonEditor
									:options="{
									confirmText: 'confirm',
									cancelText: 'cancel',
									}"
									:objData="jsonMetaData" 
									v-model="jsonMetaData" >
								</JsonEditor>
								<textarea class="form-control" style="width:100%;height:200px;" v-model="mint_nft_meta_data"></textarea>
							</div>
							<div class="form-group">
								<button class='btn btn-fill btn-success' v-on:click='mintNFT'><i class="ion-hammer"></i>&nbsp;Mint</button>&nbsp;&nbsp;&nbsp;
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<style>
	pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
	.string { color: green; }
	.number { color: darkorange; }
	.boolean { color: blue; }
	.null { color: magenta; }
	.key { color: red; }
	.add-form {font-size: 10pt !important}
	.val-input {width: 300px !important;color:#232323 !important}
	.val-input:hover {background: #f3f3f3 !important;}
	.val-input:focus {border:1px solid #cfcfcf !important;background: #F9F9F9 !important;}
	.pure-form input[type=text],
	.pure-form input[type=number],
	.pure-form input[type=search],
	.pure-form input[type=tel],
	.pure-form input[type=color],
	.pure-form input[type=password],
	.pure-form input[type=email],
	.pure-form input[type=url],
	.pure-form input[type=date],
	.pure-form input[type=month],
	.pure-form input[type=time],
	.pure-form input[type=datetime],
	.pure-form input[type=datetime-local],
	.pure-form input[type=week],
	.pure-form select,
	.pure-form textarea {
	    padding: 3px;
	    display: inline-block;
	    border: 1px solid #ccc;
	    box-shadow: inset 0 1px 3px #ddd;
	    border-radius: 4px;
	    vertical-align: middle;
	    box-sizing: border-box;
	}
	.add-key {font-size: 14pt !important};
</style>
<script type="text/javascript">
import Vue from "vue";
import JsonEditor from 'vue-json-edit'
Vue.use(JsonEditor)
import {
  mapState,
  mapActions
} from "vuex";

export default {
	data: function ()
	{
		return {
			name:'',
			scheme:'',
			max_supply: 0,
			tokens:[],
			address_list: [],
			mint_token_id:'',
			mint_nft_id:'',
			mint_nft_destination:'',
			mint_nft_meta_data:'',
			jsonData: {
			},
			jsonMetaData: {
			}
		}
	},
	computed:
	{
	},
	watch: {
		'jsonData': function ()
		{
			this.scheme=JSON.stringify(this.jsonData,null,4)
		},
		'jsonMetaData': function ()
		{
			this.mint_nft_meta_data=JSON.stringify(this.jsonMetaData,null,4)
		}
	},
	created: function()
	{
		this.listTokens();
		this.listPrivateAddresses();
	},
	mounted: function()
	{
		$('.ui.accordion').accordion();
		$('.menu .item').tab();
	},
	methods:
	{
		syntaxHighlight: function(json)
		{
		    if (typeof json != 'string') {
		         json = JSON.stringify(json, undefined, 2);
		    }
		    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		        var cls = 'number';
		        if (/^"/.test(match)) {
		            if (/:$/.test(match)) {
		                cls = 'key';
		            } else {
		                cls = 'string';
		            }
		        } else if (/true|false/.test(match)) {
		            cls = 'boolean';
		        } else if (/null/.test(match)) {
		            cls = 'null';
		        }
		        return '<span class="' + cls + '">' + match + '</span>';
		    });
		},
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
		createNFT: function()
		{
			let vm=this;
			console.log(this.name);
			console.log(this.scheme);
			console.log(this.max_supply);
			console.log("Creating NFT...");
			axios.post(window.hostname + 'createnft', {
				rpcuser: window.rpcuser,
				token: window.token,
				rpcport: window.rpcport,
				name: this.name,
				scheme: this.scheme,
				max_supply: parseInt(this.max_supply)
			}, window.config).then(function(res) {
			console.log("Status:" + res.status)
			console.log("Return:" + res.data)
			if (!res.data["error"])
			{
				vm.name='';
				vm.scheme='';
				vm.max_supply=0;
				swal({type: 'success',title: 'Success!',html: "NFT creation success!"});
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
		mintNFT: function()
		{
			console.log(this.mint_token_id);
			console.log(this.mint_nft_id);
			console.log(this.mint_nft_destination);
			console.log(this.mint_nft_meta_data);
			console.log("Minting NFT...");
			axios.post(window.hostname + 'mintnft', {
				rpcuser: window.rpcuser,
				token: window.token,
				rpcport: window.rpcport,
				mint_token_id: this.mint_token_id,
				mint_nft_id: parseInt(this.mint_nft_id),
				mint_nft_destination: this.mint_nft_destination,
				mint_nft_meta_data: this.mint_nft_meta_data
			}, window.config).then(function(res) {
			console.log("Status:" + res.status)
			console.log("Return:" + res.data)
			if (!res.data["error"])
			{
				swal({type: 'success',title: 'Success!',html: "NFT minting success!"});
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