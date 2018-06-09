<template>
<div class="content">
  <div class="container-fluid">

  <div v-if="errorMessage" class="ui tiny button gray" style="margin-bottom:25px">
      <div class="row">
        <div class="col-md-12"><i class="asterisk loading icon"></i>&nbsp;{{errorMessage}}</div>
      </div>
    </div>

    <div class="row" v-else>
      <div class="col-md-12">
	      <div class="ui column grid">
      <div>
        <div class="ui segment">
          <a class="ui blue ribbon label">Network</a>
			<sui-dropdown icon="ion-network" class="labeled icon gray tiny button floating">
				{{info.testnet === true ? 'Test' : 'Main'}}
				<sui-dropdown-menu>
					<sui-dropdown-item icon="ion-home" v-on:click="switchnetwork('mainnet')">Main</sui-dropdown-item>
					<sui-dropdown-item icon="ion-erlenmeyer-flask" v-on:click="switchnetwork('testnet')">Test</sui-dropdown-item>
					<sui-dropdown-item icon="ion-wrench" v-on:click="switchnetwork('devet')">Dev</sui-dropdown-item>
				</sui-dropdown-menu>
			</sui-dropdown>
			<button role="button" class="ui icon labeled tiny button gray"><i class="ion-code icon"></i>{{version}}</button>
			<button role="button" class="ui icon labeled tiny button gray"><i class="ion-code icon"></i>Core v{{info.version}}</button>
			<button role="button" class="ui icon labeled tiny button gray"><i class="ion-cube icon"></i>{{formatNumber(info.blocks)}}/{{formatNumber(blockchainInfo.headers)}}</button>
			<button role="button" class="ui icon labeled tiny button gray"><i class="ion-android-checkmark-circle icon"></i>{{calculateBlockchainVerification(blockchainInfo.verificationprogress)}}%</button>
			<button role="button" class="ui icon labeled tiny button gray"><i class="ion-flash icon"></i>{{stakingInfo.staking ? "Staking Active" : "Staking Inactive"}}</button>
		  </div>
      </div>
    </div>
    <div class="ui column grid" style="margin-top:22px">
      <div>
        <div class="ui segment">
          <a class="ui purple ribbon label">Overview</a>
			<div class="ui labeled button" tabindex="0"><div class="ui gray button tiny"><i class="ion-archive"></i> Balance</div><a class="ui basic left pointing gray label tiny">{{numberWithCommas(info.balance)}} NAV</a></div>
			<div class="ui labeled button" tabindex="0"><div class="ui gray button tiny"><i class="ion-leaf"></i> Staking</div><a class="ui basic left pointing gray label tiny">{{numberWithCommas(stakeReport['Last 7 Days'])}} NAV</a></div>
			<div class="ui labeled button" tabindex="0"><div class="ui gray button tiny"><i class="ion-arrow-swap"></i> Transactions</div><a class="ui basic left pointing gray label tiny">{{transactions.length}}</a></div>
			<div class="ui labeled button" tabindex="0"><div class="ui gray button tiny"><i class="ion-earth"></i> Connections</div><a class="ui basic left pointing gray label tiny">{{info.connections}}</a></div>
        </div>
      </div>
    </div>
    <div class="ui column grid" v-if="price" style="margin-top:22px">
      <div>
        <div class="ui segment">
			<a class="ui violet ribbon label">Market</a>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-social-usd"></i></div><a class="ui basic label">{{parseFloat(price[0].price_usd).toFixed(2)}}</a></div>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-social-bitcoin"></i></div><a class="ui basic label">{{price[0].price_btc}}</a></div>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-arrow-graph-up-right"></i> Rank</div><a class="ui basic label">{{price[0].rank}}</a></div>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-stats-bars"></i> 1H </div><a class="ui basic label">{{price[0].percent_change_1h}}%</a></div>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-stats-bars"></i> 24H</div><a class="ui basic label">{{price[0].percent_change_24h}}%</a></div>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-stats-bars"></i> 7D</div><a class="ui basic label">{{price[0].percent_change_7d}}%</a></div>
        </div>
      </div>
    </div>
    </div>
	</div>
	
    <h4 v-if="proposals.length>0" class="card-title">Community Fund <button class="btn btn-fill btn-sm btn-info"> Featured Proposals</button></h4>
    <div class="row">
      <div v-for="proposal in getFeaturedProposals(proposals)" :key="proposal.hash" class="col-md-6 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h6><span>{{proposal.description}}</span></h6>
          </div>
          <div class="card-body">
            <div class="card card-user"><img v-bind:src="proposal.image" /></div>
            <span v-show="proposal.author" class="ui purple button pull-right">&nbsp;
			<i class="ion-person text-default"></i>&nbsp;{{proposal.author}}</span>
            <div><i class="fa ion-trophy text-primary"></i>&nbsp;{{numberWithCommas(proposal.requestedAmount)}} NAV</div>
            <div><i class="fa fa-clock-o text-danger"></i>&nbsp;{{getDate(proposal.deadline)}}</div>
            <div><i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{proposal.votesYes}}&nbsp;&nbsp;&nbsp;<i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{proposal.votesNo}}</div>
            <div style="margin-top:10px;">
              <div class='ui buttons tiny'>
                <button class="ui button tiny gray" style="text-transform:capitalize;">{{proposal.status}}</button>
                <a target="_blank" class="ui button tiny primary" v-bind:href="'http://navcommunity.net/view-proposal/'+proposal.hash">View</a>
              </div>&nbsp;
              <div class="row" style="margin-top:5px">
			  <div class="col-md-12">
			  <div class="ui buttons tiny">
                <button title="Yes" @click="proposalvote(proposal.hash,'yes')" class='ui button tiny green'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>
                <button title="No" @click="proposalvote(proposal.hash,'no')" class="ui button tiny red"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></button>
                <button title="Remove" @click="proposalvote(proposal.hash,'remove')" class='ui button tiny gray'><i class='fa fa-close' aria-hidden='true'></i></button>
              </div>
			  	<div v-show="proposal.status=='accepted'" class="ui labeled button tiny right floated" tabindex="0">
				<div class="ui purple button tiny" @click="proposaldonate(proposal.hash,proposal.paymentAddress)"><i class="heart icon"></i> Donate</div>
					<a class="ui basic purple left pointing label">
						{{proposal.total_donation_amount}}&nbsp;&nbsp;&nbsp;<i class="ion-person"></i>&nbsp;{{proposal.total_donation}}
					</a>
				</div>
				</div>
			</div>
			<div class="ui segment" v-if="proposal.paymentRequests">
				<a class="ui purple ribbon label">Payment Requests</a>
				<table class="ui celled padded table">
				<thead>
					<tr>
						<th nowrap>Request ID</th>
						<th nowrap>Amount (NAV)</th>
						<th nowrap>Status</th>
						</tr>
					</thead>
					<tbody>
					<tr v-for="paymentRequest in proposal.paymentRequests">
						<td nowrap style="width:100%">{{paymentRequest.description}}</td>
						<td nowrap>{{paymentRequest.requestedAmount}}</td>
						<td nowrap>{{paymentRequest.status}}</td>
					</tr>
					<tr v-for="paymentRequest in proposal.paymentRequests">
					<td colspan='6'>
						<button title="Yes" @click="paymentrequestvote(paymentRequest.hash,'yes')" class='ui button tiny olive'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>
						<button title="No" class="ui button tiny pink" @click="paymentrequestvote(paymentRequest.hash,'no')"><i class='fa fa-thumbs-o-down' aria-hidden='true'></i></button>
						<button title="Remove" @click="paymentrequestvote(paymentRequest.hash, 'remove') " class='ui button tiny gray'><i class='fa fa-close' aria-hidden='true'></i></button>
						<i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{paymentRequest.votesYes}}&nbsp;&nbsp;&nbsp;<i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{paymentRequest.votesNo}}
					</td>
					</tr>
					<tr v-for="paymentRequest in proposal.paymentRequests">
						<td colspan='6'><pre>Payment Request Hash : </pre><code><small>{{paymentRequest.hash}}</small></code></td>
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
<script>
import StatsCard from "src/components/UIComponents/Cards/StatsCard.vue";
import axios from "axios";
import moment from "moment";
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";

