<template>
<div class="content">
  <div class="container-fluid">
    <!-- !-->
	<div class="row">
      <div class="col-md-12 col-sm-12">
        <sui-dropdown icon="ion-navicon-round" class="labeled icon large violet" text="Menu" button floating>
          <sui-dropdown-menu>
            <router-link to="/admin/create-proposal" tag="sui-dropdown-item"><i class="ion-plus-round"></i>&nbsp;Create Proposal</router-link>
            <router-link to="/admin/community-proposals" tag="sui-dropdown-item"><i class="ion-grid"></i>&nbsp;All Proposals</router-link>
            <router-link to="/admin/my-proposals" tag="sui-dropdown-item"><i class="ion-heart"></i>&nbsp;My Proposals</router-link>
            <router-link to="/admin/proposal-vote-list" tag="sui-dropdown-item"><i class="ion-checkmark-round"></i>&nbsp;Proposal Vote List</router-link>
            <router-link to="/admin/payment-request-vote-list" tag="sui-dropdown-item"><i class="ion-log-out"></i>&nbsp;Payment Request Vote List</router-link>
          </sui-dropdown-menu>
        </sui-dropdown>

        <sui-dropdown icon="ion-pricetag" class="labeled icon blue large" text="Categories" button floating>
          <sui-dropdown-menu>
            <sui-dropdown-item v-for="category in array_categories" v-on:click="listproposals('category',category.id)">{{category.name}}</sui-dropdown-item>
          </sui-dropdown-menu>
        </sui-dropdown>

        <sui-dropdown icon="ion-funnel" class="labeled icon teal large" text="Filter" button floating>
          <sui-dropdown-menu>
            <sui-dropdown-item v-on:click="listproposals('all')">All</sui-dropdown-item>
            <sui-dropdown-item v-on:click="listproposals('featured')">Featured</sui-dropdown-item>
            <sui-dropdown-item v-on:click="listproposals('pending')">Pending</sui-dropdown-item>
            <sui-dropdown-item v-on:click="listproposals('accepted')">Accepted</sui-dropdown-item>
            <sui-dropdown-item v-on:click="listproposals('accepted waiting for enough coins in fund')">Accepted, waiting for enough coins in fund</sui-dropdown-item>
			<sui-dropdown-item v-on:click="listproposals('accepted waiting for end of voting period')">Accepted, waiting for end of voting period</sui-dropdown-item>
			<sui-dropdown-item v-on:click="listproposals('rejected waiting for end of voting period')">Rejected, waiting for end of voting period</sui-dropdown-item>
			<sui-dropdown-item v-on:click="listproposals('expired waiting for end of voting period')">Expired, waiting for end of voting period</sui-dropdown-item>
            <sui-dropdown-item v-on:click="listproposals('rejected')">Rejected</sui-dropdown-item>
          </sui-dropdown-menu>
        </sui-dropdown>
		<button class="ui google plus button large" v-on:click="donatefund()"><i class="ion-heart"></i>&nbsp;Donate</button>
        <div class="ui left input tiny">
          <input placeholder="Search..." type="text" v-model="search" style="width:180px">
        </div>
        
		<sui-checkbox label="Table View" toggle v-model="cTableView" style="margin-left:10px"/>
			
        <br><br>
      </div>
    </div>
    <div class="ui two column grid">
      <div class="column">
        <div class="ui segment">
    <a class="ui red ribbon label">Overview</a>
	<br/><br/>
    <div class="ui top pointing attached menu">
  <a class="item active" data-tab="first">Fund</a>
  <a class="item" data-tab="second">Current Period</a>
  <a class="item" data-tab="third">Consensus</a>
</div>
<div class="ui bottom attached tab segment active" data-tab="first">
  			<table class="ui celled striped table">
  <thead>
    <tr><th colspan="2">
      Fund
    </th>
  </tr></thead>
  <tbody>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Available in NAV
      </td>
      <td class="right aligned collapsing">{{formatnumbers(cfundStats.funds.available)}} NAV</td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Available in USD
      </td>
      <td class="right aligned collapsing">{{formatnumbers(parseFloat(cfundStats.funds.available*price[0].price_usd).toFixed(2))}} USD</td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Available in EUR
      </td>
      <td class="right aligned collapsing">{{formatnumbers(parseFloat(cfundStats.funds.available*price[0].price_eur).toFixed(2))}} EURO</td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Available in BTC
      </td>
      <td class="right aligned collapsing">{{formatnumbers(parseFloat(cfundStats.funds.available*price[0].price_btc).toFixed(2))}} BTC</td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Locked
      </td>
      <td class="right aligned collapsing">{{formatnumbers(cfundStats.funds.locked)}} NAV</td>
    </tr>
	</tbody>
