<template>
<div class="content">
	<div class="container-fluid">
		<h4 class="card-title"><i class="ion-gear-a"></i> Settings</h4>
		<div class="ui one column grid">		
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Master Private Key</a>
					<p></p>
					<button class="ui icon tiny button green" v-on:click="dumpMasterPrivKey"><i class="ion-eye"></i>&nbsp;Show Master Private Key</button>
					<div><code>{{masterprivkey}}</code></div>
				</div>
			</div>
		</div>
		<div class="ui one column grid">		
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Sign Message</a>
					<div class="ui ignored warning message">You can sign messages/agreements with your addresses to prove you can receive navcoins sent to them. Be careful not to sign anything vague or random, as phishing attacks may try to trick you into signing your identity over to them. Only sign fully-detailed statements you agree to.</div>
					<div class="ui form">
						<div class="field">
							<input name="first-name" placeholder="NAV Address" type="text" id="navaddress" v-model="navaddress">
						</div>
						<div class="field">
							<input name="last-name" placeholder="Message" type="text" id="message" v-model="message">
						</div>
						<button class="ui icon tiny button green" v-on:click="signMessage"><i class="ion-key"></i>&nbsp;Sign</button>
						<div><code>{{signmessage}}</code></div>
					</div>
				</div>
			</div>
		</div>
		<div class="ui one column grid">		
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Verify Message</a>
					<div class="ui ignored warning message">Enter the receiver's address, message (ensure you copy line breaks, spaces, tabs, etc. exactly) and signature below to verify the message. Be carefull not to read more into the signature than what is in the signed message itself, to avoid being tricked by a man-in-the-middle attack. Note that this only proves the signing party receives with the address, it cannot prove sendership of any transaction!</div>
					<div class="ui form">
						<div class="field">
							<input name="first-name" placeholder="NAV Address" type="text" id="verify_navaddress" v-model="verify_navaddress">
						</div>
						<div class="field">
							<input name="last-name" placeholder="Signature" type="text" id="verify_signature" v-model="verify_signature">
						</div>
						<div class="field">
							<input name="last-name" placeholder="Message" type="text" id="verify_message" v-model="verify_message">
						</div>
						<button class="ui icon tiny button green" v-on:click="verifyMessage"><i class="ion-checkmark-circled"></i>&nbsp;Verify</button>
						<div><code>{{is_verify_success}}</code></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
  import axios from 'axios';
  export default {
   	data: function()
	{
		var masterprivkey;
		var signmessage;
		var navaddress;
		var message;
		var verify_navaddress;
		var verify_signature;
		var verify_message;
		return {masterprivkey,signmessage,navaddress,message,verify_navaddress,verify_signature,verify_message}
	},
	components:
	{
    },
	created: function ()
	{
	},
    methods: {
	dumpMasterPrivKey: function (event)
	{
		let vm=this;
		axios.post(window.hostname+'dumpmasterprivkey',{token:window.token,rpcport:window.rpcport},window.config).then(function(res)
		{
			vm.masterprivkey=res.data;
		}).catch(function(err)
		{
			console.log(err);
		})
    },
	signMessage: function (event)
	{
		let vm=this;
		if (!$("#navaddress").val())
		{
			swal({type: 'warning',title: 'Oops...',text: "Enter a valid NAV Address"});
		}
		else if (!$("#message").val())
		{
			swal({type: 'warning',title: 'Oops...',text: "Enter a message"});
		}		
		else
		{
			axios.post(window.hostname+'signmessage',{token:window.token,rpcport:window.rpcport,navaddress:vm.navaddress,message:vm.message},window.config).then(function(res)
			{
				if(!res.data["error"])
				{
					vm.signmessage=res.data;
				}
				else
				{
					swal({type: 'warning',title: 'Oops...',text: res.data["error"]["message"]});
				}
			}).catch(function(err)
			{
				console.log(err);
			})
		}
    },
	verifyMessage: function (event)
	{
		let vm=this;
		if (!$("#verify_navaddress").val())
		{
			swal({type: 'warning',title: 'Oops...',text: "Enter a valid NAV Address"});
		}
		else if (!$("#verify_signature").val())
		{
			swal({type: 'warning',title: 'Oops...',text: "Enter a signature"});
		}
		else if (!$("#verify_message").val())
		{
			swal({type: 'warning',title: 'Oops...',text: "Enter a message"});
		}
		else
		{
			axios.post(window.hostname+'verifymessage',{token:window.token,rpcport:window.rpcport,navaddress:vm.verify_navaddress,signature:vm.verify_signature,message:vm.verify_message},window.config).then(function(res)
			{
				if(!res.data["error"])
				{
					if (res.data==true) swal({type: 'success',title: 'Verify Message',text: 'Message successfully verified'}); else swal({type: 'warning',title: 'Verify Message',text: 'Message could not be verified'});
				}
				else
				{
					swal({type: 'warning',title: 'Oops...',text: res.data["error"]["message"]});
				}
			}).catch(function(err)
			{
				console.log(err);
			})
		}
    },
	copytoclipboard: function (selector)
	{
		copy(selector);
	},
  },
  }
</script>