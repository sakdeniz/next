<template>
<div class="content">
	<div class="container-fluid">
		<h4 class="card-title"><i class="ion-fork-repo"></i> Soft Forks</h4>
		<div class="ui message">
		<div class="header">
			What are soft forks?
		</div>
		<ul class="list">
		<li>Soft forks are changes to the protocols that govern the NavCoin blockchain.</li>
		<li>At the end of each 20,160 block cycle the number of blocks that signalled support for a soft fork are counted.</li>
		<li>If the number of signalling blocks is greater than 75% the soft fork is locked in and will be activated at the end of the next block cycle.</li>
		<li>If the block cycle fails to reach the required 75% a new attempt to lock in the soft fork is started in the next block cycle.</li>
		</ul>
		</div>
		<table class="ui celled padded table">
		<thead>
		<tr>
			<th>ID</th>
			<th>Fork name</th>
			<th>Status</th>
			<th>Start time</th>
			<th>Timeout</th>
		</tr>
		</thead>
		<tbody v-if="blockchainInfo">
		<tr v-for="key in getSoftForks(blockchainInfo['bip9_softforks'])">
			<td nowrap>{{blockchainInfo['bip9_softforks'][key]['id']}}</td>
			<td nowrap>{{key}}</td>
			<td nowrap>{{blockchainInfo['bip9_softforks'][key]['status']}}</td>
			<td nowrap>{{getDate(blockchainInfo['bip9_softforks'][key]['startTime'])}}</td>
			<td nowrap>{{getDate(blockchainInfo['bip9_softforks'][key]['timeout'])}}</td>
		</tr>
		</tbody>
		</table>
		<table class="ui celled padded table">
		<thead>
		<tr>
			<th>Fork Name</th>
			<th>State</th>
			<th>Blocks In Cycle</th>
			<th>Blocks Required</th>
			<th>Blocks Signalling</th>
			<th>Blocks Remaining</th>
			<th>Locked In Height</th>
		</tr>
		</thead>
		<tbody v-if="softForks">
		<tr v-for="softFork in softForks" v-bind:class="{ 'green': softFork.state=='ACTIVE' }">
			<td nowrap>{{softFork.name}}</td>
			<td nowrap>{{softFork.state}}</td>
			<td nowrap>{{softFork.blocks_in_cycle}}</td>
			<td nowrap>{{softFork.block_required}}</td>
			<td nowrap>{{softFork.blocks_signalling}} ({{numberWithCommas((softFork.blocks_signalling*100)/softFork.block_required)}}%)</td>
			<td nowrap>{{softFork.blocks_remaining}}</td>
			<td nowrap>{{softFork.locked_in_height}}</td>
		</tr>
		</tbody>
		</table>
	</div>
</div>
</template>
<script>
import StatsCard from "src/components/UIComponents/Cards/StatsCard.vue";
import axios from "axios";
import moment from "moment";
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";

function numberWithCommas(n) {
  var parts = n.toString().split(".");
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parts[1] ? "." + parts[1] : "")
  );
}

export default {
  name: "Overview",
  components: {
    StatsCard
  },
  computed: {
    ...mapState({
      info: "info",
      blockchainInfo: "blockchainInfo",
      softForks: "softForks",
    })
  },
  created: function() {
	this.getInfo();
	this.getCommunitySoftForks();
    this.timer=setInterval(this.resync, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions({
      getInfo: "getInfo",
      getBlockchainInfo: "getBlockchainInfo",
      getCommunitySoftForks: "getCommunitySoftForks",
    }),
	getSoftForks: (obj) => {
      var r = []
      for (var k in obj) {
        if (!obj.hasOwnProperty(k))
          continue
        if (k) {
          console.log(r);
		  r.push(k)
        }
      }
      return r
    },
    numberWithCommas: n => {
      if (!n) {
        return "0.00"
      }
      n = (Math.round(n * 100) / 100).toFixed(2);
      var parts = n.toString().split(".");
      return (
        parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        (parts[1] ? "." + parts[1] : "")
      );
    },
    getTime: () => {
      return moment().format("D MMM, YYYY HH:mm:ss");
    },
    getDate: (v) => {
      return moment.unix(v).format("DD/MM/YYYY HH:mm:ss");
    },
    resync: function() {
      this.getInfo();
      this.getBlockchainInfo();
	  this.getCommunitySoftForks();
    },
  }
};
</script>
<style>
.green
{
color: green;
}
</style>