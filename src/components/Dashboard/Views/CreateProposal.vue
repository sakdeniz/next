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
	<br>
	<div class="row">
	<div class="col-md-12">
	<div class="card"><div class="card-header"><h4 class="card-title">Create Proposal</h4></div><div class="card-body">
	<!--<div class="col-md-12"><textarea class="form-control" style="width:100%;height:200px;" id="proposal_title"></textarea></div>!-->
	<br>Proposal Title : <input type="text" class="form-control" style="width:100%;" id="desc" name="desc"></input>
	<br>Your Wallet Address : <input type="text" class="form-control" style="width:100%;" id="navcoinaddress" name="navcoinaddress"></input>
	<br>Amount in NAV :<input type="text" class="form-control" style="width:100%;" id="amount" name="amount"></input>
	<br>Deadline : <input type="date" class="form-control" style="width:100%;" id="deadline" name="deadline"></input>
	<br><button class='btn btn-fill btn-info' v-on:click='createproposal'><i class="ion-paper-airplane"></i>&nbsp;Create</button>
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

  export default {
    components: {
      Checkbox,
      Card,
      LTable,
      ChartCard,
      StatsCard
    },
	created: function ()
	{
	},
    methods: {
	createproposal: function (event)
	{
		//mjtf3avTGA9uHvcGnkWT2KbffprvZstbwt
		//alert($("#to").val());
		//alert($("#amount").val());
		if ($("#desc").val()=="")
		{
			swal("Error", "Please enter a proposal description", "error");
			return;
		}
		if ($("#navcoinaddress").val()=="")
		{
			swal("Error", "Please enter a valid NAV address", "error");
			return;
		}
		if ($("#deadline").val()=="")
		{
			swal("Error", "Please enter a dead line date", "error");
			return;
		}
		var config = {headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
		axios.post(window.hostname+'validateaddress',{address:$("#navcoinaddress").val()},config).then(function(res)
		{
			var isAdressValid=false;
			/*console.log("Status:" + res.status)
			console.log("Return:" + res.data)*/
			jsonQ.each(res.data, function (key, value)
			{
				console.log(key+"="+value);
				if (key=="isvalid" && value==true)
				{
					isAdressValid=true;
				}
			});
			if (isAdressValid)
			{
				if ($("#amount").val()=="")
				{
					swal("Error", "Please enter amount", "error");
				}
				else
				{
					var epoch=moment($("#deadline").val()).unix();
					axios.post(window.hostname+'createproposal',{desc:$("#desc").val(),navcoinaddress:$("#navcoinaddress").val(),amount:$("#amount").val(),deadline:epoch},config).then(function(res)
					{
						var hash="";
						var strDZeel="";
						console.log("Status:" + res.status)
						console.log("Return:" + res.data)
						$("#desc").val("");
						$("#navcoinaddress").val("");
						$("#amount").val("");
						$("#deadline").val("");
						jsonQ.each(res.data, function (key, value)
						{
							
							jsonQ["hash"];
							if (key=="hash") hash=value;
							if (key=="strDZeel") strDZeel=value;
						});
						swal("Success!", "Proposal created.\r\n\r\nHash:" + hash + "\r\n\r\n" + strDZeel, "success");
					}).catch(function(err)
					{
						console.log(err);
					})
				}
			}
			else
			{
				console.log("Address invalid...");
				swal("Invalid address", "Address not valid, check the address...", "error");
			}
		}).catch(function(err)
		{
			console.log(err)
		})
    }
  },
  }
</script>