<template>
<div class="content">
  <div class="container-fluid">
  <h4 class="card-title"><i class="ion-radio-waves"></i> Peer List</h4>
  <span id='peerlist-count'>{{peers.length}} Active Peer(s)</span><br><br>
    <table class="ui celled padded table">
      <thead>
        <tr>
          <th>Address</th>
          <th>Local Address</th>
          <th>Version</th>
          <th>Sub version</th>
          <th>Ping</th>
          <th>Connection Time</th>
          <th>Bytes Received</th>
          <th>Bytes Sent</th>
        </tr>
      </thead>
      <tbody v-if="peers">
        <tr v-for="peer of peers">
          <td>{{peer.addr}}</td>
		  <td>{{peer.addrlocal}}</td>
		  <td>{{peer.version}}</td>
		  <td>{{peer.subver}}</td>
		  <td>{{parseFloat(peer.pingtime).toFixed(2)}}</td>
		  <td>{{getDate(peer.conntime)}}</td>
		  <td>{{peer.bytesrecv}}</td>
		  <td>{{peer.bytessent}}</td>
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
      peers: 'peers'
    })
  },
  components: {},
  created: function() {
    this.getPeerInfo();
	this.getPeerInfoInterval = setInterval(this.getPeerInfo, 5000);
  },
  beforeDestroy: function() {
	clearInterval(this.getPeerInfoInterval);
  },
  methods: {
    ...mapActions({
      getPeerInfo: 'getPeerInfo',
    })
	,
	getDate: (v) => {
      return moment.unix(v).format("MM/DD/YYYY HH:mm:ss");
    },
  }
};
</script>
