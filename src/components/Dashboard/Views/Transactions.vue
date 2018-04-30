<template>
  <div class="content">
    <div class="container-fluid">Transactions<span id='transaction-count'></span>
	<!--<div class="row"><div class="col-md-12"><div id="debug"></div></div></div>!-->
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
		axios.post(window.hostname+'listtransactions',{token:window.token,rpcport:window.rpcport},window.config).then(function(res)
		{
			console.log("Transactions");
			//console.log("Status:" + res.status)
			//console.log("Return:" + res.data)
			//$("#debug").html("<pre>"+JSON.stringify(res.data,null,'\t')+"</pre>");
			var count = Object.keys(res.data).length;
			$("#transaction-count").html(" (" + count +")");
			var o="";
			var html="";
			o=o+"<tr><th>Category</th><th>Address</th><th>Amount</th><th>Confirmations</th><th>Date</th><th>Comment</th><th>To</th></tr>";
			jsonQ.each(res.data, function (key, value)
			{
				//console.log(key + ' : ' + value);
				o=o+"<tr>";
				var category="";
				var address="";
				var amount="";
				var confirmations="";
				var timereceived="";
				var comment="";
				var to="";
				jsonQ.each(value, function (k, v)
				{
					if (k=="category")
					{
						category=v;
					}					
					if (k=="address")
					{
						address=v;
					}
					if (k=="amount")
					{
						amount=v;
					}
					if (k=="confirmations")
					{
						confirmations=v;
					}
					if (k=="timereceived")
					{
						timereceived=moment.unix(v).format("MM/DD/YYYY HH:MM:SS");
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
				o=o+"<td>" + category + "</td><td>" + address + "</td><td>" + amount + "</td><td>" + confirmations + "</td><td>" + timereceived + "</td><td>" + comment + "</td><td>" + to + "</td>";
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