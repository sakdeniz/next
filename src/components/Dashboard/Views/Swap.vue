<template>
<div class="content">
  <div class="container-fluid">
  	<div class="row">
      <div class="col-md-12">
      	<div class="ui segment">
   	       	<a class="ui orange ribbon label" style="width:100px;">SWAP</a>
   	       	<p style="margin-top:15px;">
   	       		You can swap your existing coins from NAV to xNAV or xNAV to NAV.
   	       	</p>
   	       	<p>
   	       		While the transactions you make with NAV can be monitored on the blockchain, transactions made with xNAV can only be monitored by the wallet owner.
   	       	</p>
  		</div>
      	<div class="ui segment">
   	       	<a class="ui blue ribbon label" style="width:100px;">Available Balance</a>
        	<table style="margin-top:15px;">
	        	<tr>
	        		<td style="text-align:right">Current Block Number : </td>
	        		<td>{{formatNumber(blockchainInfo.blocks)}} / {{formatNumber(blockchainInfo.headers)}}</td>
	        	</tr>
	        	<tr>
	        		<td style="text-align:right"><i class="ion-eye"></i>&nbsp;Public : </td>
	        		<td>{{formatNumbers(walletInfo.balance)}} {{coin.symbol}}</td>
	        	</tr>
	        	<tr>
	        		<td style="text-align:right"><i class="ion-eye-disabled"></i>&nbsp;Private : </td>
	        		<td>{{formatNumbers(walletInfo.private_balance)}} xNAV</td>
	        	</tr>
        	</table>
  		</div>
        <div class="card">
          <div class="card-body">
          		<div class="form-group" style="margin-top:30px;">
	        		<button class='ui button blue' v-on:click='swap_pairs'><i class="ion-arrow-swap"></i></button>
	        		<span class="ui label gray">{{from}}</span> to <span class="ui label gray">{{to}}</span>
	        	</div>
            	<div class="form-group">
            		Amount ({{from}}) : <br/>
					<div class="ui icon input">
					  <input type="number" class="form-control" style="width:200px;" v-model="amount"/>
             		   <button class='ui button gray' v-on:click='use_all'>Use&nbsp;All</button>
					</div>
            	</div>
            	<div class="form-group">
            		Target Address : 
            		<br/>
            		 	<select class="ui fluid search selection dropdown" v-model="address">
            		 		<option :value="address.text" v-on:click="set_address(address.text)" v-for="address in addresslist2"><pre>{{address.text}}</pre></option>
						</select>

		        </div>
		        <button class='ui button violet' v-on:click='swap'>SWAP!</button>
        	</div>
           </div>
    	</div>
	  </div>
	</div>
  </div>
</div>
</template>
<script>
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";

