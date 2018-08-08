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
        <br><br>
      </div>
    </div>
    <!-- !-->
    <h4>Proposal Vote List</h4>
    <h5>{{proposal_info}}</h5>
    <table class="ui celled padded table">
      <tr>
        <th nowrap>Your Vote</th>
        <th>View</th>
        <th nowrap>Proposal Title</th>
        <th nowrap>Amount</th>
        <th nowrap>Positive Votes</th>
        <th nowrap>Negative Votes</th>
        <th nowrap>Status</th>
      </tr>
      <tr v-for="proposal_vote in array_proposal_votes">
        <td nowrap>
          <center><i v-bind:class="proposal_vote.voteType"></i></center>
        </td>
        <td nowrap><a target="_blank" class="btn btn-sm btn-fill btn-primary" v-bind:href="'http://navcommunity.net/view-proposal/'+proposal_vote.hash"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View</a></td>
        <td nowrap>{{proposal_vote.strDZeel}}</td>
        <td nowrap>{{proposal_vote.nAmount}} NAV</td>
        <td nowrap>{{proposal_vote.nVotesYes}}</td>
        <td nowrap>{{proposal_vote.nVotesNo}}</td>
        <td nowrap style='width:100%'>{{proposal_vote.fState}}</td>
      </tr>
    </table>
    <h4>Payment Request List</h4>
    <table class="ui celled padded table">
      <tr>
        <th nowrap>Proposal Title</th>
        <th nowrap>Request ID</th>
        <th nowrap>Amount</th>
        <th nowrap>Positive Votes</th>
        <th nowrap>Negative Votes</th>
        <th nowrap>Status</th>
      </tr>
      <tr v-for="proposal_payment_request in array_payment_request_votes">
        <td nowrap>{{proposal_payment_request.sProposalTitle}}</td>
        <td nowrap>{{proposal_payment_request.strDZeel}}</td>
        <td nowrap>{{proposal_payment_request.nAmount}} NAV</td>
        <td nowrap>{{proposal_payment_request.nVotesYes}}</td>
        <td nowrap>{{proposal_payment_request.nVotesNo}}</td>
        <td nowrap style='width:100%'>{{proposal_payment_request.fState}}</td>
      </tr>
    </table>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Vue from 'vue';

function numberWithCommas(n) {
  var parts = n.toString().split(".");
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

var proposal_info = "";
export default {
  components: {},
  data: function() {
    var array_proposal_votes = [];
    var array_payment_request_votes = [];
    var nav_address_list = [];
    var o = "";
    var i = 0;
    axios.post(window.hostname + 'proposalvotelist', {
      rpcuser: window.rpcuser,
	  token: window.token,
      rpcport: window.rpcport
    }, window.config).then(function(res) {
      var hash, voteType, strDZeel, nAmount, nVotesYes, nVotesNo, fState = "";
      var sProposalTitle, Phash, PvoteType, PstrDZeel, PnAmount, PnVotesYes, PnVotesNo, PfState = "";
      axios.post(window.hostname + 'listaddressgroupings', {
        rpcuser: window.rpcuser,
		token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res) {
        jsonQ.each(res.data, function(key, value) {
          jQuery.each(value, function(index, item) {
            nav_address_list.push({
              address: item[0]
            });
          });
        });
      }).catch(function(err) {
        console.log(err)
      })
      o = "";
      jsonQ.each(res.data, function(key, value) {
        voteType = key;
        jQuery.each(value, function(key2, value2) {
          var r = value2;
          r = r.replace("CProposal", "");
          r = r.replace(/"/g, "").replace(/'/g, "").replace(/\(|\)/g, "");
          var rx = r.split('\n');
          var CProposal = rx[0].split(',');
          for (var i = 0; i < CProposal.length; i++) {
            var kv = CProposal[i].split('=');
            kv[0] = kv[0].trim();
            o += kv[0] + "=" + kv[1] + "<br/>";
            console.log(kv[0] + "=" + kv[1]);
            if (kv[0] == "strDZeel") strDZeel = kv[1];
            if (kv[0] == "nAmount") nAmount = kv[1];
            if (kv[0] == "nVotesYes") nVotesYes = kv[1];
            if (kv[0] == "nVotesNo") nVotesNo = kv[1];
            if (kv[0] == "fState") fState = kv[1];
            if (kv[0] == "hash") hash = kv[1];
          }
          //
          if (rx.length > 2) {
            var CPaymentRequest = rx[1].split(',');
            for (var i = 0; i < CPaymentRequest.length; i++) {
              var kv2 = CPaymentRequest[i].split('=');
              kv2[0] = kv2[0].trim();
              if (kv2[0] == "strDZeel") PstrDZeel = kv2[1];
              if (kv2[0] == "nAmount") PnAmount = kv2[1];
              if (kv2[0] == "nVotesYes") PnVotesYes = kv2[1];
              if (kv2[0] == "nVotesNo") PnVotesNo = kv2[1];
              if (kv2[0] == "fState") PfState = kv2[1];
              if (kv2[0] == "hash") Phash = kv2[1];
              sProposalTitle = strDZeel;
            }
            if (PvoteType == "yes") PvoteType = "fa fa-thumbs-o-up text-success";
            if (PvoteType == "no") PvoteType = "fa fa-thumbs-o-down text-danger";
            if (PfState == "pending") PfState = "Pending";
            if (PfState == "accepted") PfState = "Accepted";
            if (PfState == "rejected") PfState = "Rejected";
            if (PfState == "expired") PfState = "Expired";
            array_payment_request_votes.push({
              hash: Phash,
              sProposalTitle: sProposalTitle,
              voteType: PvoteType,
              strDZeel: PstrDZeel,
              nAmount: numberWithCommas(PnAmount),
              nVotesYes: PnVotesYes,
              nVotesNo: PnVotesNo,
              fState: PfState
            });
          }
          if (voteType == "yes") voteType = "fa fa-thumbs-o-up text-success";
          if (voteType == "no") voteType = "fa fa-thumbs-o-down text-danger";
          if (fState == "pending") fState = "Pending";
          if (fState == "accepted") fState = "Accepted";
          if (fState == "rejected") fState = "Rejected";
          if (fState == "expired") fState = "Expired";
          array_proposal_votes.push({
            hash: hash,
            voteType: voteType,
            strDZeel: strDZeel,
            nAmount: numberWithCommas(nAmount),
            nVotesYes: nVotesYes,
            nVotesNo: nVotesNo,
            fState: fState
          });
        });
      });
      if (array_proposal_votes.length < 1) proposal_info = "You don't have any votes.";
      else proposal_info = "You have " + array_proposal_votes.length + " votes";
      console.log("done");
    }).catch(function(err) {
      console.log(err)
    })
    return {
      array_proposal_votes,
      array_payment_request_votes,
      proposal_info
    }
  },
  methods: {
    proposalvote: function(proposal_hash, vote_type) {
      swal(proposal_hash + "\r\n" + vote_type);
      axios.post(window.hostname + 'proposalvote', {
          rpcuser: window.rpcuser,
		  token: window.token,
          rpcport: window.rpcport,
          proposal_hash: proposal_hash,
          vote_type: vote_type
        }, window.config).then(function(res) {
          console.log("Status:" + res.status);
          console.log("Return:" + res.data);
          swal(res.data);
        })
        .catch(function(err) {
          console.log(err);
        })
    }
  }
}
</script>
