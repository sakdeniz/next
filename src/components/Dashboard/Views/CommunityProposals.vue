<template>
  <div class="content">
	<div class="container-fluid">
	<div class="row">
	<div class="col-md-12">
	<router-link class="btn btn-sm btn-fill btn-info" style="margin-bottom:5px" to="/admin/create-proposal"><i class="ion-plus-round"></i>&nbsp;Create Proposal</router-link>
	<router-link class="btn btn-sm btn-fill btn-info" style="margin-bottom:5px" to="/admin/community-proposals"><i class="ion-navicon-round"></i>&nbsp;All Proposals</router-link>
	<router-link class="btn btn-sm btn-fill btn-info" style="margin-bottom:5px" to="/admin/my-proposals"><i class="ion-heart"></i>&nbsp;My Proposals</router-link>
	<router-link class="btn btn-sm btn-fill btn-info" style="margin-bottom:5px" to="/admin/proposal-vote-list"><i class="ion-checkmark-round"></i>&nbsp;Proposal Vote List</router-link>
	<router-link class="btn btn-sm btn-fill btn-info" style="margin-bottom:5px" to="/admin/payment-request-vote-list"><i class="ion-log-out"></i>&nbsp;Payment Request Vote List</router-link>
	</div>
	</div>
	<h4>All Proposals</h4>
	<!--<div class="row"><div class="col-md-12"><textarea class="form-control" style="width:100%;height:200px;" id="debug"></textarea></div></div>!-->
	<div class="row"><div v-for="proposal in array_proposals" class="col-md-6 col-sm-6"><div class="card"><div class="card-header"><div class="alert alert-primary"><span>{{proposal.desc}}</span></div></div><div class="card-body"><div><i class="fa ion-trophy text-primary"></i>&nbsp;{{proposal.amount}} NAV</div><div><i class="fa fa-clock-o text-danger"></i>&nbsp;{{proposal.deadline}}</div><div><i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{proposal.votesYes}}&nbsp;&nbsp;&nbsp;<i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{proposal.votesNo}}</div><div><br><button class="btn btn-sm btn-fill btn-info">{{proposal.status}}</button>&nbsp;<a target="_blank" class="btn btn-sm btn-fill btn-primary" v-bind:href="'http://navcommunity.net/view-proposal/'+proposal.hash"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View</a><div style="margin-left:0px;margin-top:5px"><button title="Yes" @click="proposalvote(proposal.hash,'yes')" class='btn btn-sm btn-fill btn-success'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button><button title="No" class="btn btn-sm btn-fill btn-danger" style="margin-left:5px" @click="proposalvote(proposal.hash,'no')""><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></button><button title="Remove" style="margin-left:5px" @click="proposalvote(proposal.hash,'remove')" class='btn btn-sm btn-fill btn-default'><i class='fa fa-close' aria-hidden='true'></i></button></div></div></div></div></div></div>
	</div>
	<div class="row" id="proposal-list"></div>
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
  function numberWithCommas(n)
  {
    var parts=n.toString().split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
  }
  
  function errorhandler(data)
  {
	if (data)
	{
		if(data["error"])
		{
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
data: function () {
        var array_proposals = []
		axios.post(window.hostname+'listproposals',{token:window.token},window.config).then(function(res)
		{
			var i=0;
			console.log("Status:" + res.status)
			console.log("Return:" + res.data)
			jsonQ.each(res.data, function (key, value)
			{
				var hash="";
				var cls="";
				var icon="";
				var desc="";
				var amount="";
				var paymentAddress="";
				var deadline="";
				var votesYes="";
				var votesNo="";
				var status="";
				jQuery.each(value, function(key2, value2)
				{
					if (key2=="hash") hash=value2;
					if (key2=="description") desc=value2;
					if (key2=="requestedAmount") amount=numberWithCommas(value2);
					if (key2=="paymentAddress") paymentAddress=value2;
					if (key2=="deadline") deadline=moment.unix(value2).format("MM/DD/YYYY");
					if (key2=="votesYes") votesYes=value2;
					if (key2=="votesNo") votesNo=value2;
					if (key2=="status")
					{
						status=value2;
						if (status=="pending") status="Pending";
						if (status=="accepted") status="Accepted";
						if (status=="rejected") status="Rejected";
						array_proposals.push({hash:hash,desc:desc,amount:amount,paymentAddress:paymentAddress,deadline:deadline,votesYes:votesYes,votesNo:votesNo,status:status});
					}
				});
				//document.getElementById("debug").innerHTML=o;
			});
			console.log("done");
		}).catch(function(err)
		{
			console.log(err)
		})
      return {
        array_proposals,
      }
    },
	created: function ()
	{
	},
	updated: function ()
	{
	console.log("updated");
	},
	beforeCreate: function ()
	{
	console.log("beforecreate");
	},
	beforeCreate: function ()
	{
	console.log("beforecreate");
	},
	activated: function ()
	{
	console.log("activated");
	},
    methods:
	{
		proposalvote: function (proposal_hash,vote_type)
		{
			//swal(proposal_hash+"\r\n"+vote_type);
			var config = {headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
			axios.post(window.hostname+'proposalvote',{token:window.token,proposal_hash:proposal_hash,vote_type:vote_type},config).then(function(res)
			{
				errorhandler(res.data);
				console.log("Status:" + res.status);
				console.log("Return:" + res.data);
				if(res.data==null)
				{
					swal("Success!", "You have successfully voted.", "success");
				}
			})
			.catch(function(err)
			{
				console.log(err);
			})
		}
	}
}
</script>