function numberWithCommas(n) {
  var parts = n.toString().split(".");
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parts[1] ? "." + parts[1] : "")
  );
}

function errorhandler(data) {
  if (data) {
    if (data["error"]) {
      swal("Error!", data["error"]["message"], "error");
    }
  }
}

export default {
  name: "Overview",
  components: {
    StatsCard
  },
  computed: {
    ...mapState({
      errorMessage: "errorMessage",
      transactions: "transactions",
      blockchainInfo: "blockchainInfo",
      stakingInfo: "stakingInfo",
      stakeReport: "stakeReport",
      info: "info",
      version: "version",
      price: "price",
      proposals: "combinedProposals",
    })
  },
  created: function() {
	this.getPrice();
	this.getVersion();
	this.resync();
    this.timer=setInterval(this.resync, 5000);
	if (!window.acceptTC && window.warning!="0") {
      const {
        value: accept
      } = swal({
        title: 'Terms and conditions',
        html: "<div style='text-align:left'><small>NEXT is a wallet that is in test phase.<br>NEXT uses common data with Core Wallet.<br>Using NEXT on mainnet is not recommended on beta phase.<br>The developer team can not be held responsible due to improper use.</small></div>",
        allowOutsideClick: false,
        input: 'checkbox',
        inputValue: 1,
        inputPlaceholder: 'I agree with the terms and conditions',
        confirmButtonText: 'Continue <i class="fa fa-arrow-right></i>',
        inputValidator: (result) => {
          return !result && 'You need to agree with T&C'
        }
      }).then(function(res) {
        window.acceptTC = true;
		console.log("next:disable-warning");
        const toast = swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        toast({
          type: 'success',
          title: 'Welcome to NEXT'
        })
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions({
      getVersion: "getVersion",
      getPrice: "getPrice",
      getInfo: "getInfo",
      getStakingInfo: "getStakingInfo",
      getTransactions: "getTransactions",
      getBlockchainInfo: "getBlockchainInfo",
      getStakeReport: "getStakeReport",
      getCombinedProposals: "getCombinedProposals",
    }),
    formatNumber: n => {
		if (!n) return "0";
		return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
	},
    numberWithCommas: n => {
      if (!n) {
        return "0.00"
      }
      n = (Math.round(n * 100) / 100).toFixed(2);
      var parts = n.toString().split(".");
      return (
        parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        (parts[1] ? "." + parts[1] : "")
      );
    },
    calculateBlockchainVerification: verificationprogress => {
      return verificationprogress ? parseFloat(verificationprogress * 100).toFixed(2) : "";
    },
    getTime: () => {
      return moment().format("D MMM, YYYY HH:mm:ss");
    },
    getDate: (v) => {
      return moment.unix(v).format("MM/DD/YYYY");
    },
    getFeaturedProposals: (proposals) => {
      return proposals.filter(item => item.featured === '1')
    },
    resync: function() {
      this.getBlockchainInfo();
      this.getInfo();
      this.getStakingInfo();
      this.getStakeReport();
      this.getTransactions();
      if (this.blockchainInfo.verificationprogress) {
        if (parseFloat(this.blockchainInfo.verificationprogress * 100).toFixed(0) == "100") this.getCombinedProposals();
      }
    },
    switchnetwork: function(network) {
	  clearInterval(this.timer);
      swal({
        onOpen: () => {
          swal.showLoading()
        },
        allowOutsideClick: false,
        text: 'Changing network to ' + network + ' ...'
      });
      console.log(network);
    },
    proposalvote: function(proposal_hash, vote_type) {
      var config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        responseType: "text"
      };
      axios
        .post(
          window.hostname + "proposalvote", {
            token: window.token,
            rpcport: window.rpcport,
            proposal_hash: proposal_hash,
            vote_type: vote_type
          },
          config
        )
        .then(function(res) {
          if (res.data == null) {
            swal("Success!", "You have successfully voted.", "success");
          } else if (res.data["error"]) {
            swal("Error!", res.data["error"]["message"], "error");
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
	paymentrequestvote: function(paymentrequest_hash, vote_type) {
      var config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text'
      };
      axios.post(window.hostname + 'paymentrequestvote', {
          token: window.token,
          rpcport: window.rpcport,
          paymentrequest_hash: paymentrequest_hash,
          vote_type: vote_type
        }, config)        .then(function(res) {
          if (res.data == null) {
            swal("Success!", "You have successfully voted.", "success");
          } else if (res.data["error"]) {
            swal("Error!", res.data["error"]["message"], "error");
          }
        })
        .catch(function(err) {
          console.log(err);
        });
	},
	proposaldonate: function(proposal_hash,proposal_paymentaddress) {
      var config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text'
      };
	        const {
        value: accept
      } = swal({
        title: 'Donate to proposal',
        html: "<div style='text-align:left'><small><ul><li>The Community Fund is decentralized and open-source.</li><li>All donations you make are at your own risk.</li><li>When you make a donation, it is your responsibility to understand how your NAV will be used.</li><li>Before donating NAV, we encourage you to do your due diligence.</li><li>Due to NavCoin's decentralized nature, no one individual (besides a proposer) is responsible for any advertising, exchange listing, software, social events, charity, hardware, or sponsorship, offered by third party proposers.</li><li>No one can verify the information that proposers supply, nor can anyone guarantee that the donations will be used in accordance with any purpose indicated in a proposal by the proposer.</li><li>No individual, besides the proposer, can be held responsible to verify whether the donations are used in accordance with any applicable laws; such responsibility rests solely with the proposer.</li><li>All donations are independent of the funds held within the community fund</li></ul>Your donation will be sent to that address : <pre>" + proposal_paymentaddress + "</pre><input type='textbox' id='donator_name' name='donator_name' placeholder='Donator name (Optional)' class='form-control'></input><br/><input type='textbox' id='donate_amount' name='donate_amount' placeholder='Amount' class='form-control'></input></div>",
        allowOutsideClick: false,
        input: 'checkbox',
        inputValue: 1,
	    onOpen: () => {$("#donator_name").focus();},
        inputPlaceholder: 'I understand and accept responsibility.',
        confirmButtonColor: '#cc0000',
		confirmButtonText: '<i class="ion-heart"></i>&nbsp;Donate <i class="fa fa-arrow-right></i>',
        cancelButtonText: 'Cancel <i class="fa fa-close></i>',
  	    showCancelButton: true,
        inputValidator: (result) => {
          return !result && 'You need to agree with T&C'
        }
      }).then(function(res) {
	    if (res.value)
		{
			axios.post(window.hostname + 'proposaldonate', {
			token: window.token,
			rpcport: window.rpcport,
			proposal_hash: proposal_hash,
			proposal_paymentaddress: proposal_paymentaddress,
			donate_amount: $("#donate_amount").val(),
			donator_name: $("#donator_name").val(),
			}, config).then(function(res) {
			errorhandler(res.data);
			console.log("Status:" + res.status);
			console.log("Return:" + res.data);
			if (res.data)
			{
				if (!res.data["error"])
				{
					swal("Thanks!", "You have successfully donated.", "success");
				}
			}
			})
			.catch(function(err) {
			console.log(err);
			})
		}
      });
    }
  }
}
</script>