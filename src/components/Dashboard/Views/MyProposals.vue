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
    <span v-if="info.unlocked_until==0" title="Unlock Wallet" class="ui visible message yellow"><i class="ion-unlocked"></i>&nbsp;Your wallet is locked. You will be asked for your wallet password to confirm.</span>
	<h5>{{proposal_info}}</h5>
    <div class="row">
      <div v-for="proposal in array_proposals" class="col-md-12 col-sm-12">
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
			<button v-if="proposal.status=='Accepted'" title="Create Payment Request" @click="paymentrequest(proposal.hash)" class='ui button tiny purple right floated'><i class='ion-plus' aria-hidden='true'></i> Create Payment Request</button>
			<div class="ui segment" v-if="proposal.paymentRequests">
				<a class="ui purple ribbon label">Payment Requests</a>
				<table class="ui striped table">
				<thead>
					<tr>
						<th nowrap>Request ID</th>
						<th nowrap>Amount (NAV)</th>
						<th nowrap>Status</th>
						</tr>
					</thead>
					<tbody>
					<template v-for="paymentRequest in proposal.paymentRequests">
					<tr>
						<td nowrap style="width:100%">{{paymentRequest.description}}</td>
						<td nowrap>{{paymentRequest.requestedAmount}}</td>
						<td nowrap>{{paymentRequest.status}}</td>
					</tr>
					<tr>
					<td colspan='6'>
						<button title="Info" @click="showinfo('Payment Request','<div style=\'text-align:left\'><small>Hash:<br><code>'+paymentRequest.hash+'</code></small></div>','info')" class='circular ui icon button tiny teal'><i class='ion-information-circled' aria-hidden='true'></i></button>
						<button title="Vote Yes" @click="paymentrequestvote(paymentRequest.hash,'yes')" class='ui button tiny olive'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>
						<button title="Vote No" class="ui button tiny pink" @click="paymentrequestvote(paymentRequest.hash,'no')"><i class='fa fa-thumbs-o-down' aria-hidden='true'></i></button>
						<button title="Remove Vote" @click="paymentrequestvote(paymentRequest.hash, 'remove') " class='ui button tiny gray'><i class='fa fa-close' aria-hidden='true'></i></button>
						<i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{paymentRequest.votesYes}}&nbsp;&nbsp;&nbsp;<i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{paymentRequest.votesNo}}
					</td>
					</tr>
					</template>
					</tbody>
					</table>
			</div>
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

var proposal_info = "";
export default {
  components: {
    Card,
  },
  computed: {
    ...mapState({
      info: "info",
    })
  },
  created: function()
  {
	this.getInfo();
  },
  data: function() {
    var array_proposals = [];
    var array_proposals_remote = [];
    var nav_address_list = [];
    var o = "";
    var i = 0;
    axios.post(window.hostname + 'listaddressgroupings', {
      rpcuser: window.rpcuser,
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
        rpcuser: window.rpcuser,
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
			var paymentRequests=[];
            var deadline = "";
            var votesYes = "";
            var votesNo = "";
            var status = "";
            var image = "static/img/placeholder.png";
            var textfeatured = "";
            var classfeatured = "";
            paymentRequests = res2.data[key]["paymentRequests"];
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
					  paymentRequests: paymentRequests,
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
    ...mapActions({
      getInfo: "getInfo",
    }),
	showinfo: (title,html,type) => {
	swal({
        title: title,
        html: html,
		allowOutsideClick: false,
		type:type});
	},
	fCreatePaymentRequest:function(ProposalHash,bWalletLocked,WalletPassword)
	{
		axios.post(window.hostname + 'createpaymentrequest', {
		rpcuser: window.rpcuser,
		token: window.token,
		rpcport: window.rpcport,
		b_wallet_locked: bWalletLocked,
		wallet_password: WalletPassword,
		proposal_hash: ProposalHash,
		amount: $("#amount").val(),
		id: $("#unique_id").val(),
		}, config).then(function(res) {
		errorhandler(res.data);
		console.log("Status:" + res.status);
		console.log("Return:" + res.data);
		if (res.data)
		{
			if (!res.data["error"])
			{
				swal("Success!", "Your payment request successfully created.", "success");
			}
		}
		})
		.catch(function(err) {
		console.log(err);
		})
	},
    proposalvote: function(proposal_hash, vote_type) {
      //swal(proposal_hash+"\r\n"+vote_type);
      axios.post(window.hostname + 'proposalvote', {
          rpcuser: window.rpcuser,
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
	paymentrequest: function(proposal_hash) {
      let vm=this;
   	  var htmlEncryptionPassword="";
	  var bWalletLocked=false;
	  if (vm.info.unlocked_until==0)
	  {
		bWalletLocked=true;
		htmlEncryptionPassword='<br><input id="wallet_password" name="wallet_password" type="password" placeholder="Wallet Encryption Password" class="form-control">'
	  }
	  var config = {
		headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text'
      };
        const {
        value: accept
      } = swal({
        title: 'Create Payment Request',
        html: "<div style='text-align:left'><input type='textbox' id='amount' name='amount' placeholder='Amount' class='form-control'></input><br/><input type='textbox' id='unique_id' name='unique_id' placeholder='Unique id to identify the payment request. Ex: March Invoice' class='form-control'></input>"+htmlEncryptionPassword+"</div>",
        allowOutsideClick: false,
        input: 'checkbox',
        inputValue: 1,
	    onOpen: () => {$("#amount").focus();},
        inputPlaceholder: 'I understand.',
        confirmButtonColor: '#8F1EB4',
		confirmButtonText: 'Confirm <i class="fa fa-arrow-right></i>',
        cancelButtonText: 'Cancel <i class="fa fa-close></i>',
  	    showCancelButton: true,
        inputValidator: (result) => {
          return !result && 'You need to agree with T&C'
        }
      }).then(function(res) {
	    if (res.value)
		{
			if (vm.info.unlocked_until==0)
			{
				vm.fCreatePaymentRequest(proposal_hash,true,$("#wallet_password").val());
			}
			else
			{
				vm.fCreatePaymentRequest(proposal_hash,false,null);
			}
		}
      });
    }
  }
}
</script>
