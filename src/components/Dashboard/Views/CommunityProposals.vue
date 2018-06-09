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
            <sui-dropdown-item v-on:click="listproposals('rejected')">Rejected</sui-dropdown-item>
          </sui-dropdown-menu>
        </sui-dropdown>

        <div class="ui left icon input large">
          <i class="search icon"></i>
          <input placeholder="Search..." type="text" v-model="search">
        </div>
        <div class="ui toggle checkbox" style="margin-left:10px">
          <input name="check1" type="checkbox" v-model="cTableView">
          <label>Table View</label>
        </div>
        <br><br>
      </div>
    </div>

    <div class="ui two column grid">
      <div class="column">
        <div class="ui segment">
          <a class="ui red ribbon label">Overview</a>
          <p></p>
          <div>Available : {{formatnumbers(cfund_available)}}
            <div class="ui purple horizontal label">NAV</div>
          </div>
          <div>Locked : {{formatnumbers(cfund_locked)}}
            <div class="ui purple horizontal label">NAV</div>
          </div>
          <p></p>
          <a class="ui blue ribbon label">Current Period</a>
          <p></p>
          <div>Voting Period Start : {{cfund_starting}}</div>
          <div>Voting Period End : {{cfund_ending}}</div>
          <div>Voted Proposals : {{cfund_voted_proposals}}</div>
          <div>Voted Payment Requests : {{cfund_voted_payment_requests}}</div>
        </div>
      </div>
      <div class="column">
        <div class="ui segment">
          <a class="ui orange right ribbon label">Status</a>
          <p></p>
          <table class="ui celled striped table">
  <thead>
    <tr><th colspan="2">
      Proposals by Status
    </th>
  </tr></thead>
  <tbody>
    <tr>
      <td>
        <i class="ion-android-time"></i> Pending
      </td>
      <td class="right aligned collapsing">{{array_proposals.filter(item => item.status=="Pending").length}}</td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-done-all"></i> Accepted
      </td>
      <td class="right aligned">{{array_proposals.filter(item => item.status=="Accepted").length}}</td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-done"></i> Accepted waiting for enough coins in fund
      </td>
      <td class="right aligned">{{array_proposals.filter(item => item.status=="Accepted waiting for enough coins in fund").length}}</td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-close"></i> Rejected
      </td>
      <td class="right aligned">{{array_proposals.filter(item => item.status=="Rejected").length}}</td>
    </tr>
    <tr>
      <td>
        <i class="ion-android-delete"></i> Expired
      </td>
      <td class="right aligned">{{array_proposals.filter(item => item.status=="Expired").length}}</td>
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
          <div class="card-header">
            <h6><span>{{proposal.desc}}</span></h6>
            <div>
              <button role="button" v-show="proposal.bCategory" class="ui icon left labeled button"><i class="ion-bookmark icon icon"></i>{{proposal.category_name}}</button>
            </div>
          </div>
          <div class="card-body">
            <div class="card card-user"><img v-bind:src="proposal.image" /></div>
            <span v-show="proposal.bAuthor" class="ui purple button pull-right">&nbsp;<i class="ion-person text-default"></i>&nbsp;{{proposal.author}}</span>
            <span style="margin-right:5px;" v-bind:class="proposal.classfeatured">&nbsp;{{proposal.textfeatured}}</span>
            <div><i class="fa ion-trophy text-primary"></i>&nbsp;{{proposal.amount}} NAV</div>
            <div><i class="fa fa-clock-o text-danger"></i>&nbsp;{{proposal.deadline}}</div>
            <div class="row">
              <div class="col-md-6"><i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{proposal.votesYes}}
                <sui-progress color="green" :percent="proposal.yes_votes_proportion" progress/>
              </div>
              <div class="col-md-6"><i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{proposal.votesNo}}
                <sui-progress color="orange" :percent="proposal.no_votes_proportion" progress/>
              </div>
            </div>
            <div>
              <div class="row">
			  <div class="col-md-12">
              <div class='form-group ui buttons tiny'>
                <button class="ui button tiny gray">{{proposal.status}}</button>
                <a target="_blank" class="ui button tiny blue" v-bind:href="'http://navcommunity.net/view-proposal/'+proposal.hash">View</a>
              </div>
			  </div>
			  </div>
              <div class="row" style="margin-top:5px">
			  <div class="col-md-12">
			  <div class="ui buttons tiny">
                <button title="Yes" @click="proposalvote(proposal.hash,'yes')" class='ui button tiny green'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>
                <button title="No" class="ui button tiny red" @click="proposalvote(proposal.hash,'no')"><i class='fa fa-thumbs-o-down' aria-hidden='true'></i></button>
				<button title="Remove" @click="proposalvote(proposal.hash, 'remove') " class='ui button tiny gray'><i class='fa fa-close' aria-hidden='true'></i></button>
			</div>
			<div v-show="proposal.status=='Accepted'" class="ui labeled button tiny right floated" tabindex="0">
				<div class="ui purple button tiny" @click="proposaldonate(proposal.hash,proposal.paymentAddress)"><i class="heart icon"></i> Donate</div>
					<a class="ui basic purple left pointing label">
						{{proposal.totaldonationamount}}&nbsp;&nbsp;&nbsp;<i class="ion-person"></i>&nbsp;{{proposal.totaldonation}}
					</a>
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
		</div></div></div></div></div>
		<!-- !-->
		<table class="ui padded striped table " v-if="cTableView ">
		<thead>
		<tr>
		<th></th>
		<th>Title</th>
		<th>Vote</th>
		<th>Status</th>
		<th>Amount (NAV)</th>
		<th>Deadline</th>
		<th nowrap>Yes Votes</th>
		<th nowrap>No Votes</th>
		<th>Category</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="proposal in array_proposals " v-if="!search || proposal.desc.toLowerCase().indexOf(search.toLowerCase())!=-1 ">
		<td><a target="_blank " class="ui button tiny purple " v-bind:href=" 'http://navcommunity.net/view-proposal/'+proposal.hash ">View</a></td>
		<td>{{proposal.desc}}<div><span v-show="proposal.bAuthor " class="ui purple button pull-right ">&nbsp;<i class="ion-person text-default "></i>&nbsp;{{proposal.author}}</span><span style="margin-right:5px; " v-bind:class="proposal.classfeatured ">&nbsp;{{proposal.textfeatured}}</span></div></td>
		<td>
		<div class="btn-group ">
		<button title="Yes " @click="proposalvote(proposal.hash, 'yes')" class='ui button tiny green'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>
		<button title="No " class="ui button tiny orange " @click="proposalvote(proposal.hash,'no') ""><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></button>
		<button title="Remove" @click="proposalvote(proposal.hash,'remove')" class='ui button tiny gray'><i class='fa fa-close' aria-hidden='true'></i></button></div>
              </td>
              <td>{{proposal.status}}</td>
              <td>{{proposal.amount}}</td>
              <td>{{proposal.deadline}}</td>
              <td>{{proposal.votesYes}}
                <sui-progress color="green" :percent="proposal.yes_votes_proportion" progress/>
              </td>
              <td>{{proposal.votesNo}}
                <sui-progress color="orange" :percent="proposal.no_votes_proportion" progress/>
              </td>
              <td>{{proposal.category_name}}</td>
              </tr>
              </tbody>
              </table>
            </div>
          </div>
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
  data: function() {
    var array_proposals = [];
    var array_categories = [];
    var search = "";
    return {
      array_proposals,
      array_categories,
      search,
      cTableView: false
    }
  },
  created: function() {
    this.listproposals("all");
  },
  methods: {
    formatnumbers: function(n) {
      var parts = n.toString().split(".");
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    },
    listproposals: function(filter, proposal_category_id) {
      var array_proposals_remote = [];
      var array_proposals = [];
      var cfund_available = "";
      var cfund_locked = "";
      var cfund_starting = "";
      var cfund_ending = "";
      var cfund_voted_proposals = "";
      var cfund_voted_payment_requests = "";
      let vm = this;
      vm.array_proposals = [];
      vm.array_categories = [];
      axios.post(window.hostname + 'cfundstats', {
        token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res) {
        vm.cfund_available = jsonQ(res.data).pathValue(["funds", "available"]);
        vm.cfund_locked = jsonQ(res.data).pathValue(["funds", "locked"]);
        vm.cfund_starting = jsonQ(res.data).pathValue(["votingPeriod", "starting"]);
        vm.cfund_ending = jsonQ(res.data).pathValue(["votingPeriod", "ending"]);
        vm.cfund_voted_proposals = jsonQ(res.data).pathValue(["votingPeriod", "votedProposals"]).length;
        vm.cfund_voted_payment_requests = jsonQ(res.data).pathValue(["votingPeriod", "votedPaymentrequests"]).length;
      });
      axios.post(window.hostname + 'listproposals', {
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
            var cls = "";
            var icon = "";
            var desc = "";
            var amount = "";
            var paymentAddress = "";
			var paymentRequests=[];
            var deadline = "";
            var votesYes = "";
            var votesNo = "";
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
                      classfeatured = "ui green button ion-star pull-right";
                      textfeatured = "Featured";
                      bFeatured = true;
                    }
                  }
                }
              }
              if (key2 == "description") desc = value2;
              if (key2 == "requestedAmount") amount = numberWithCommas(value2);
              if (key2 == "paymentAddress") paymentAddress = value2;
              if (key2 == "deadline") deadline = moment.unix(value2).format("MM/DD/YYYY");
              if (key2 == "votesYes") votesYes = value2;
              if (key2 == "votesNo") votesNo = value2;
              if (key2 == "status") {
                var bAdd = false;
                status = value2;
                if (filter == "all" || filter == status || (filter == "featured" && bFeatured)) bAdd = true;
                if (bCategory && proposal_category_id) {
                  if (category_id == proposal_category_id) bAdd = true;
                }
                if (status == "pending") status = "Pending";
                if (status == "accepted") status = "Accepted";
                if (status == "rejected") status = "Rejected";
                if (status == "rejected waiting for end of voting period") status = "Rejected waiting for end of voting period";
                if (status == "accepted waiting for enough coins in fund") status = "Accepted waiting for enough coins in fund";
				//
                var total_votes = votesYes + votesNo;
                var yes_votes_proportion = Math.round((votesYes / total_votes) * 100, 2);
                var no_votes_proportion = Math.round((votesNo / total_votes) * 100, 2);
                if (!yes_votes_proportion) yes_votes_proportion = 0;
                if (!no_votes_proportion) no_votes_proportion = 0;
                if (bAdd) vm.array_proposals.push({
                  hash: hash,
                  desc: desc,
                  amount: amount,
                  paymentAddress: paymentAddress,
				  paymentRequests: paymentRequests,
                  deadline: deadline,
                  votesYes: votesYes,
                  votesNo: votesNo,
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
        });
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
					swal("Success!", "You have successfully donated.", "success");
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