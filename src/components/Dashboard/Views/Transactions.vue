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
    
    <div class="ui modal large">
  		<i class="close icon"></i>
  		<div class="header">
    		Scan View Key
  		</div>
  		<div class="content">
  			<div class="ui input" style="width:100%">
		  		<input type="text" class="form-control" v-model="viewkey" placeholder="View Key"/>
			</div>
  			<div class="ui input" style="width:100%">
		  		<input type="date" class="form-control" v-model="date" placeholder="Date"/>
			</div>
			<br/>
  		</div>
		<div class="scrolling content">
			<table class="ui celled padded table">
				<thead>
					<th>
						Date
					</th>
					<th>
						Hash
					</th>
					<th>
						Amount
					</th>
					<th>
						Message
					</th>
					<th>
						Spent
					</th>
				</thead>
				<tbody>
					<tr v-for="tx in txs.outputs">
						<td>
							{{formatTime(tx.time)}}
						</td>
						<td>
							{{tx.hash}}
						</td>
						<td>
							{{formatNumbers(tx.amount/100000000)}}
						</td>
						<td>
							{{tx.message}}
						</td>
						<td>
							{{tx.spent}}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
  		<div class="actions">
    		<div class="ui button" v-on:click="scanviewkey()">Scan</div>
    		<div class="ui button" v-on:click="hide_modal()">Close</div>
  		</div>
	</div>

    <div class="ui button" v-on:click="show_modal()"><i class="ion-flash"></i>&nbsp;Scan View Key</div>
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
  data () {
      return {
          viewkey:"",//PVpQYHiLKrwPkcGuY6MRLJLip5ummdJBLedsSXbpJBFTzCRYDuut 
          date:"",
          txs:{}
      }
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
      return moment.unix(time).utc().format("DD/MM/YYYY hh:mm:ss");
    },
    show_modal: function()
    {
		$('.modal').modal({centered: false}).modal('show');
    },
    hide_modal: function()
    {
		$('.modal').modal('hide');
    },
	formatNumbers: function(n) {
	      if (n==undefined) return;
	      var parts = n.toString().split(".");
	      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    },
    scanviewkey: function()
    {
    	let vm=this;
    	if (!vm.viewkey)
    	{
    		swal({
                type: 'warning',
                title: 'Oops...',
                text: "Please specify a valid view key"
              });
    	}
    	else if (!vm.date)
    	{
    		swal({
                type: 'warning',
                title: 'Oops...',
                text: "Please select start date for scanning"
              });
    	}
    	else
    	{
    	vm.txs={};
        axios.post(window.hostname + 'scanviewkey', {
            rpcuser: window.rpcuser,
			token: window.token,
            rpcport: window.rpcport,
            viewkey: vm.viewkey,
            timestamp: moment(vm.date, "YYYY/M/D").unix()
          }, window.config).then(function(res) {
            console.log("Status:" + res.status)
            console.log("Return:" + res.data)
            if (!res.data["error"])
			{
            	vm.txs=res.data;
            }
            else
            {
              swal({
                type: 'warning',
                title: 'Oops...',
                text: res.data["error"]["message"]
              });
            }
          }).catch(function(err) {
            console.log(err);
          })
        }
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