export default
{
	  computed: {
	    ...mapState({
	      coin: "coin",
	      coins: "coins",
		  errorMessage: "errorMessage",
	      transactions: "transactions",
	      blockchainInfo: "blockchainInfo",
	      networkInfo: "networkInfo",
		  walletInfo: "walletInfo",
	      stakingInfo: "stakingInfo",
	      stakeReport: "stakeReport",
	      info: "info",
	      price: "price",
	      proposals: "combinedProposals",
	  	  cfundStats: "cfundStats"
	    })
	  },
    data () {
      return {
          from:"NAV",
          to:"xNAV",
          amount:"",
          addresslist: [],
          addresslist2: [],
          address:""
      }
  	},
  	created: function()
  	{
  		var interval=3000;
	   	this.listprivateaddresses();
	   	this.getWalletInfo();
	   	this.getBlockchainInfo();
	   	this.timer=setInterval(this.resync, interval);
    },
    beforeDestroy() {
	    clearInterval(this.timer);
  	},
  	methods:
  	{
  		...mapActions({
	      getCoin: "getCoin",
	      getCoins: "getCoins",
	      getPrice: "getPrice",
	      getInfo: "getInfo",
	      getStakingInfo: "getStakingInfo",
	      getTransactions: "getTransactions",
	      getBlockchainInfo: "getBlockchainInfo",
	      getNetworkInfo: "getNetworkInfo",
	      getWalletInfo: "getWalletInfo",
	      getStakeReport: "getStakeReport",
	      getCombinedProposals: "getCombinedProposals",
		  getCFundStats: "getCFundStats",
	    }),
	    resync: function()
	    {
		  this.getWalletInfo();
		  this.getBlockchainInfo();
	    },
	    formatNumber: n => {
		if (!n) return "0";
		return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
		},
		formatNumbers: function(n) {
	      if (n==undefined) return;
	      var parts = n.toString().split(".");
	      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
	    },
	    set_address: function(x)
	    {
	    	this.address=x;
	    },
	    use_all: function(x)
	    {
	    	if (this.from=="NAV")
	    	{
	    		this.amount=this.walletInfo.balance;
	    	}
	    	if (this.from=="xNAV")
	    	{
	    		this.amount=this.walletInfo.private_balance;
	    	}
	    },
	    swap_pairs: function()
	    {
	    	this.address="";
	    	this.from=(this.from=="NAV"?"xNAV":"NAV");
	    	this.to=(this.to=="NAV"?"xNAV":"NAV");
	    	this.amount="";
	    	if (this.from=="NAV")
	    	{
  		    	this.listprivateaddresses();
	    	}
	    	else
	    	{
	    		this.listpublicaddresses();
	    	}
	    },
	   	swap: function()
	    {
	    	let vm=this;
	    	if (!vm.amount)
	    	{
              swal({
                type: 'warning',
                title: 'Oops...',
                text: "Please enter an amount"
              });
	    	}
	    	else if (!vm.address)
	    	{
              swal({
                type: 'warning',
                title: 'Oops...',
                text: "Please select an address"
              });
	    	}
	    	else
	    	{
	    		      swal({
        title: 'Are you sure?',
        html: "Your " + vm.amount + " " + vm.from + " will be swapped to " + vm.to + "<br/><br/>It may take some time for the transaction to occur on the blockchain.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Swap it!'
      }).then((result) => {
       if (result.value)
       {
          axios.post(window.hostname + 'swap', {
            rpcuser: window.rpcuser,
			token: window.token,
            rpcport: window.rpcport,
            to: this.address,
            amount: this.amount,
            swap_type:(this.from=="NAV"?"nav_to_xnav":"xnav_to_nav")
          }, window.config).then(function(res) {
            console.log("Status:" + res.status)
            console.log("Return:" + res.data)
            if (!res.data["error"])
			{
              vm.amount="";
              vm.getWalletInfo();
			  swal({type: 'success',title: 'Success!',html: "Swap successful."});
            } else {
              swal({
                type: 'warning',
                title: 'Oops...',
                text: res.data["error"]["message"]
              });
            }
          }).catch(function(err) {
            console.log(err);
          })
        }
        else
        {
          //swal("It is cancelled.");
        }
      });

	    	}
	    },
	    listpublicaddresses: function(event)
	    {
	      let vm=this;
		  vm.addresslist=[];
		  vm.addresslist2=[];
	      // Address groupings
	      axios.post(window.hostname + 'listaddressgroupings', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
		  {
			if (!res.data["error"])
			{
				jsonQ.each(res.data, function(key, value)
				{
					jQuery.each(value, function(index, item)
					{
						if (vm.addresslist.some(e => e.text === item[0]))
						{
						}
						else
						{
							if (item[0].length==34)
							{
								vm.addresslist.push({text: item[0],value: item[0]});
								vm.addresslist2.push({text: item[0],value: item[0], amount:item[1]});
							}
						}
					});
				});
			}
	      }).catch(function(err) {
	        console.log(err)
	      })	      // Received by address
	      axios.post(window.hostname + 'listreceivedbyaddress', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
		  {
			if (!res.data["error"])
			{
			jsonQ.each(res.data, function(key, value)
			{
				if (vm.addresslist.some(e => e.text === value["address"]))
				{
				}
				else
				{
					if (item[0].length==34)
					{
						vm.addresslist.push({text: value["address"],value: value["address"]});
						vm.addresslist2.push({text: value["address"],value: value["address"],amount:value["amount"]});
					}
				}
			});
			}
	      }).catch(function(err) {
	        console.log(err)
	      })
    	},
	    listprivateaddresses: function(event)
	    {
	      let vm=this;
	      vm.addresslist=[];
	      vm.addresslist2=[];
	      axios.post(window.hostname + 'listprivateaddresses', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
		  {
			if (!res.data["error"])
			{
				console.log(res.data);
				var account = "";
				var i=0;
				jsonQ.each(res.data, function(key, value)
				{
					vm.addresslist.push({text: value["address"],value: value["address"]});
					vm.addresslist2.push({text: value["address"],value: value["address"]});
				});
			}
	      }).catch(function(err) {
	        console.log(err)
	      })
	    }
    }
}
$('.dropdown')
  .dropdown({
    clearable: true
  });
</script>