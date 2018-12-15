<template>
<div class="content">
	<div class="container-fluid">
		<h4 class="card-title"><i class="ion-ios-snowy"></i> Cold Staking</h4>
		<div class="ui one column grid">
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Get Cold Staking Address</a>
					<p></p>
					<p>This wizard will help you generate a cold staking address where you can safely store coins while staking them.</p>
					<p>You will need to provide two addresses from different wallets:</p>
					<ul>
					<li>A staking address: this address will be authorised to stake the coins sent to the cold staking address.</li>
					<li>A spending address: this address will be authorised to spend the coins sent to the cold staking address.</li>
					</ul>
					<p>These addresses will be used to generate a cold staking address.</p>
					<div class="ui success message" v-if="coldStakingAddress">
						<div class="header">
							Success
						</div>
						Generated cold staking address
						<pre id='generatedaddress'>{{coldStakingAddress}}</pre>
						<button role="button" title='Copy to clipboard' class='ui icon button' v-on:click='copytoclipboard("generatedaddress")'><i class='ion-android-clipboard'></i>&nbsp;Copy to clipboard</button>
					</div>

					<div class="ui warning message" v-if="errorMessage">
						<div class="header">
							An error occurred
						</div>
						{{errorMessage}}
					</div>
					<div class="ui form">
						<div class="field">
							<input class="form-control" placeholder="Staking Address" type="text" id="stakingaddress" name="stakingaddress" v-model="stakingaddress"><br/>
							<input class="form-control" placeholder="Spending Address" type="text" id="spendingaddress" name="spendingaddress" v-model="spendingaddress">
						</div>
						<span class="ui pointing basic label">Your Spending address and Staking address must be different</span><br/><br/>
						<button class="ui icon tiny button small blue" v-on:click="cgetColdStakingAddress">Get Cold Staking Address</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import axios from 'axios';
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";
export default {
  data: function() {
    return {
	  stakingaddress:"",
	  spendingaddress:"",
      addresslist: [],
      total_address: 0,
    }
  },
   computed: {
    ...mapState({
		coldStakingAddress: "coldStakingAddress",
 	    errorMessage: "errorMessage"
    })
  },
  created: function() {
    this.listaddressgroupings();
  },
  methods: {
    ...mapActions({
      getColdStakingAddress: "getColdStakingAddress",
    }),
	cgetColdStakingAddress: function(event) {
		var arr=[];
		arr["stakingaddress"]=this.stakingaddress;
		arr["spendingaddress"]=this.spendingaddress;
		this.getColdStakingAddress(arr);
	},
    selectAddress: function(event) {
  	  let vm=this;
      var navAddressList = [];
      axios.post(window.hostname + 'listaddressgroupings', {
        rpcuser: window.rpcuser,
		token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res) {
        jsonQ.each(res.data, function(key, value) {
          jQuery.each(value, function(index, item) {
            navAddressList.push({
              address: item[0],
              name: item[0]
            });
          });
        });
        var options = {};
        $.map(navAddressList,
          function(o) {
            options[o.address] = o.name;
          });
        const {
          value: navaddress
        } = swal({
          title: 'Select an address',
          input: 'select',
          inputOptions: options,
          inputPlaceholder: 'Select an address',
          showCancelButton: true,
          inputValidator: (value) => {
            return new Promise((resolve) => {
              resolve();
            })
          }
        }).then(formValues => {
          if (formValues["value"])
		  {
			$("#navcoinaddress").val(formValues["value"]);
			vm.navcoinaddress=formValues["value"];
		  }
        });
      }).catch(function(err) {
        console.log(err)
      })
    },
    copytoclipboard: function(selector) {
      copy(selector);
    },
    listaddressgroupings: function(event) {
      let vm = this;
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
    }
  },
}
</script>