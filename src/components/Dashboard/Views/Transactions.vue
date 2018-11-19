<template>
<div class="content">
  <div class="container-fluid">
  <h4 class="card-title"><i class="ion-arrow-swap"></i> Transactions ({{transactions.length}})</h4>
    <sui-dropdown icon="ion-funnel" class="labeled icon teal large" text="Filter" button floating>
      <sui-dropdown-menu>
        <sui-dropdown-item v-on:click="filterBy('')">All</sui-dropdown-item>
        <sui-dropdown-item v-on:click="filterBy('receive')">Receive</sui-dropdown-item>
        <sui-dropdown-item v-on:click="filterBy('send')">Send</sui-dropdown-item>
        <sui-dropdown-item v-on:click="filterBy('generate')">Generate</sui-dropdown-item>
        <sui-dropdown-item v-on:click="filterBy('cfund contribution')">Community Fund Contribution</sui-dropdown-item>
      </sui-dropdown-menu>
    </sui-dropdown>
    <table class="ui celled padded table">
      <thead>
        <tr>
          <th></th>
          <th>Category</th>
          <th>Address/TXID</th>
          <th>Amount</th>
          <th>Fee</th>
          <th>Confirmations</th>
          <th>Date (GMT)</th>
          <th>Comment</th>
          <th>To</th>
        </tr>
      </thead>
      <tbody v-if="transactions">
        <tr v-show="(transaction.category=='send' && transaction.vout=='1') || transaction.category!='send'" :key=transaction.id v-for="transaction of transactions" v-if="!filter || transaction.category==filter">
          <td>
		  <span v-if="transaction.category=='receive'" class='ui label green ion-arrow-down-c'></span>
		  <span v-else-if="transaction.category=='send'" class='ui label red ion-arrow-up-c'></span>
		  <span v-else-if="transaction.category=='cfund contribution'" class='ui label red ion-arrow-up-c'></span>
		  <span v-else class='ui label ion-arrow-swap'></span>
		  </td>
          <td>{{transaction.category}}</td>
          <td>{{transaction.address}}<br><code>{{transaction.txid}}</code></td>
          <td>
			<span v-if="transaction.category=='receive'" class='ui label green'> {{transaction.amount}}</span>
			<span v-else-if="transaction.category=='send'" class='ui label red'> {{transaction.amount}}</span>
			<span v-else-if="transaction.category=='cfund contribution'" class='ui label red'> {{transaction.amount}}</span>
			<span v-else class='ui label'> {{transaction.amount}}</span>
		  </td>
          <td>{{transaction.fee}}</td>
          <td>{{transaction.confirmations}}</td>
          <td>{{formatTime(transaction.timereceived)}}</td>
          <td>{{transaction.comment}}</td>
          <td>{{transaction.commentto}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>
<script>
import {
  mapState,
  mapActions
} from 'vuex';
import moment from "moment";
export default {
  computed: {
    ...mapState({
      transactions: 'transactions'
    })
  },
  components: {},
  created: function() {
    this.getTransactions();
    //this.getTransactionInterval = setInterval(this.getTransactions, 5000);
  },
  beforeDestroy: function() {
    //clearInterval(this.getTransactionInterval);
  },
  methods: {
    formatTime: function(time) {
      return moment.unix(time).utc().format("MM/DD/YYYY hh:mm:ss");
    },
    filterBy: function(f) {
      this.filter = f;
      this.getTransactions();
    },
    ...mapActions({
      getTransactions: 'getTransactions',
    })
  }
};
</script>
