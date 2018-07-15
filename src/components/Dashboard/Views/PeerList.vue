<template>
<div class="content">
  <div class="container-fluid">
  <h4 class="card-title"><i class="ion-radio-waves"></i> Peer List</h4>
  <span id='peerlist-count'>{{peers.length}} Active Peer(s)</span><br><br>
    <table class="ui celled padded table">
      <thead>
        <tr>
          <th>Peer Address</th>
          <th>Local Address</th>
          <th>Protocol</th>
          <th>Version</th>
          <th>Ping (ms)</th>
          <th>Connected Since</th>
          <th>Received</th>
          <th>Sent</th>
        </tr>
      </thead>
      <tbody v-if="peers">
        <tr v-for="peer of peers">
          <td>{{peer.addr}}</td>
		  <td>{{peer.addrlocal}}</td>
		  <td>{{peer.version}}</td>
		  <td>{{formatVersion(peer.subver)}}</td>
		  <td>{{getMS(peer.pingtime)}}</td>
		  <td>{{getDate(peer.conntime)}}</td>
		  <td>{{formatBytes(peer.bytesrecv,0)}}</td>
		  <td>{{formatBytes(peer.bytessent,0)}}</td>
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
	this.getPeerInfoInterval = setInterval(this.getPeerInfo, 1000);
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
	getMS: (v) => {
      return parseInt(moment.unix(v).format("sSSS",{ trim: false }));
    },
	formatVersion: (v) => {
	  v=v.replace(new RegExp("/", 'g'), "");
	  return v.split(":")[1];
    },
	formatBytes: (bytes,decimals)  => {
		if(bytes == 0) return '0 Bytes';
		var k = 1024,
       dm = decimals || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}
  }
};
</script>
