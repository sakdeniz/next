<template>
  <div class="content">
	<!--<div class="container-fluid">
      <div class="row">
        <div class="col-xs-12 col-md-12">
       	  <div class="card">
		<div class="card-body">
			<div class="row"><div class="col-md-12"><button class="btn btn-success" v-on:click="getinfo">getinfo</button><br><br></div></div>
			<div class="row"><div class="col-md-12"><textarea class="form-control" style="width:100%;height:200px;" id="debug"></textarea></div></div>
			</div>
			</div>
        </div>
	  </div>
	</div>!-->
	<div class="container-fluid">
	  <div class="row"><div id='div_status' class="col-md-12"><span class="btn btn-xs btn-fill btn-default" id="status">-</span><br><br></div><div id='div_info' class="col-md-12"><span class="btn btn-xs btn-fill btn-warning" id="version">-</span>&nbsp;<span class="btn btn-xs btn-fill btn-success" id="net">-</span>&nbsp;<span class="btn btn-xs btn-fill btn-info" id="blocks">-</span>&nbsp;<span class="btn btn-xs btn-fill btn-info" id="headers">-</span>&nbsp;<span class="btn btn-xs btn-fill btn-info" id="verificationprogress">-</span>&nbsp;<span class="btn btn-xs btn-fill btn-primary" id="staking_enabled">-</span><br><br></div></div>
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="ion-ios-albums-outline text-info"></i>
            </div>
            <div slot="content">
              <p class="card-category">BALANCE</p>
              <h5 class="card-title" id="balance">-</h5>
			  <h4 class="card-title">NAV</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i><span id='balance_updated'></span>
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
              <h5 class="card-title" id="staking_last_7_days">-</h5>
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
              <h4 class="card-title" id="transaction_count">-</h4>
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
              <h4 class="card-title" id="connections">-</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Updated now
            </div>
          </stats-card>
        </div>

      </div>