</table>
</div>
<div class="ui bottom attached tab segment" data-tab="second">
  	<table class="ui celled striped table">
  <thead>
    <tr><th colspan="2">
      Current Period
    </th>
  </tr></thead>
  <tbody>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Starting Block Number
      </td>
      <td class="right aligned collapsing"><span v-if="cfundStats.votingPeriod.starting">{{cfundStats.votingPeriod.starting}}</span></td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Ending Block Number
      </td>
      <td class="right aligned"><span v-if="cfundStats.votingPeriod.ending">{{cfundStats.votingPeriod.ending}}</span></td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Current Block Number
      </td>
      <td class="right aligned"><span v-if="cfundStats.votingPeriod.current">{{cfundStats.votingPeriod.current}}</span></td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Remaining Blocks
      </td>
      <td nowrap class="right aligned"><span v-if="cfundStats.votingPeriod.current">{{cfundStats.votingPeriod.ending-cfundStats.votingPeriod.current}} ({{roundnumber((cfundStats.votingPeriod.ending-cfundStats.votingPeriod.current)*100/cfundStats.consensus.blocksPerVotingCycle)}}%)</span></td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Voted Proposals
      </td>
      <td class="right aligned">{{cfundStats.votingPeriod.votedProposals.length}}</td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Voted Payment Requests
      </td>
      <td class="right aligned">{{cfundStats.votingPeriod.votedPaymentrequests.length}}</td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Total Payment Requests
      </td>
      <td class="right aligned">{{total_payment_requests}}</td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Total Payment Requests Amount
      </td>
      <td class="right aligned">{{total_payment_requests_amount}} NAV</td>
    </tr>
  </tbody>
</table>
</div>
<div class="ui bottom attached tab segment" data-tab="third">
  			<table class="ui celled striped table">
  <thead>
    <tr><th colspan="2">
      Consensus
    </th>
  </tr></thead>
  <tbody>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Minimum Fee For Create a Proposal
      </td>
      <td class="right aligned collapsing"><span v-if="cfundStats">{{cfundStats.consensus.proposalMinimalFee}}</span></td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Blocks Per Voting Cycle
      </td>
      <td class="right aligned collapsing"><span v-if="cfundStats">{{cfundStats.consensus.blocksPerVotingCycle}}</span></td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Minimum Sum of Votes Per Voting Cycle
      </td>
      <td class="right aligned collapsing"><span v-if="cfundStats">{{cfundStats.consensus.minSumVotesPerVotingCycle}}</span></td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Maximum Count Voting Cycle / Proposals
      </td>
      <td class="right aligned collapsing"><span v-if="cfundStats">{{cfundStats.consensus.maxCountVotingCycleProposals}}</span></td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Maximum Count Voting Cycle / Payment Requests
      </td>
      <td class="right aligned collapsing"><span v-if="cfundStats">{{cfundStats.consensus.maxCountVotingCyclePaymentRequests}}</span></td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Required % to <span class="badge bg-success text-white">Accept</span> Proposals
      </td>
      <td class="right aligned collapsing"><span v-if="cfundStats">{{roundnumber(cfundStats.consensus.votesAcceptProposalPercentage)}}%</span></td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Required % to <span class="badge bg-danger text-white">Reject</span> Proposals
      </td>
      <td class="right aligned collapsing"><span v-if="cfundStats">{{roundnumber(cfundStats.consensus.votesRejectProposalPercentage)}}%</span></td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Required % to <span class="badge bg-success text-white">Accept</span> Payment Requests
      </td>
      <td class="right aligned collapsing"><span v-if="cfundStats">{{roundnumber(cfundStats.consensus.votesAcceptPaymentRequestPercentage)}}%</span></td>
    </tr>
	<tr>
      <td>
        <i class="ion-android-arrow-dropright"></i> Required % to <span class="badge bg-danger text-white">Reject</span> Payment Requests
      </td>
      <td class="right aligned collapsing"><span v-if="cfundStats">{{roundnumber(cfundStats.consensus.votesRejectPaymentRequestPercentage)}}%</span></td>
    </tr>
