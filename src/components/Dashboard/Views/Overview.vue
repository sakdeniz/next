<template>
<div class="content">
  <div class="container-fluid">

    <div class="row" v-if="blockchainInfo.chain">
      <div class="col-md-12">
	      <div class="ui column grid">
	  <div>
        <div class="ui segment">
          <a class="ui red ribbon label" style="width:100px;"><i style="font-size:2em;" class="ion-android-wifi"></i> <span style="position:absolute;font-size:1em;margin-left:4px;margin-top:7px;">Wallet</span></a>
			<sui-dropdown icon="ion-network" class="labeled icon twitter tiny button floating">
				<div v-if="blockchainInfo.chain==='test'">
					Test
				</div>
				<div v-else-if="blockchainInfo.chain==='dev'">
					Dev
				</div>
				<div v-else-if="blockchainInfo.chain==='main'">
					Main
				</div>
				<div v-else>
					Unknown
				</div>
				<sui-dropdown-menu>
					<sui-dropdown-item icon="ion-home" v-on:click="switchnetwork('mainnet')">Main</sui-dropdown-item>
					<sui-dropdown-item icon="ion-erlenmeyer-flask" v-on:click="switchnetwork('testnet')">Test</sui-dropdown-item>
					<sui-dropdown-item icon="ion-wrench" v-on:click="switchnetwork('devnet')">Dev</sui-dropdown-item>
				</sui-dropdown-menu>
			</sui-dropdown>
			<button role="button" class="ui icon labeled tiny button gray" title="Core Version"><i class="ion-code icon"></i>Core v{{networkInfo.version}}</button>
			<button role="button" class="ui icon labeled tiny button gray" title="Downloaded Block Number/Current Block Height"><i class="ion-cube icon"></i>{{formatNumber(blockchainInfo.blocks)}}/{{formatNumber(blockchainInfo.headers)}} (~{{blocks_per_second}} BPS)</button>
			<button role="button" class="ui icon labeled tiny button gray" title="Blockchain verification progress"><i class="ion-android-checkmark-circle icon"></i>{{calculateBlockchainVerification(blockchainInfo.verificationprogress)}}%</button>
			<button v-if="coin.bool_support_staking=='1'" role="button" class="ui icon labeled tiny button gray" title="Staking Status"><i class="ion-flash icon"></i>{{stakingInfo.staking ? "Staking Active" : "Staking Inactive"}}</button>
			<router-link to="/admin/peer-list"><button role="button" class="ui icon labeled tiny button gray" title="Connection Count"><i class="ion-earth icon"></i>{{networkInfo.connections}}</button></router-link>
			<!--<button role="button" class="ui icon labeled tiny button gray" title="TX Count"><i class="ion-arrow-swap icon"></i>{{walletInfo.txcount}}</button>!-->
		  </div>
      </div>
    </div>
    <div class="ui column grid" style="margin-top:22px">
      <div>
        <div class="ui segment">
          <a class="ui violet ribbon label" style="width:100px;"><i style="font-size:2em;" class="ion-eye"></i> <span style="position:absolute;font-size:1em;margin-left:4px;margin-top:7px;">Public</span></a>
			<div class="ui labeled button" tabindex="0" v-if="typeof walletInfo.balance!=='undefined'"><div class="ui violet button tiny"><i class="ion-archive"></i> Balance</div><a class="ui basic left pointing label tiny">{{formatNumbers(parseFloat(walletInfo.balance))}} {{coin.symbol}}&nbsp;<span v-if="info.unlocked_until==0" title="Wallet Locked"><i class="ion-android-lock"></i></span></a></div>
			<div class="ui labeled button" tabindex="0" v-if="typeof walletInfo.coldstaking_balance!=='undefined'" title='Cold Staking Balance'><div class="ui gray button tiny"><i class="ion-ios-snowy"></i></div><a class="ui basic left pointing label tiny">{{formatNumbers(walletInfo.coldstaking_balance)}} {{coin.symbol}}</a></div>
			<div class="ui labeled button" tabindex="0" v-if="typeof walletInfo.unconfirmed_balance!=='undefined'" title="Unconfirmed"><div class="ui gray button tiny"><i class="ion-clock"></i></div><a class="ui basic left pointing gray label tiny">{{formatNumbers(walletInfo.unconfirmed_balance)}} {{coin.symbol}}</a></div>
			<div class="ui labeled button" tabindex="0" v-if="typeof walletInfo.immature_balance!=='undefined'" title="Immature"><div class="ui gray button tiny"><i class="ion-egg"></i></div><a class="ui basic left pointing gray label tiny">{{formatNumbers(walletInfo.immature_balance)}} {{coin.symbol}}</a></div>
			<div class="ui labeled button" tabindex="0" v-if="coin.bool_support_staking=='1' && typeof info.stake!=='undefined'" title="Staking"><div class="ui gray button tiny"><i class="ion-leaf"></i></div><a class="ui basic left pointing gray label tiny">{{formatNumbers(info.stake)}} {{coin.symbol}}</a></div>
        </div>
      </div>
    </div>
    <div class="ui column grid" style="margin-top:22px">
      <div>
        <div class="ui segment">
          <a class="ui teal ribbon label" style="width:100px;"><i style="font-size:2em;" class="ion-eye-disabled"></i> <span style="position:absolute;font-size:1em;margin-left:4px;margin-top:7px;">Private</span></a>
			<div class="ui labeled button" tabindex="0" v-if="typeof walletInfo.private_balance!=='undefined'"><div class="ui teal button tiny"><i class="ion-archive"></i> Balance</div><a class="ui basic left pointing label tiny">{{formatNumbers(parseFloat(walletInfo.private_balance))}} {{coin.symbol}}&nbsp;</a></div>
			<div class="ui labeled button" tabindex="0" v-if="typeof walletInfo.private_balance!=='undefined'" title="Pending"><div class="ui gray button tiny"><i class="ion-clock"></i></div><a class="ui basic left pointing label tiny">{{formatNumbers(parseFloat(walletInfo.private_balance_pending).toFixed(2))}} {{coin.symbol}}&nbsp;</a></div>
			<div class="ui labeled button" tabindex="0" v-if="typeof walletInfo.private_balance_locked!=='undefined'" title="Locked"><div class="ui gray button tiny"><i class="ion-locked"></i></div><a class="ui basic left pointing label tiny">{{formatNumbers(parseFloat(walletInfo.private_balance_locked).toFixed(2))}} {{coin.symbol}}&nbsp;</a></div>
        </div>
      </div>
    </div>
    <div class="ui column grid" v-if="price" style="margin-top:22px">
      <div>
        <div class="ui segment">
          <a class="ui blue ribbon label" style="width:100px;"><i style="font-size:2em;" class="ion-social-usd"></i> <span style="position:absolute;font-size:1em;margin-left:4px;margin-top:7px;">Fiat</span></a>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-social-usd"></i> USD</div><a class="ui basic label">{{parseFloat(price.data.quote.USD.price).toFixed(2)}}</a></div>
			<!--<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-social-bitcoin"></i></div><a class="ui basic label">{{price[0].price_btc}}</a></div>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-arrow-graph-up-right"></i> Rank</div><a class="ui basic label">{{price[0].rank}}</a></div>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-stats-bars"></i> 1H </div><a class="ui basic label">{{price[0].percent_change_1h}}%</a></div>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-stats-bars"></i> 24H</div><a class="ui basic label">{{price[0].percent_change_24h}}%</a></div>
			<div class="ui labeled button tiny" tabindex="0"><div class="ui button tiny"><i class="ion-stats-bars"></i> 7D</div><a class="ui basic label">{{price[0].percent_change_7d}}%</a></div>!-->
        </div>
      </div>
    </div>
    </div>
