<template>
<div class="content">
  <div class="container-fluid">
      <h4 class="card-title"><i class="ion-fork-repo"></i> Soft Forks</h4>
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
    })
  },
  created: function() {
	this.getInfo();
    this.timer=setInterval(this.resync, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions({
      getInfo: "getInfo",
      getBlockchainInfo: "getBlockchainInfo",
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
    },
  }
};
</script>