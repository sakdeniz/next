<style>
.card .ct-chart {
  margin: 30px 0 30px;
  height: 100px !important;
}
</style>
<template>
<div class="content">
  <div class="container-fluid">
    <h4 class="card-title"><i class="ion-leaf"></i> Staking</h4>
    <div class="ui segment">
      <a class="ui purple ribbon label">Overview</a>
      <p></p>
      <div><i class="ion-flash icon"></i>{{stakingInfo.staking ? "Staking Active" : "Staking Inactive"}}</div>
      <div><i class="ion-egg icon"></i>Total Stake : {{numberWithCommas(stakeReport['Stake counted'])}}</div>
      <div><i class="ion-plus-round icon"></i>Latest Stake : {{numberWithCommas(stakeReport['Latest Stake'])}}</div>
      <div><i class="ion-clock icon"></i>Latest Stake Received : {{stakeReport['Latest Time']}}</div>
      <p></p>
    </div>
  </div><br>
  <chart-card :chart-data="getBar(stakeReport).barChart.data" :chart-options="getBar(stakeReport).barChart.options" :chart-responsive-options="getBar(stakeReport).barChart.responsiveOptions" chart-type="Bar">
    <template slot="header">
              <h4 class="card-title">Last 30 Days Graph</h4>
            </template>
    <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Earned Amount
              </div>
            </template>
  </chart-card>
  <table class="ui celled padded table">
    <thead>
      <tr>
        <th nowrap>Date Range</th>
        <th nowrap style='width:100%'>Earned Amount (NAV)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td nowrap>Last 24 Hour</td>
        <td>{{numberWithCommas(stakeReport['Last 24H'])}}</td>
      </tr>
      <tr>
        <td nowrap>Last 7 Days</td>
        <td>{{numberWithCommas(stakeReport['Last 7 Days'])}}</td>
      </tr>
      <tr>
        <td nowrap>Last 30 Days</td>
        <td>{{numberWithCommas(stakeReport['Last 30 Days'])}}</td>
      </tr>
      <tr>
        <td nowrap>Last 365 Days</td>
        <td>{{numberWithCommas(stakeReport['Last 365 Days'])}}</td>
      </tr>
    </tbody>
  </table>
  <h4>Last 30 Days</h4>
  <table class="ui celled padded table">
    <thead>
      <tr>
        <th nowrap>Date</th>
        <th nowrap style='width:100%'>Earned Amount (NAV)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="key in getDailyStake(stakeReport)">
        <td nowrap>{{key}}</td>
        <td>{{numberWithCommas(stakeReport[key])}}</td>
      </tr>
    </tbody>
  </table>
</div>
</div>
</template>
<script>
import ChartCard from '../../UIComponents/Cards/ChartCard.vue'
import StatsCard from "../../UIComponents/Cards/StatsCard.vue";
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
    ChartCard,
    StatsCard
  },
  computed: {
    ...mapState({
      stakingInfo: "stakingInfo",
      stakeReport: "stakeReport",
    })
  },
  created: function() {
    this.resync();
    this.timer = setInterval(this.resync, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions({
      getStakingInfo: "getStakingInfo",
      getStakeReport: "getStakeReport",
    }),
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
    getDailyStake: (obj) => {
      var r = []
      for (var k in obj) {
        if (!obj.hasOwnProperty(k))
          continue
        if (k.length > 18) {
          r.push(k)
        }
      }
      return r
    },
    getBar: (obj) => {
      var r = [];
      var labels = [];
      var series = [];
      for (var k in obj) {
        if (!obj.hasOwnProperty(k))
          continue
        if (k.length > 18) {
          var str = k;
          labels.push(str.substring(10, 8));
          series.push(numberWithCommas(obj[k]));
        }
      }
      return {
        barChart: {
          data: {
            labels: labels,
            series: [
              series,
            ]
          },
          options: {
            seriesBarDistance: 10,
            axisX: {
              showGrid: false
            },
            height: '150px'
          },
          responsiveOptions: [
            ['screen and (max-width: 640px;)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc(value) {
                  return value[0]
                }
              }
            }]
          ]
        },
      }
    },
    getTime: () => {
      return moment().format("D MMM, YYYY HH:mm:ss");
    },
    getDate: (v) => {
      return moment.unix(v).format("MM/DD/YYYY");
    },
    resync: function() {
      this.getStakingInfo();
      this.getStakeReport();
    },
  }
};
</script>
