<template>
  <div class="content">
	<div class="container-fluid">
	  <div class="row"><div id='div_status' class="col-md-12">
			<span v-if="errorMessage" class="btn btn-xs btn-fill btn-default" id="status">{{errorMessage}}</span><br><br></div>
			<div id='div_info' class="col-md-12">
				<span class="btn btn-xs btn-fill btn-warning" id="version"><i class="ion-code"></i>&nbsp;Version {{info.version}}</span>&nbsp;
			<span class="btn btn-xs btn-fill btn-success" id="net"><i class='ion-earth'></i>{{info.testnet === true ? 'testnet' : 'mainnet'}}</span>&nbsp;
			<span class="btn btn-xs btn-fill btn-info" id="blocks"><i class='ion-cube'></i>&nbsp;Block {{info.blocks}}</span>&nbsp;
			<span class="btn btn-xs btn-fill btn-info"><i class='ion-asterisk'></i>&nbsp;{{blockchainInfo.headers}} </span>&nbsp;
			<span class="btn btn-xs btn-fill btn-info"><i class='ion-android-checkmark-circle'></i> {{calculateBlockchainVerification(blockchainInfo.verificationprogress)}}</span>&nbsp;
			<span class="btn btn-xs btn-fill btn-primary"><i class='ion-flash'></i> {{stakingInfo.staking ? "Staking Active" : "Staking Inactive"}}</span>
			<br><br></div></div>
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="ion-ios-albums-outline text-info"></i>
            </div>
            <div slot="content">
              <p class="card-category">BALANCE</p>
              <h5 class="card-title" id="balance">{{numberWithCommas(info.balance)}}</h5>
			  <h4 class="card-title">NAV</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i><span id='balance_updated'>{{info.blocks ? getTime() : ''}}</span>
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-success">
              <i class="ion-flash text-success"></i>
            </div>
            <div slot="content">
              <p class="card-category">STAKING</p>
              <h5 class="card-title">{{numberWithCommas(stakeReport['Last 7 Days'])}}</h5>
			  <h4 class="card-title">NAV</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-calendar-o"></i>Last 7 Day
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-danger">
              <i class="ion-arrow-swap text-danger"></i>
            </div>
            <div slot="content">
              <p class="card-category">TRANSACTIONS</p>
              <h4 class="card-title" id="transaction_count">{{transactions.length}}</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-clock-o"></i>Today
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="ion-earth text-primary"></i>
            </div>
            <div slot="content">
              <p class="card-category">CONNECTIONS</p>
              <h4 class="card-title" id="connections">{{info.connections}}</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Updated now
            </div>
          </stats-card>
        </div>
      </div>


      <h4 class="card-title">Community Fund <button class="btn btn-fill btn-sm btn-info"> Featured Proposals</button></h4>
      <div class="row">
        <div v-for="proposal in getFeaturedProposals(proposals)" :key="proposal.hash" class="col-md-6 col-sm-12">
          <div class="card"><div class="card-header">
            <h4><span>{{proposal.description}}</span></h4></div>
            <div class="card-body">
              <div class="card card-user"><img v-bind:src="proposal.image" /></div>
              <span v-show="proposal.author" class="ui purple button pull-right">&nbsp;
                <i class="ion-person text-default"></i>&nbsp;{{proposal.author}}</span>
                <div><i class="fa ion-trophy text-primary"></i>&nbsp;{{proposal.amount}} NAV</div>
                <div><i class="fa fa-clock-o text-danger"></i>&nbsp;{{proposal.deadline}}</div>
                <div><i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{proposal.votesYes}}&nbsp;&nbsp;&nbsp;<i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{proposal.votesNo}}</div>
                <div>
                  <div class='btn-group'>
                    <button class="btn btn-sm btn-fill btn-info">{{proposal.status}}</button><a target="_blank" class="btn btn-sm btn-fill btn-primary" v-bind:href="'http://navcommunity.net/view-proposal/'+proposal.hash"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View</a>
                  </div>&nbsp;
                  <div class="btn-group">
                    <button title="Yes" @click="proposalvote(proposal.hash,'yes')" class='btn btn-sm btn-fill btn-success'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>
                    <button title="No" class="btn btn-sm btn-fill btn-danger" @click="proposalvote(proposal.hash,'no')"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></button>
                    <button title="Remove" @click="proposalvote(proposal.hash,'remove')" class='btn btn-sm btn-fill btn-default'><i class='fa fa-close' aria-hidden='true'></i></button>
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
import { mapState, mapActions } from "vuex";

function numberWithCommas(n) {
  var parts = n.toString().split(".");
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parts[1] ? "." + parts[1] : "")
  );
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
      proposals: "combinedProposals",
    })
  },
  created: function() {
    this.getCombinedProposals();
    this.resync();
    this.timer = setInterval(this.resync, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions({
      getInfo: "getInfo",
      getStakingInfo: "getStakingInfo",
      getTransactions: "getTransactions",
      getBlockchainInfo: "getBlockchainInfo",
      getStakeReport: "getStakeReport",
      getCombinedProposals: "getCombinedProposals",
    }),
    numberWithCommas: n => {
      if (!n) { return "0.00" }
      var parts = n.toString().split(".");
      return (
        parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        (parts[1] ? "." + parts[1] : "")
      );
    },
    calculateBlockchainVerification: verificationprogress => {
      return verificationprogress? parseFloat(verificationprogress * 100).toFixed(2) : "";
    },
    getTime: () => {
      return moment().format("D MMM, YYYY HH:mm:ss");
    },
    getFeaturedProposals: (proposals) => {
      return proposals.filter(item => item.featured === '1')
    },
    resync: function() {
      this.getTransactions();
      this.getBlockchainInfo();
      this.getStakingInfo();
      this.getStakeReport();
      this.getInfo();
    },
    proposalvote: function(proposal_hash, vote_type) {
      var config = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        responseType: "text"
      };
      axios
        .post(
          window.hostname + "proposalvote",
          {
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
  }
};
</script>