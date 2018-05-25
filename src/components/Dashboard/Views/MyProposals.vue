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
    <h4>My Proposals</h4>
    <h5>{{proposal_info}}</h5>
    <!--<div class="row"><div class="col-md-12"><textarea class="form-control" style="width:100%;height:200px;" id="debug"></textarea></div></div>!-->
    <div class="row">
      <div v-for="proposal in array_proposals" class="col-md-6 col-sm-6">
        <div class="card">
          <div class="card-header">
            <h4><span>{{proposal.desc}}</span></h4></div>
          <div class="card-body">
            <div class="card card-user"><img v-bind:src="proposal.image" /></div><span v-show="proposal.bAuthor" class="btn btn-fill btn-sm btn-primary pull-right">&nbsp;<i class="ion-person text-default"></i>&nbsp;{{proposal.author}}</span><span style="margin-right:5px;" v-bind:class="proposal.classfeatured">&nbsp;{{proposal.textfeatured}}</span>
            <div><i class="fa ion-trophy text-primary"></i>&nbsp;{{proposal.amount}} NAV</div>
            <div><i class="fa fa-clock-o text-danger"></i>&nbsp;{{proposal.deadline}}</div>
            <div><i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{proposal.votesYes}}&nbsp;&nbsp;&nbsp;<i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{proposal.votesNo}}</div>
            <div><br>
              <div class='ui buttons tiny'>
                <button class="ui button tiny gray">{{proposal.status}}</button>
                <a target="_blank" class="ui button tiny blue" v-bind:href="'http://navcommunity.net/view-proposal/'+proposal.hash">View</a>
              </div>
              <div class="ui buttons tiny">
                <button title="Yes" @click="proposalvote(proposal.hash,'yes')" class='ui button tiny green'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>
                <button title="No" class="ui button tiny red" @click="proposalvote(proposal.hash,'no')"><i class='fa fa-thumbs-o-down' aria-hidden='true'></i></button>
	<button title="Remove" @click="proposalvote(proposal.hash, 'remove') " class='ui button tiny gray'><i class='fa fa-close' aria-hidden='true'></i></button>
	</div>
	</div></div></div></div></div>
	</div>
  </div>
</template>

<script>
import Card from 'src/components/UIComponents/Cards/Card.vue'
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

var proposal_info = "";
export default {
  components: {
    Card,
  },
  data: function() {
    var array_proposals = [];
    var array_proposals_remote = [];
    var nav_address_list = [];
    var o = "";
    var i = 0;
    axios.post(window.hostname + 'listaddressgroupings', {
      token: window.token,
      rpcport: window.rpcport
    }, window.config).then(function(res) {
      jsonQ.each(res.data, function(key, value) {
        jQuery.each(value, function(index, item) {
          o = o + item[0] + "\r\n";
          nav_address_list.push({
            address: item[0]
          });
        });
      });
      axios.post(window.hostname + 'listproposals', {
        token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res2) {
        var aLen = 0;
        axios.post("http://navcommunity.net/api/getproposals.php", {}, window.config).then(function(res0) {
          jsonQ.each(res0.data, function(key, value) {
            jQuery.each(value, function(key2, value2) {
              array_proposals_remote.push({
                hash: value2.hash,
                image: value2.image,
                featured: value2.featured
              });
              aLen++;
            });
          });
          jsonQ.each(res2.data, function(key, value) {
            var hash = "";
            var cls = "";
            var icon = "";
            var desc = "";
            var amount = "";
            var paymentAddress = "";
            var deadline = "";
            var votesYes = "";
            var votesNo = "";
            var status = "";
            var image = "static/img/placeholder.png";
            var textfeatured = "";
            var classfeatured = "";
            jQuery.each(value, function(key2, value2) {
              if (key2 == "hash") {
                hash = value2;
                for (i = 0; i < aLen; i++) {
                  if (array_proposals_remote[i]["hash"] == hash) {
                    var simg = array_proposals_remote[i]["image"];
                    if (simg.length > 0) image = array_proposals_remote[i]["image"];
                    if (array_proposals_remote[i]["featured"] == 1) {
                      classfeatured = "btn btn-sm btn-fill btn-success ion-star pull-right";
                      textfeatured = "Featured";
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
                nav_address_list.filter(function(v, k) {
                  if (v["address"] == paymentAddress) {
                    i++;
                    status = value2;
                    if (status == "pending") status = "Pending";
                    if (status == "accepted") status = "Accepted";
                    if (status == "rejected") status = "Rejected";
                    array_proposals.push({
                      hash: hash,
                      desc: desc,
                      amount: amount,
                      paymentAddress: paymentAddress,
                      deadline: deadline,
                      votesYes: votesYes,
                      votesNo: votesNo,
                      status: status,
                      image: image,
                      textfeatured: textfeatured,
                      classfeatured: classfeatured
                    });
                  }
                });
              }
            });
          });
          if (array_proposals.length < 1) proposal_info = "You don't have any proposal.";
          else proposal_info = "You have " + array_proposals.length + " proposal";
        }).catch(function(err) {
          console.log(err)
        })
      }).catch(function(err) {
        console.log(err)
      })
    });
    return {
      array_proposals,
      proposal_info
    }
  },
  methods: {
    proposalvote: function(proposal_hash, vote_type) {
      //swal(proposal_hash+"\r\n"+vote_type);
      axios.post(window.hostname + 'proposalvote', {
          token: window.token,
          rpcport: window.rpcport,
          proposal_hash: proposal_hash,
          vote_type: vote_type
        }, window.config).then(function(res) {
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
    }
  }
}
</script>