</tbody>
</table>
</div>		  
</div>
</div>
<div class="column">
	<div class="ui segment">
		<a class="ui orange right ribbon label">Status</a>
		<p></p>
          <table class="ui celled striped table">
			<thead>
				<tr>
					<th colspan="2">
						Proposals by Status
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<i class="ion-android-time"></i> Pending
					</td>
					<td class="right aligned collapsing">{{array_proposals.filter(item => item.status=="pending").length}}</td>
				</tr>
				<tr>
					<td>
						<i class="ion-android-done-all"></i> Accepted
					</td>
					<td class="right aligned">{{array_proposals.filter(item => item.status=="accepted").length}}</td>
				</tr>
				<tr>
					<td>
						<i class="ion-android-done"></i> Accepted waiting for enough coins in fund
					</td>
					<td class="right aligned">{{array_proposals.filter(item => item.status=="accepted waiting for enough coins in fund").length}}</td>
				</tr>
				<tr>
					<td>
						<i class="ion-android-done"></i> Accepted waiting for end of voting period
					</td>
					<td class="right aligned">{{array_proposals.filter(item => item.status=="accepted waiting for end of voting period").length}}</td>
				</tr>
				<tr>
					<td>
						<i class="ion-close"></i> Rejected
					</td>
					<td class="right aligned">{{array_proposals.filter(item => item.status=="rejected").length}}</td>
				</tr>
				<tr>
					<td>
						<i class="ion-close"></i> Rejected waiting for end of voting period
					</td>
					<td class="right aligned">{{array_proposals.filter(item => item.status=="rejected waiting for end of voting period").length}}</td>
				</tr>
				<tr>
					<td>
						<i class="ion-close"></i> Expired waiting for end of voting period
					</td>
					<td class="right aligned">{{array_proposals.filter(item => item.status=="expired waiting for end of voting period").length}}</td>
				</tr>
				<tr>
					<td>
						<i class="ion-close"></i> Expired pending voting of payment requests
					</td>
					<td class="right aligned">{{array_proposals.filter(item => item.status=="expired pending voting of payment requests").length}}</td>
				</tr>
				<tr>
					<td>
						<i class="ion-trash-b"></i> Expired
					</td>
					<td class="right aligned">{{array_proposals.filter(item => item.status=="expired").length}}</td>
				</tr>
				<tr>
					<td>
						<i class="ion-android-add"></i> Total
					</td>
					<td class="right aligned">{{array_proposals.length}}</td>
				</tr>
			</tbody>
		</table>
        <div class="ui tag labels">
			<div class="ui label gray" v-for="category in array_categories">{{category.name}}
				<div class="detail">{{array_proposals.filter(item => item.category_name==category.name).length}}</div>
            </div>
            <div class="ui label gray">Uncategorized
              <div class="detail">{{array_proposals.filter(item => item.category_name=="").length}}</div>
            </div>
		</div>
	</div>
</div>
</div>


