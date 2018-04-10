<template>
  <div class="content">
    <div class="container-fluid">Transactions<span id='transaction-count'></span>
	<!--<div class="row"><div class="col-md-12"><textarea class="form-control" style="width:100%;height:200px;" id="debug"></textarea></div></div>!-->
	<div id="transaction-table"></div>
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
	listtransactions: function (event)
	{
		axios.post(window.hostname+'listtransactions',{token:window.token},window.config).then(function(res)
		{
			console.log("Transactions");
			//console.log("Status:" + res.status)
			//console.log("Return:" + res.data)
			$("#debug").html(JSON.stringify(res.data));
			var count = Object.keys(res.data).length;
			$("#transaction-count").html(" (" + count +")");
			var o="";
			var html="";
			o=o+"<tr><th>Address</th><th>Amount</th><th>Confirmations</th><th>Date</th><th>Comment</th><th>To</th></tr>";
			jsonQ.each(res.data, function (key, value)
			{
				//console.log(key + ' : ' + value);
				o=o+"<tr>";
				var comment="";
				var to="";
				jsonQ.each(value, function (k, v)
				{
					if (k=="address")
					{
						o=o+"<td>" + v + "</td>"
					}
					if (k=="amount")
					{
						o=o+"<td>" + v + "</td>";
					}
					if (k=="confirmations")
					{
						o=o+"<td>" + v + "</td>";
					}
					if (k=="timereceived")
					{
						o=o+"<td>" + moment.unix(v).format("MM/DD/YYYY HH:MM:SS") + "</td>";
					}
					if (k=="comment")
					{
						comment=v;
					}
					if (k=="to")
					{
						to=v;
					}
				});
				o=o+"<td>" + comment + "</td><td>" + to + "</td>";
				o=o+"</tr>";
			});
			html="<table>"+o
			html=html+"</table>";
			$("#transaction-table").html(o);

		}).catch(function(err)
		{
			console.log(err)
		})
    }
  },
  }
</script>