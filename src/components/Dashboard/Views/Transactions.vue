<template>
<div class="content">
  <div class="container-fluid">Transactions (<span id='transaction-count'>{{transactions.length}})</span><br><br>
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
          <th>Category</th>
          <th>Address/TXID</th>
          <th>Amount</th>
          <th>Confirmations</th>
          <th>Date</th>
          <th>Comment</th>
          <th>To</th>
        </tr>
      </thead>
      <tbody v-if="transactions">
        <tr :key=transaction.id v-for="transaction of transactions" v-if="!filter || transaction.category==filter">
          <td>{{transaction.category}}</td>
          <td>{{transaction.address}}<br><code>{{transaction.txid}}</code></td>
          <td>{{transaction.amount}}</td>
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
      return moment.unix(time).format("MM/DD/YYYY HH:MM:SS");
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