<h4>Community Proposals</h4>
<div v-if='search'>Search : {{search}}</div>
<div class="row">
	<div v-for="proposal in array_proposals" v-if="!cTableView && (!search || proposal.desc.toLowerCase().indexOf(search.toLowerCase())!=-1)" class="col-md-6 col-sm-6">
		<div class="card">
			<div class="card-body">
				<div class="row">
					<div class="col-md-12">
						<div class="card card-user"><img v-bind:src="proposal.image" /></div>
						<div v-html="linkify(proposal.desc)" style="margin-bottom:20px">
							<div>
								<div v-show="proposal.bCategory" class="ui gray label small" style="margin-top:10px;"><i class="ion-pricetag icon"></i>{{proposal.category_name}}</div>
							</div>
						</div>
						<div class="row">
						<div class="col-md-12">
						<div v-show="proposal.bAuthor" class="ui purple button tiny pull-right" style="margin-bottom:10px;">&nbsp;<i class="ion-person text-default"></i>&nbsp;{{proposal.author}}</div>
						<div v-show="proposal.textfeatured=='Featured'" v-bind:class="proposal.classfeatured">&nbsp;{{proposal.textfeatured}}</div>
						<div v-show="proposal.status=='accepted'" class="ui labeled button tiny pull-right" tabindex="0">
						<div class="ui purple button tiny" @click="proposaldonate(proposal.hash,proposal.paymentAddress)"><i class="heart icon"></i> Donate</div>
							<a class="ui basic left pointing label">
								{{proposal.totaldonationamount}}&nbsp;&nbsp;&nbsp;<i class="ion-person"></i>&nbsp;{{proposal.totaldonation}}
							</a>
						</div>
						</div>
						</div>
					</div>
					</div>
				<br/>
				<div class="row">
					<div class="col-md-12" style="margin-bottom:10px;">
						<div style="margin-top:5px;" title="Proposal Status" :class="(proposal.status=='accepted'?'ui label large green':'ui label basic large')">
							<i v-if="proposal.status=='pending'" class="icon ion-flag"></i>
							<i v-if="proposal.status=='accepted'" class="icon ion-checkmark"></i>
							{{capitalizeFirstLetter(proposal.status)}}
						</div>
						<div style="margin-top:5px;" class="ui label basic large" title="Voting Cycle"><i class="ion-loop icon"></i>Cycle {{proposal.votingCycle}}</div>
						<div style="margin-top:5px;" class="ui label basic large" title="Proposal Duration"><i class="ion-calendar icon"></i>{{proposal.proposalDuration}}</div>
					</div>
					<div class="col-md-12">
						<a target="_blank" class="ui button small gray" v-bind:href="'http://navcommunity.net/view-proposal/'+proposal.hash"><i class='ion-android-open icon'></i>View</a>
						<a target="_blank" class="ui button small gray" v-bind:href="'https://communityfund.nav.community/discussion/'+proposal.hash"><i class='ion-chatbubble-working icon'></i>Discuss</a>
						<div class="ui violet label large" title="Requested Amount"><i class="ion-trophy icon"></i>{{proposal.amount.slice(0, -3)}} NAV</div>
					</div>
				</div>
				<br/>
				<div class="row">
					<div class="col-md-6"><i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{proposal.votesYes}}
					    <sui-progress size="tiny" color="green" state="active" :percent="proposal.yes_votes_proportion" :label="'%' + proposal.yes_votes_proportion"/>
					</div>
					<div class="col-md-6"><i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{proposal.votesNo}}
					    <sui-progress size="tiny" color="red" state="active" :percent="proposal.no_votes_proportion" :label="'%' + proposal.no_votes_proportion"/>
					</div>
					<div class="col-md-12" style="margin-top:10px;" title="Minimum Sum of Votes Per Voting Cycle">
					    <sui-progress v-if="(proposal.votesYes+proposal.votesNo<cfundStats.consensus.minSumVotesPerVotingCycle)" size="tiny" color="violet" state="active" :percent="(((proposal.votesYes+proposal.votesNo)*100)/cfundStats.consensus.minSumVotesPerVotingCycle).toFixed(2)" :label="'%' + (((proposal.votesYes+proposal.votesNo)*100)/cfundStats.consensus.minSumVotesPerVotingCycle).toFixed(2) + ' (' + (proposal.votesYes+proposal.votesNo) + '/' + cfundStats.consensus.minSumVotesPerVotingCycle + ')'"/>
					</div>
				</div>
				<div>
					<div class="row" style="margin-top:20px">
						<div class="col-md-12">
							<button title="Vote Yes" @click="proposalvote(proposal.hash,'yes')" class='ui green basic button'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i> Yes</button>
							<button title="Vote No" class="ui red basic button" @click="proposalvote(proposal.hash,'no')"><i class='fa fa-thumbs-o-down' aria-hidden='true'></i> No</button>
							<button title="Remove Vote" @click="proposalvote(proposal.hash, 'remove') " class='ui purple basic button'><i class='fa fa-close' aria-hidden='true'></i> Cancel</button>
							</div>
							<div class="ui segment" v-if="proposal.paymentRequests" style="margin:5px;">
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
<table class="ui padded striped table " v-if="cTableView ">
<thead>
	<tr>
		<th style="width:100px"></th>
		<th>Title</th>
		<th>Vote</th>
		<th>Status</th>
		<th>Amount (NAV)</th>
		<th>Duration</th>
		<th nowrap>Yes Votes</th>
		<th nowrap>No Votes</th>
		<th>Category</th>
	</tr>
