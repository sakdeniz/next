<template>
  <div class="content">
    <div class="container-fluid">
	<div class="row">
	<div class="col-md-12">
	<div class="card"><div class="card-header"><h4 class="card-title">Send</h4></div><div class="card-body">
	<!--<div class="col-md-12"><textarea class="form-control" style="width:100%;height:200px;" id="debug"></textarea></div>!-->
	<br>Send to this address : <input type="text" class="form-control" style="width:100%;" id="to" name="to"></input>
	<br>Amount (NAV) : <input type="text" class="form-control" style="width:100%;" id="amount" name="amount"></input>
	<br>Comment : <input type="text" class="form-control" style="width:100%;" id="comment" name="comment"></input>
	<br>Comment To: <input type="text" class="form-control" style="width:100%;" id="commentto" name="commentto"></input>
	<br><button class='btn btn-fill btn-info' v-on:click='send'><i class="ion-paper-airplane"></i>&nbsp;Send</button>
	</div>
	<div id="address-table"></div>
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
	send: function (event)
	{
		//alert($("#to").val());
		//alert($("#amount").val());
		var config = {headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
		axios.post(window.hostname+'validateaddress',{address:$("#to").val()},config).then(function(res)
		{
			console.log("Send");
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
				if (isNaN($("#amount").val()))
				{
					swal("Error", "Please enter amount", "error");
				}
				else if ($("#amount").val()>1)
				{
					swal("Error", "Please enter a value less or equal than 1", "error");
				}
				else
				{
					axios.post(window.hostname+'sendtoaddress',{to:$("#to").val(),amount:$("#amount").val(),comment:$("#comment").val(),commentto:$("#commentto").val()},config).then(function(res)
					{
						console.log("Status:" + res.status)
						console.log("Return:" + res.data)
						$("#to").val("");
						$("#amount").val("");
						$("#comment").val("");
						$("#commentto").val("");
						swal("Success!", "Sending successful.\r\n\r\nTransaction ID : " + res.data, "success");
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