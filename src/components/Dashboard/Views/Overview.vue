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
      
<h4 class="card-title">Community Fund <small> Proposals</small></h4>
	  <div class="row">
	  <div class="col-md-12">
	  <div class="card">
	  <div class="card-body">
	  <div class="row">
	  <div class="col-md-4"><h4>Title 1</h4><h5>Category 1</h5><h6>Amount 1</h6><img class="responsive" src="static/img/placeholder.jpg"></img><br><br><button type="button" class="btn btn-success btn-fill"><span class="btn-label"><i class="fa fa-thumbs-up"></i>&nbsp;43</span></button>&nbsp;<button type="button" class="btn btn-danger btn-fill"><span class="btn-label"><i class="fa fa-thumbs-down"></i>&nbsp;34</span></button></div> 
	  <div class="col-md-4"><h4>Title 2</h4><h5>Category 2</h5><h6>Amount 2</h6><img class="responsive" src="static/img/placeholder.jpg"></img><br><br><button type="button" class="btn btn-success btn-fill"><span class="btn-label"><i class="fa fa-thumbs-up"></i>&nbsp;35</span></button>&nbsp;<button type="button" class="btn btn-danger btn-fill"><span class="btn-label"><i class="fa fa-thumbs-down"></i>&nbsp;29</span></button></div> 
	  <div class="col-md-4"><h4>Title 3</h4><h5>Category 3</h5><h6>Amount 3</h6><img class="responsive" src="static/img/placeholder.jpg"></img><br><br><button type="button" class="btn btn-success btn-fill"><span class="btn-label"><i class="fa fa-thumbs-up"></i>&nbsp;55</span></button>&nbsp;<button type="button" class="btn btn-danger btn-fill"><span class="btn-label"><i class="fa fa-thumbs-down"></i>&nbsp;15</span></button></div> 
	  </div>
	  </div>
	  </div>
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
    components: {
      Checkbox,
      Card,
      LTable,
      ChartCard,
      StatsCard
    },
	data: function()
	{
		return {timer: ''}
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
	getblockchaininfo: function (event)
	{
		axios.post(window.hostname+'getblockchaininfo',{data:{d1:'d1'}}).then(function(res)
		{
			errorhandler(res.data);
			for (var key in res.data)
			{
				var val=res.data[key];
				if(key=="headers") $("#headers").html("<i class='ion-asterisk'></i>&nbsp;Height "+val);
				if(key=="verificationprogress") $("#verificationprogress").html("<i class='ion-android-checkmark-circle'></i>&nbsp;Verification "+parseFloat(val*100).toFixed(2)+"%");
			}
		}).catch(function(err)
		{
			console.log(err)
		})
    },
    getinfo: function (event)
	{
		axios.post(window.hostname+'getinfo',{data:{d1:'d1'}}).then(function(res)
		{
			//console.log("Status:" + res.status)
			//console.log("Return:" + res.data)
			//document.getElementById("debug").innerHTML=Date()+"\r\n"+JSON.stringify(res.data);
			for (var key in res.data)
			{
				var val=res.data[key];
				//console.log(key+"="+val);
				if(key=="balance")
				{
					$("#balance").html(numberWithCommas(val));
					$("#balance_updated").html(moment().format('D MMM, YYYY HH:mm:ss'));
				}
				if(key=="connections") $("#connections").html(val);
				if(key=="version") $("#version").html("<i class='ion-code'></i>&nbsp;Version "+val);
				if(key=="blocks") $("#blocks").html("<i class='ion-cube'></i>&nbsp;Block " + val);
				if(key=="testnet" && val==true) $("#net").html("<i class='ion-earth'></i>&nbsp;testnet");
			}
		}).catch(function(err)
		{
			console.log(err)
		})
    },
	getstakinginfo: function (event)
	{
		axios.post(window.hostname+'getstakinginfo',{data:{d1:'d1'}}).then(function(res)
		{
			//console.log("Status:" + res.status)
			//console.log("Return:" + res.data)
			//document.getElementById("debug").innerHTML=Date()+"\r\n"+JSON.stringify(res.data);
			for (var key in res.data)
			{
				var val=res.data[key];
				console.log(key+"="+val);
				if(key=="staking" && val==true) $("#staking_enabled").html("<i class='ion-flash'></i>&nbsp;Staking Active");
				if(key=="staking" && val==false) $("#staking_enabled").html("<i class='ion-flash'></i>&nbsp;Staking Passive");
			}
		}).catch(function(err)
		{
			console.log(err)
		})
    },
	getstakereport: function (event)
	{
		axios.post(window.hostname+'getstakereport',{data:{d1:'d1'}}).then(function(res)
		{
			for (var key in res.data)
			{
				var val=res.data[key];
				//console.log(key+"="+val);
				if(key=="Last 7 Days") $("#staking_last_7_days").html(numberWithCommas(val));
			}
		}).catch(function(err)
		{
			console.log(err)
		})
    },
	listtransactions: function (event)
	{
		axios.post(window.hostname+'listtransactions',{data:{d1:'d1'}}).then(function(res)
		{
			var count = Object.keys(res.data).length
			$("#transaction_count").html(count);

		}).catch(function(err)
		{
			console.log(err)
		})
    }
  },
  }
</script>