</thead>
<tbody>
	<tr v-for="proposal in array_proposals" v-if="!search || proposal.desc.toLowerCase().indexOf(search.toLowerCase())!=-1 ">
		<td>
		<a target="_blank" class="ui button small gray" v-bind:href="'http://navcommunity.net/view-proposal/'+proposal.hash" style="margin-bottom:5px;"><i class='ion-android-open icon'></i>View</a>
		<a target="_blank" class="ui button small gray" v-bind:href="'https://communityfund.nav.community/discussion/'+proposal.hash"><i class='ion-chatbubble-working icon'></i>Discuss</a>
		</td>
		<td><div v-html="linkify(proposal.desc)"></div><div><span v-show="proposal.bAuthor " class="ui purple button pull-right" style="margin-top:10px;">&nbsp;<i class="ion-person text-default "></i>&nbsp;{{proposal.author}}</span><span style="margin-right:5px;margin-top:10px;" v-bind:class="proposal.classfeatured ">&nbsp;{{proposal.textfeatured}}</span></div></td>
		<td>
			<div class="btn-group ">
			<button title="Yes " @click="proposalvote(proposal.hash, 'yes')" class='ui green basic button'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>
			<button title="No " class="ui red basic button" @click="proposalvote(proposal.hash,'no') ""><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></button>
			<button title="Remove" @click="proposalvote(proposal.hash,'remove')" class='ui purple basic button'><i class='fa fa-close' aria-hidden='true'></i></button></div>
		</td>
		<td>{{proposal.status}}</td>
		<td>{{proposal.amount.slice(0, -3)}}</td>
		<td>{{proposal.proposalDuration}}</td>
		<td>{{proposal.votesYes}}
			<sui-progress color="green" :percent="proposal.yes_votes_proportion" progress/>
		</td>
		<td>{{proposal.votesNo}}
			<sui-progress color="red" :percent="proposal.no_votes_proportion" progress/>
		</td>
		<td>{{proposal.category_name}}</td>
	</tr>
</tbody>
</table>
</div>
</div>
</template>
<script>
import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue'
import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
import Card from 'src/components/UIComponents/Cards/Card.vue'
import LTable from 'src/components/UIComponents/Table.vue'
import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'
import axios from 'axios';
import moment from 'moment';
import Vue from 'vue';
import {
  mapState,
  mapActions
} from "vuex";

