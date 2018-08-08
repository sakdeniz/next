<template>
<div class="content">
  <div class="container-fluid">
    <h4 class="card-title"><i class="ion-ios-paper-outline"></i> Logs</h4>
		<div class="ui form">
			<div class="field">
				<div id="Logs" class="ui segment log" v-model="Log" v-html="Log"></div>
			</div>
		</div>
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
    data: function() {
    var Log="";
    return {
      Log
    }
  },

  components: {},
  created: function() {
  this.getLogs();
  },
  mounted: function() {
	$('.log').css('height', $(window).height()-250);
  },
  updated: function() {
	var elem = document.getElementById('Logs');
	elem.scrollTop = elem.scrollHeight;
  },
  beforeDestroy: function() {
  },
  methods: {
	getLogs: function()
	{
		let vm=this;
		axios.post(window.hostname + 'getlogs', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
		{
			vm.Log+="<pre>"+res.data+"</pre>";
		});
    }
  }
};
$(window).resize(function(){
    $('.log').css('height', $(window).height()-250);
});
</script>
<style>
.log {
    width: 100%;
    overflow-y: scroll;
}
pre {
	white-space: pre-wrap;
	white-space: -moz-pre-wrap !important;
	white-space: -pre-wrap;
	white-space: -o-pre-wrap;
	word-wrap: break-word;
	}
</style>