<template>
  <div class="content">
	<div class="row"><div class="col-md-12"><button class="btn btn-success btn-fill" v-on:click="getnewaddress"><i class="ion-asterisk"></i>&nbsp;Get New Address</button></div></div>
	<br>
	<div class="row">
	<div class="container-fluid">Accounts<span id='address-count'></span>
	<!--<div class="row"><div class="col-md-12"><textarea class="form-control" style="width:100%;height:200px;" id="debug"></textarea></div></div>!-->
	<div id="address-table"></div>
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
		this.listtransactions();
	},
    methods: {
	getnewaddress: function (event)
	{
		axios.post(window.hostname+'getnewaddress',{token:window.token},window.config).then(function(res)
		{
			//console.log("Status:" + res.status)
			//console.log("Return:" + res.data)
			swal("Success!", "Address generated\r\n\r\n"+res.data, "success");
		}).catch(function(err)
		{
			console.log(err);
		})
    },
	listtransactions: function (event)
	{
		axios.post(window.hostname+'listaddressgroupings',{token:window.token},window.config).then(function(res)
		{
			console.log("Accounts");
			var account="";
			var i=0;
			//console.log("Status:" + res.status)
			//console.log("Return:" + res.data)
			//$("#debug").html(JSON.stringify(res.data));
			var count = Object.keys(res.data).length;
			var o="";
			var html="";
			o=o+"<tr><th>Address</th><th>Balance</th><th>Account</th></tr>";
			jsonQ.each(res.data, function (key, value)
			{
				jQuery.each(value, function(index, item)
				{
					if (item[2]!=undefined) account=item[2]; else account="";
					o=o+"<tr><td>" + item[0] + "</td><td>" + item[1] + "</td><td>" + account + "</td></tr>";
					i++;
				});
				$("#address-count").html(" (" + i +")");
			});
			html="<table>"+o;
			html=html+"</table>";
			$("#address-table").html(o);

		}).catch(function(err)
		{
			console.log(err)
		})
    }
  },
  }
</script>