function numberWithCommas(n) {
  var parts = n.toString().split(".");
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

function errorhandler(data) {
  if (data) {
    if (data["error"]) {
      swal("Error!", data["error"]["message"], "error");
    }
  }
}

export default {
  components: {
    Checkbox,
    Card,
    LTable,
    ChartCard,
    StatsCard
  },
  computed: {
    ...mapState({
      info: "info",
	  cfundStats: "cfundStats",
      price: "price"
    })
  },
  data: function() {
    var array_proposals = [];
    var array_categories = [];
	var total_payment_requests=0;
	var total_payment_requests_amount=0;
    var search = "";
    return {
      array_proposals,
      array_categories,
      search,
      cTableView: false,
	  total_payment_requests,
	  total_payment_requests_amount
    }
  },
  created: function() {
    this.getInfo();
	this.getCFundStats();
	this.listproposals("all");
	this.getPrice();
  },
  mounted: function() {
	$('.menu .item').tab();
  },
  methods: {
    ...mapActions({
      getInfo: "getInfo",
	  getCFundStats: "getCFundStats",
      getPrice: "getPrice"
    }),
	capitalizeFirstLetter: n => {
		return n.charAt(0).toUpperCase() + n.slice(1);
	},
	roundnumber: n => {
      if (!n) {
        return "0.00"
      }
	  return Math.round(n).toFixed(2);
    },
	formatnumbers: function(n) {
	  if (n==undefined) return;
      var parts = n.toString().split(".");
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    },
	showinfo: (title,html,type) => {
	swal({
        title: title,
        html: html,
		allowOutsideClick: false,
		type:type});
	},
	donatefund: function()
	{
      let vm=this;
	  var htmlEncryptionPassword="";
	  var bWalletLocked=false;
	  if (vm.info.unlocked_until!=null)
	  {
		bWalletLocked=true;
		htmlEncryptionPassword='<input id="wallet_password" name="wallet_password" type="password" placeholder="Wallet Encryption Password" class="swal2-input">'
	  }
	  const {
        value: accept
      } = swal({
        title: 'Donate to Community Fund',
        html: "<div style='text-align:left'><small><ul><li>The Community Fund is decentralized and open-source.</li><li>All donations you make are at your own risk.</li><li>When you make a donation, it is your responsibility to understand how your NAV will be used.</li><li>Before donating NAV, we encourage you to do your due diligence.</li></ul><input type='textbox' id='donate_amount' name='donate_amount' placeholder='Amount' class='swal2-input'></input>"+htmlEncryptionPassword+"</div>",
        allowOutsideClick: false,
        input: 'checkbox',
        inputValue: 1,
	    onOpen: () => {$("#donate_amount").focus();},
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
			axios.post(window.hostname + 'donatefund', {
			rpcuser: window.rpcuser,
			token: window.token,
			rpcport: window.rpcport,
			b_wallet_locked: bWalletLocked,
			wallet_password: $("#wallet_password").val(),
			donate_amount: $("#donate_amount").val(),
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
    listproposals: function(filter, proposal_category_id) {
      var array_proposals_remote = [];
      var array_proposals = [];
      let vm = this;
      vm.array_proposals = [];
      vm.array_categories = [];
      axios.post(window.hostname + 'listproposals', {
        rpcuser: window.rpcuser,
		token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res) {
        var aLen = 0;
        axios.post("http://navcommunity.net/api/getproposals.php", {}, window.config).then(function(res2) {
          var categoryObj = jsonQ(res2.data).pathValue([0, "categories"]);
          jsonQ.each(categoryObj, function(k, v) {
            vm.array_categories.push({
              id: v.category_id,
              name: v.category_name
            });
          });
          var proposalObj = jsonQ(res2.data).pathValue([1, "proposals"]);
          jsonQ.each(proposalObj, function(k, v) {
            array_proposals_remote.push({
              hash: v.hash,
              image: v.image,
              featured: v.featured,
              author: v.author,
              category_id: v.category_id,
              category_name: v.category_name,
              total_donation: v.total_donation,
              total_donation_amount: v.total_donation_amount
            });
            aLen++;
          });
          var i = 0;
          //console.log("Status:" + res.status)
          //console.log("Return:" + res.data)
          jsonQ.each(res.data, function(key, value) {
            var hash = "";
			var blockHash = "";
            var cls = "";
            var icon = "";
            var desc = "";
            var amount = "";
            var paymentAddress = "";
			var paymentRequests=[];
            var proposalDuration = "";
            var votesYes = "";
            var votesNo = "";
			var votingCycle=0;
			var state="";
            var status = "";
            var image = "static/img/placeholder.png";
            var textfeatured = "";
            var classfeatured = "";
            var author = "";
			var totaldonation="";
			var totaldonationamount="";
            var category_id = "";
            var category_name = "";
            var bAuthor = false;
            var bFeatured = false;
            var bCategory = false;
			paymentRequests = res.data[key]["paymentRequests"];
			if(paymentRequests!=undefined)
			{
				vm.total_payment_requests=paymentRequests.length;
				jQuery.each(paymentRequests[0], function(k, v)
				{
					if (k=="requestedAmount") vm.total_payment_requests_amount+=parseFloat(v);
				});
			}
            jQuery.each(value, function(key2, value2) {
              if (key2 == "hash") {
                hash = value2;
                for (i = 0; i < aLen; i++) {
                  if (array_proposals_remote[i]["hash"] == hash) {
                    var scategory_name = array_proposals_remote[i]["category_name"];
                    if (scategory_name.length > 0) {
                      bCategory = true;
                      category_id = array_proposals_remote[i]["category_id"];
                      category_name = array_proposals_remote[i]["category_name"];
                    }
                    //
                    var sauthor = array_proposals_remote[i]["author"];
                    if (sauthor.length > 0) {
                      bAuthor = true;
                      author = array_proposals_remote[i]["author"];
                    }
                    //
                    var stotaldonation = array_proposals_remote[i]["total_donation"];
                    if (stotaldonation.length > 0) {
					  totaldonation = array_proposals_remote[i]["total_donation"];
                    }
                    //
                    var stotaldonationamount = array_proposals_remote[i]["total_donation_amount"];
                    if (stotaldonationamount.length > 0) {
                      totaldonationamount = array_proposals_remote[i]["total_donation_amount"];
                    }
                    //
                    var simg = array_proposals_remote[i]["image"];
                    if (simg.length > 0) image = array_proposals_remote[i]["image"];
                    if (array_proposals_remote[i]["featured"] == 1) {
                      classfeatured = "ui basic button tiny green ion-star pull-right";
                      textfeatured = "Featured";
                      bFeatured = true;
                    }
                  }
                }
              }
			  if (key2 == "blockHash") blockHash = value2;
              if (key2 == "description")	desc = value2;
              if (key2 == "requestedAmount") amount = numberWithCommas(value2);
              if (key2 == "paymentAddress") paymentAddress = value2;
              if (key2 == "proposalDuration") proposalDuration = secondsToDhms(value2);
              if (key2 == "votesYes") votesYes = value2;
              if (key2 == "votesNo") votesNo = value2;
			  if (key2 == "votingCycle") votingCycle = value2;
              if (key2 == "status") {
                var bAdd = false;
                status = value2;
                if (filter == "all" || filter == status || (filter == "featured" && bFeatured)) bAdd = true;
                if (bCategory && proposal_category_id) {
                  if (category_id == proposal_category_id) bAdd = true;
                }
                var total_votes = votesYes + votesNo;
                var yes_votes_proportion = Math.round((votesYes / total_votes) * 100, 2);
                var no_votes_proportion = Math.round((votesNo / total_votes) * 100, 2);
                if (!yes_votes_proportion) yes_votes_proportion = 0;
                if (!no_votes_proportion) no_votes_proportion = 0;
                if (bAdd) vm.array_proposals.push({
                  hash: hash,
				  blockHash: blockHash,
                  desc: desc,
                  amount: amount,
                  paymentAddress: paymentAddress,
				  paymentRequests: paymentRequests,
                  proposalDuration: proposalDuration,
                  votesYes: votesYes,
                  votesNo: votesNo,
				  votingCycle: votingCycle,
                  status: status,
                  image: image,
                  textfeatured: textfeatured,
                  classfeatured: classfeatured,
                  bAuthor: bAuthor,
                  author: author,
                  totaldonation: totaldonation,
                  totaldonationamount: totaldonationamount,
                  bCategory: bCategory,
                  category_name: category_name,
                  yes_votes_proportion: yes_votes_proportion,
                  no_votes_proportion: no_votes_proportion
                });
              }
            });
          });
        })
		.catch(function(err)
		{
			console.log(err)
		})
      }).catch(function(err) {
        console.log(err)
      })
    },
    proposalvote: function(proposal_hash, vote_type) {
      var config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text'
      };
      axios.post(window.hostname + 'proposalvote', {
          rpcuser: window.rpcuser,
		  token: window.token,
          rpcport: window.rpcport,
          proposal_hash: proposal_hash,
          vote_type: vote_type
        }, config).then(function(res) {
          errorhandler(res.data);
          console.log("Status:" + res.status);
          console.log("Return:" + res.data);
          if (res.data == null) {
            swal("Success!", "You have successfully voted.", "success");
          }
        })
        .catch(function(err) {
          console.log(err);
        })
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
        }, config).then(function(res) {
          errorhandler(res.data);
          console.log("Status:" + res.status);
          console.log("Return:" + res.data);
          if (res.data == null) {
            swal("Success!", "You have successfully voted.", "success");
          }
        })
        .catch(function(err) {
          console.log(err);
        })
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