</div>

	<div v-else class="ui tiny button gray" style="margin-bottom:25px">
      <div class="row">
        <div class="col-md-12"><i class="ion-asterisk loading icon"></i>&nbsp;{{errorMessage}}</div>
      </div>
    </div>
	<div v-if="coin.bool_support_community_fund==1">
	<br><br>
	<div class="ui cards">
		<div class="card">
			<div class="content">
				<div class="header"><i class="ion-flag icon"></i>Getting Started</div>
				<div class="description" style="min-height:45px">
					Find out what the Community Fund is and how it works.
				</div>
				<br/><router-link to="/admin/community-fund"><button class="ui right labeled icon button violet">Read More<i class="right chevron icon"></i></button></router-link>
			</div>
			</router-link>
		</div>
		<div class="card">
			<div class="content">
				<div class="header"><i class="ion-plus icon"></i>Create Your Proposal</div>
				<div class="description" style="min-height:45px">
					Learn how to create and submit your proposal to NavCoin blockchain.
				</div>
				<br/><router-link to="/admin/create-proposal"><button class="ui right labeled icon button green"><i class="right chevron icon"></i>Create a Proposal</button></router-link>
			</div>
		</div>
		<div class="card">
			<div class="content">
				<div class="header"><i class="ion-person-add icon"></i>Join The Community</div>
				<div class="description" style="min-height:45px">
					You can collaborate with other people in the Community to bring your ideas to life.
				</div>
				<br/><router-link to="/admin/meet-community"><button class="ui right labeled icon button orange"><i class="right chevron icon"></i>Meet The Community</button></router-link>
			</div>
		</div>
	</div>	
	<div class="ui five doubling cards">
		<div class="ui centered card">
			<div class="image"><img src="static/img/cf_cat_01.png" style="padding:10px"></div>
			<div class="content">
				<h6><a class="header">Advertisement</a><div class="extra content"><div class="right floated author ui violet horizontal label">{{proposals.filter(function(v) {return v.category_id == '1'}).length}}</div></div></h6>
			</div>
		</div>
		<div class="ui centered card">
			<div class="image"><img src="static/img/cf_cat_08.png" style="padding:10px"></div>
			<div class="content">
				<h6><a class="header">Real World Adoption</a><div class="extra content"><div class="right floated author ui violet horizontal label">{{proposals.filter(function(v) {return v.category_id == '8'}).length}}</div></div></h6>
			</div>
		</div>
		<div class="ui centered card">
			<div class="image"><img src="static/img/cf_cat_03.png" style="padding:10px"></div>
			<div class="content">
				<h6><a class="header">Software</a><div class="extra content"><div class="right floated author ui violet horizontal label">{{proposals.filter(function(v) {return v.category_id == '3'}).length}}</div></div></h6>
			</div>
		</div>
		<div class="ui centered card">
			<div class="image"><img src="static/img/cf_cat_09.png" style="padding:10px"></div>
			<div class="content">
				<h6><a class="header">Video</a><div class="extra content"><div class="right floated author ui violet horizontal label">{{proposals.filter(function(v) {return v.category_id == '9'}).length}}</div></div></h6>
			</div>
		</div>
				<div class="ui centered card">
			<div class="image"><img src="static/img/cf_cat_05.png" style="padding:10px"></div>
			<div class="content">
				<h6><a class="header">Charity</a><div class="extra content"><div class="right floated author ui violet horizontal label">{{proposals.filter(function(v) {return v.category_id == '5'}).length}}
				</div></div></h6>
			</div>
		</div>
	</div>

	<div class="ui two column grid">
		<div class="column">
			<div class="ui fluid card">
				<div class="content">
					<div class="header"><i class="ion-film-marker icon"></i>What is Navcoin?</div>
					<div class="description" style="min-height:45px">
						Find out what makes Navcoin unique.
					</div>
					<video width="320" height="240" poster="https://nextwallet.org/videos/intro/nav.png" controls>
					  <source src="https://nextwallet.org/videos/intro/navcoin.mp4" type="video/mp4">
						Your browser does not support the video tag.
					</video>
				</div>
			</div>
		</div>
  		<div class="column">
			<div class="ui fluid card">
				<div class="content">
					<div class="header"><i class="ion-film-marker icon"></i>What is xNAV?</div>
					<div class="description" style="min-height:45px">
						Our groundbreaking privacy protocol is now live on mainnet. Check out this video to learn all its unique features!
					</div>
					<video width="320" height="240" poster="https://nextwallet.org/videos/intro/xnav.png" controls>
					  <source src="https://nextwallet.org/videos/intro/xnav.mp4" type="video/mp4">
						Your browser does not support the video tag.
					</video>
				</div>
			</div>
		</div>
	</div>

    <h4 v-if="proposals.length>0" class="card-title">Featured Proposals</h4>
    <div class="row">
      <div v-for="proposal in getFeaturedProposals(proposals)" :key="proposal.hash" class="col-md-6 col-sm-12">
        <div class="card">
          <div class="card-body">
				<div class="row">
					<div class="col-md-12" style="margin-bottom:10px;">
						<div class="card card-user"><img v-bind:src="proposal.image" /></div>
						<div v-html="linkify(proposal.description)" style="margin-bottom:20px">
							<div>
								<div v-show="proposal.bCategory" class="ui gray label large" style="margin-top:10px;"><i class="ion-pricetag icon"></i>{{proposal.category_name}}</div>
							</div>
						</div>
						<div v-show="proposal.author" class="ui purple button tiny pull-right">&nbsp;<i class="ion-person text-default"></i>&nbsp;{{proposal.author}}</div>
						<div v-show="proposal.status=='accepted'" class="ui labeled button tiny pull-right" tabindex="0">
						<div class="ui purple button tiny" @click="proposaldonate(proposal.hash,proposal.paymentAddress)"><i class="heart icon"></i> Donate</div>
							<a class="ui basic left pointing label">
								{{proposal.totaldonationamount}}&nbsp;&nbsp;&nbsp;<i class="ion-person"></i>&nbsp;{{proposal.totaldonation}}
							</a>
						</div>

					</div>
				</div>
				<br/>
				<div class="row">
					<div class="col-md-12" style="margin-bottom:10px;">
						<div title="Proposal Status" :class="(proposal.status=='accepted'?'ui label large green':'ui label basic large')">
							<i v-if="proposal.status=='pending'" class="icon ion-flag"></i>
							<i v-if="proposal.status=='accepted'" class="icon ion-checkmark"></i>
							{{capitalizeFirstLetter(proposal.status)}}
						</div>
						<div class="ui label basic large" title="Voting Cycle"><i class="ion-loop icon"></i>Cycle {{proposal.votingCycle}}</div>
						<div class="ui label basic large" title="Proposal Duration"><i class="ion-calendar icon"></i>{{getDuration(proposal.proposalDuration)}}</div>
					</div>
					<div class="col-md-12">
						<a target="_blank" class="ui button small gray" v-bind:href="'http://navcommunity.net/view-proposal/'+proposal.hash"><i class='ion-android-open icon'></i>View</a>
						<a target="_blank" class="ui button small gray" v-bind:href="'https://communityfund.nav.community/discussion/'+proposal.hash"><i class='ion-chatbubble-working icon'></i>Discuss</a>
						<div class="ui violet label large" title="Requested Amount"><i class="ion-trophy icon"></i>{{proposal.requestedAmount.slice(0, -3)}} NAV</div>
					</div>
				</div>
				<br/>
				
				<div class="row">
					<div class="col-md-6"><i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{proposal.votesYes}}
					    <sui-progress size="tiny" color="green" state="active" :percent="Math.round((proposal.votesYes/(proposal.votesYes+proposal.votesNo))*100,2)" :label="'%' + Math.round((proposal.votesYes/(proposal.votesYes+proposal.votesNo))*100,2)"/>
					</div>
					<div class="col-md-6"><i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{proposal.votesNo}}
					    <sui-progress size="tiny" color="red" state="active" :percent="Math.round((proposal.votesNo/(proposal.votesYes+proposal.votesNo))*100,2)" :label="'%' + Math.round((proposal.votesNo/(proposal.votesYes+proposal.votesNo))*100,2)"/>
					</div>
					<div class="col-md-12" style="margin-top:10px;" title="Minimum Sum of Votes Per Voting Cycle">
					    <sui-progress v-if="(proposal.votesYes+proposal.votesNo<cfundStats.consensus.minSumVotesPerVotingCycle)" size="tiny" color="violet" state="active" :percent="(((proposal.votesYes+proposal.votesNo)*100)/cfundStats.consensus.minSumVotesPerVotingCycle).toFixed(2)" :label="'%' + (((proposal.votesYes+proposal.votesNo)*100)/cfundStats.consensus.minSumVotesPerVotingCycle).toFixed(2) + ' (' + (proposal.votesYes+proposal.votesNo) + '/' + cfundStats.consensus.minSumVotesPerVotingCycle + ')'"/>
					</div>

				</div>

				<div style="margin-top:10px;">
					<div class="row" style="margin-top:5px">
						<div class="col-md-12">
							<button title="Vote Yes" @click="proposalvote(proposal.hash,'yes')" class='ui green basic button'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i> Yes</button>
							<button title="Vote No" class="ui red basic button" @click="proposalvote(proposal.hash,'no')"><i class='fa fa-thumbs-o-down' aria-hidden='true'></i> No</button>
							<button title="Remove Vote" @click="proposalvote(proposal.hash, 'remove') " class='ui purple basic button'><i class='fa fa-close' aria-hidden='true'></i> Cancel</button>
						</div>
					</div>
					<div class="ui segment" v-if="proposal.paymentRequests">
						<a class="ui purple ribbon label">Payment Requests</a>
							<table class="ui striped table">
								<tbody>
									<template v-for="paymentRequest in proposal.paymentRequests">
										<tr>
											<td style="width:100%">{{paymentRequest.description}}</td>
										</tr>
										<tr>
											<td colspan='6'>
												<div class="row" style="margin-bottom:10px;">
													<div class="col-md-12">
														<div class="ui label basic large" title="Requested Amount"><i class="ion-archive icon"></i>{{paymentRequest.requestedAmount.slice(0, -3)}} NAV</div>
														<div class="ui label basic large" title="Status"><i class="ion-flag icon"></i>{{capitalizeFirstLetter(paymentRequest.status)}}</div>
														<div class="ui label basic large" title="Voting Cycle"><i class="ion-loop icon"></i>Cycle {{paymentRequest.votingCycle}}</div>
													</div>
												</div>
												<button title="Info" @click="showinfo('Payment Request','<div style=\'text-align:left\'><small>Hash:<br><code>'+paymentRequest.hash+'</code></small></div>','info')" class='circular ui icon button tiny teal'><i class='ion-information-circled' aria-hidden='true'></i></button>
												<button title="Vote Yes" @click="paymentrequestvote(paymentRequest.hash,'yes')" class='ui button basic tiny olive'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i> Yes</button>
												<button title="Vote No" class="ui button basic tiny pink" @click="paymentrequestvote(paymentRequest.hash,'no')"><i class='fa fa-thumbs-o-down' aria-hidden='true'></i> No</button>
												<button title="Remove Vote" @click="paymentrequestvote(paymentRequest.hash, 'remove') " class='ui button tiny basic purple'><i class='fa fa-close' aria-hidden='true'></i> Cancel</button>
												<div class="row" style="margin-top:5px">
													<div class="col-md-6"><i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{paymentRequest.votesYes}}
														<sui-progress size="tiny" color="green" state="active" :percent="Math.round((paymentRequest.votesYes / (paymentRequest.votesYes+paymentRequest.votesNo)) * 100, 2)" :label="'%' + Math.round((paymentRequest.votesYes / (paymentRequest.votesYes+paymentRequest.votesNo)) * 100, 2)"/>
													</div>
													<div class="col-md-6"><i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{paymentRequest.votesNo}}
														<sui-progress size="tiny" color="red" state="active" :percent="Math.round((paymentRequest.votesNo / (paymentRequest.votesYes+paymentRequest.votesNo)) * 100, 2)" :label="'%' + Math.round((paymentRequest.votesNo / (paymentRequest.votesYes+paymentRequest.votesNo)) * 100, 2)"/>
													</div>
												</div>
											</td>
										</tr>
									</template>
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
  data: function() {
    var previous_block = 0;
    var blocks_per_second = 0;
    return {
      previous_block,blocks_per_second
    }
  },
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
  created: function() {
	let vm=this;
	var interval=1000;
	var interval2=10000;
	this.getCoin();
	this.getCoins();
	this.getPrice();
	this.getCFundStats();
	this.timer=setInterval(this.resync, interval);
	this.timer2=setInterval(this.resync2, interval2);
	//const toast=swal.mixin({toast: true,position: 'top-end',showConfirmButton: false,timer: 3000});
	//toast({type:'success',title:'Welcome to NEXT'});
  },
  beforeDestroy() {
    clearInterval(this.timer);
	clearInterval(this.timer2);
  },
  methods: {
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
	getCoinKeys: (obj) => {
      var r = []
      for (var k in obj) {
        if (!obj.hasOwnProperty(k))
          continue
        if (k.length > 18) {
          r.push(k)
        }
      }
      return r
    },
	capitalizeFirstLetter: n => {
		return n.charAt(0).toUpperCase() + n.slice(1);
	},

    formatNumber: n => {
		if (!n) return "0";
		return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
	},
	formatNumbers: function(n) {
		return n;
      if (n==undefined) return;
      var parts = n.toString().split(".");
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
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
	showinfo: (title,html,type) => {
	swal({
        title: title,
        html: html,
		allowOutsideClick: false,
		type:type});
	},
	linkify:function(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a title="Open Link on Browser" class="ui button tiny gray" href="$1" target="_blank" style="margin-top:5px;"><i class="ion-android-open icon"></i>&nbsp;$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
	},
    getTime: () => {
      return moment().format("D MMM, YYYY HH:mm:ss");
    },
    getDate: (v) => {
      return moment.unix(v).format("MM/DD/YYYY");
    },
    getDuration: (v) => {
      return secondsToDhms(v);
    },
    getFeaturedProposals: (proposals) => {
      return proposals.filter(item => item.featured === '1')
    },
    resync: function() {
	  this.getWalletInfo();
	  if (this.walletInfo.walletversion)
	  {
		this.blocks_per_second=this.blockchainInfo.blocks-this.previous_block;
		this.previous_block=this.blockchainInfo.blocks;
		this.getNetworkInfo();
		this.getTransactions();
		this.getBlockchainInfo();
		if (this.coin.bool_support_community_fund=="1") this.getCFundStats();
	  }
    },
    resync2: function() {
	  if (this.blockchainInfo.verificationprogress && this.coin.bool_support_community_fund=="1")
	  {
		 if (parseFloat(this.blockchainInfo.verificationprogress * 100).toFixed(0)=="100") this.getCombinedProposals();
		 if (this.coin.bool_support_staking=="1")
		 {
			this.getInfo();
			this.getStakingInfo();
			this.getStakeReport();
		}
	  }
    },
    switchnetwork: function(network) {
	  clearInterval(this.timer);
	  clearInterval(this.timer2);
      swal({
        onOpen: () => {
          swal.showLoading()
        },
        allowOutsideClick: false,
        text: 'Changing network to ' + network + ' ...'
      });
      console.log("next:network:"+network);
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
            rpcuser: window.rpcuser,
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
          rpcuser: window.rpcuser,
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
			rpcuser: window.rpcuser,
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
<style>
video {
  /* override other styles to make responsive */
  width: 100%    !important;
  height: auto   !important;
}
</style>