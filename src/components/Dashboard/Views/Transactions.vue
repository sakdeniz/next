<template>
  <div class="content">
    <div class="container-fluid">Transactions<span id='transaction-count'></span>
		<table class="ui celled padded table">
			<thead>
				<tr><th>Category</th><th>Address</th><th>Amount</th><th>Confirmations</th><th>Date</th><th>Comment</th><th>To</th></tr>
			</thead>
			<tbody v-if="transactions">
				<tr :key=transaction.id v-for="transaction of transactions">
					<td>{{transaction.category}}</td><td>{{transaction.address}}</td><td>{{transaction.amount}}</td><td>{{transaction.confirmations}}</td><td>{{formatTime(transaction.timereceived)}}</td><td>{{transaction.comment}}</td><td>{{transaction.commentto}}</td>
				</tr>
			</tbody>
		</table>
	</div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
	data: function() {
		return { transactions: [] }
	},
  components: {},
  created: function() {
		axios.post(window.hostname + "listtransactions", { token: window.token, rpcport: window.rpcport }, window.config)
    .then((response) => { this.transactions = response.data })
    .catch((err) => { console.log(err) })
  },
  methods: {
		formatTime: function(time) {
			return moment.unix(time).format("MM/DD/YYYY HH:MM:SS")
		},
  }
};
</script>