<h4 class="card-title">Community Fund <button class="btn btn-fill btn-sm btn-info"> Featured Proposals</button></h4>
	<div class="row"><div v-for="proposal in array_proposals" class="col-md-6 col-sm-12"><div class="card"><div class="card-header"><h4><span>{{proposal.desc}}</span></h4></div><div class="card-body"><div class="card card-user"><img v-bind:src="proposal.image" /></div><span v-show="proposal.bAuthor" class="ui purple button pull-right">&nbsp;<i class="ion-person text-default"></i>&nbsp;{{proposal.author}}</span><div><i class="fa ion-trophy text-primary"></i>&nbsp;{{proposal.amount}} NAV</div><div><i class="fa fa-clock-o text-danger"></i>&nbsp;{{proposal.deadline}}</div><div><i class="fa fa-thumbs-o-up text-success"></i>&nbsp;{{proposal.votesYes}}&nbsp;&nbsp;&nbsp;<i class="fa fa-thumbs-o-down text-danger"></i>&nbsp;{{proposal.votesNo}}</div><div><br><div class='btn-group'><button class="btn btn-sm btn-fill btn-info">{{proposal.status}}</button><a target="_blank" class="btn btn-sm btn-fill btn-primary" v-bind:href="'http://navcommunity.net/view-proposal/'+proposal.hash"><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View</a></div>&nbsp;<div class="btn-group"><button title="Yes" @click="proposalvote(proposal.hash,'yes')" class='btn btn-sm btn-fill btn-success'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button><button title="No" class="btn btn-sm btn-fill btn-danger" @click="proposalvote(proposal.hash,'no')"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></button><button title="Remove" @click="proposalvote(proposal.hash,'remove')" class='btn btn-sm btn-fill btn-default'><i class='fa fa-close' aria-hidden='true'></i></button></div></div></div></div></div></div>
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
			var message=data["error"]["message"];
			var code=data["error"]["code"];
			var name=data["error"]["name"];
			$("#div_status").show();
			$("#div_info").hide();
			$("#status").show();
			console.log("RPC Client Error. Code : "+code+" Message : " +message+" Error Type : "+name);
			$("#status").html("<i class='ion-android-arrow-dropright'></i>&nbsp;"+message);
		}
		else
		{
			$("#status").html("");
			$("#div_status").hide();
			$("#div_info").show();
			$("#status").hide();
		}
	}
  }
  export default {
    name: 'YouTubeExample',
	components: {
      Checkbox,
      Card,
      LTable,
      ChartCard,
      StatsCard
    },
	data: function()
	{
		var bDontShowProposals=0;
		var array_proposals = [];
		return {bDontShowProposals,array_proposals,timer: '',}
	},
	created: function ()
	{
		$("#div_info").hide();
		this.resync();
		this.timer=setInterval(this.resync, 5000);
	},
	beforeDestroy()
	{
		clearInterval(this.timer);
	},
    methods:
	{
	resync: function()
	{
		this.getblockchaininfo();
		this.getinfo();
		this.getstakinginfo();
		this.getstakereport();
		this.listtransactions();
	},
	proposalvote: function (proposal_hash,vote_type)
	{
		//swal(proposal_hash+"\r\n"+vote_type);
		var config = {headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
		axios.post(window.hostname+'proposalvote',{token:window.token,rpcport:window.rpcport,proposal_hash:proposal_hash,vote_type:vote_type},config).then(function(res)
		{
			//console.log("Status:" + res.status);
			//console.log("Return:" + res.data);
			if(res.data==null)
			{
				swal("Success!", "You have successfully voted.", "success");
			}
			else if(res.data["error"])
			{
				swal("Error!", res.data["error"]["message"], "error");
			}
		})
		.catch(function(err)
		{
			console.log(err);
		})
	},
	getfeatured: function (event)
	{
		var array_proposals_remote = [];
		let vm=this;
		axios.post(window.hostname+'listproposals',{token:window.token,rpcport:window.rpcport},window.config).then(function(res)
		{
			var aLen=0;
			axios.post("http://navcommunity.net/api/getproposals.php",{},window.config).then(function(res2)
			{
				var proposalObj=jsonQ(res2.data).pathValue([1,"proposals"]);
				jsonQ.each(proposalObj, function (k, v)
				{
					array_proposals_remote.push({hash:v.hash,image:v.image,featured:v.featured,author:v.author,category_id:v.category_id,category_name:v.category_name});
					aLen++;
				});
				//
			var i=0;
			//console.log("Status:" + res.status)
			//console.log("Return:" + res.data)
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
				var image="static/img/placeholder.png";
				var bfeatured=0;
				var textfeatured="";
				var classfeatured="";
				var author="";
				var bAuthor=false;
				jQuery.each(value, function(key2, value2)
				{
					if (key2=="hash")
					{
						hash=value2;
						for (i=0;i<aLen;i++)
						{
							if (array_proposals_remote[i]["hash"]==hash)
							{
								var sauthor=array_proposals_remote[i]["author"];
								if (sauthor.length>0)
								{
									bAuthor=true;
									author=array_proposals_remote[i]["author"];
								}
								var simg=array_proposals_remote[i]["image"];
								if (simg.length>0) image=array_proposals_remote[i]["image"];
								if (array_proposals_remote[i]["featured"]==1)
								{
									classfeatured="ui green button ion-star pull-right";
									textfeatured="Featured";
									bfeatured=1;
								}
							}
						}
					}
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
						if (bfeatured==1)
						{
							vm.array_proposals.push({hash:hash,desc:desc,amount:amount,paymentAddress:paymentAddress,deadline:deadline,votesYes:votesYes,votesNo:votesNo,status:status,image:image,textfeatured:textfeatured,classfeatured:classfeatured,bAuthor:bAuthor,author:author});
						}
					}
				});
			});
			});
		}).catch(function(err)
		{
			console.log(err)
		})
	},
	getblockchaininfo: function (event)
	{
		let vm = this;
		axios.post(window.hostname+'getblockchaininfo',{token:window.token,rpcport:window.rpcport},window.config).then(function(res)
		{
			errorhandler(res.data);
			for (var key in res.data)
			{
				var val=res.data[key];
				//console.log("[getblockchaininfo] "+key+"="+val);
				if(key=="headers") $("#headers").html("<i class='ion-asterisk'></i>&nbsp;Height "+val);
				if(key=="verificationprogress")
				{
					$("#verificationprogress").html("<i class='ion-android-checkmark-circle'></i>&nbsp;Verification "+parseFloat(val*100).toFixed(2)+"%");
					if (vm.bDontShowProposals==0)
					{
						vm.bDontShowProposals=1;
						vm.getfeatured();
					}
				}
			}
		}).catch(function(err)
		{
			console.log(err)
		})
    },
    getinfo: function (event)
	{
		axios.post(window.hostname+'getinfo',{token:window.token,rpcport:window.rpcport},window.config).then(function(res)
		{
			//console.log("Status:" + res.status)
			//console.log("Return:" + res.data)
			//document.getElementById("debug").innerHTML=Date()+"\r\n"+JSON.stringify(res.data);
			for (var key in res.data)
			{
				var val=res.data[key];
				//console.log("[getinfo] "+key+"="+val);
				if(key=="balance")
				{
					$("#balance").html(numberWithCommas(val));
					$("#balance_updated").html(moment().format('D MMM, YYYY HH:mm:ss'));
				}
				if(key=="connections") $("#connections").html(val);
				if(key=="version") $("#version").html("<i class='ion-code'></i>&nbsp;Version "+val);
				if(key=="blocks") $("#blocks").html("<i class='ion-cube'></i>&nbsp;Block " + val);
				if(key=="testnet" && val==true) $("#net").html("<i class='ion-earth'></i>&nbsp;testnet");
				if(key=="testnet" && val==false) $("#net").html("<i class='ion-earth'></i>&nbsp;mainnet");
			}
		}).catch(function(err)
		{
			console.log(err)
		})
    },
	getstakinginfo: function (event)
	{
		axios.post(window.hostname+'getstakinginfo',{token:window.token,rpcport:window.rpcport},window.config).then(function(res)
		{
			//console.log("Status:" + res.status)
			//console.log("Return:" + res.data)
			//document.getElementById("debug").innerHTML=Date()+"\r\n"+JSON.stringify(res.data);
			for (var key in res.data)
			{
				var val=res.data[key];
				//console.log("[getstakinginfo] "+key+"="+val);
				if(key=="staking" && val==true) $("#staking_enabled").html("<i class='ion-flash'></i>&nbsp;Staking Active");
				if(key=="staking" && val==false) $("#staking_enabled").html("<i class='ion-flash'></i>&nbsp;Staking Inactive");
			}
		}).catch(function(err)
		{
			console.log(err)
		})
    },
	getstakereport: function (event)
	{
		axios.post(window.hostname+'getstakereport',{token:window.token,rpcport:window.rpcport},window.config).then(function(res)
		{
			for (var key in res.data)
			{
				var val=res.data[key];
				//console.log("[getstakereport] "+key+"="+val);
				if(key=="Last 7 Days") $("#staking_last_7_days").html(numberWithCommas(val));
			}
		}).catch(function(err)
		{
			console.log(err)
		})
    },
	listtransactions: function (event)
	{
		axios.post(window.hostname+'listtransactions',{token:window.token,rpcport:window.rpcport},window.config).then(function(res)
		{
			if(!res.data["error"])
			{
				var count = Object.keys(res.data).length;
				$("#transaction_count").html(count);
			}

		}).catch(function(err)
		{
			//console.log(err)
		})
    }
  },
  }
</script>