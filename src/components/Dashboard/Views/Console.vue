<template>
<div class="content">
  <div class="container-fluid">
	<h4 class="card-title"><i class="ion-code"></i> Console</h4>
    <div v-if="!isDemo">
		<div class="ui form">
			<div class="field">
				<div id="Console" class="ui segment log" v-model="sConsole" v-html="sConsole"></div>
				<input id="Command" type="text" v-model="sCommand" placeholder="Command" v-on:keyup.enter="executeCommand"></input><br/><br/>
				<button class="ui icon tiny button green" v-on:click="executeCommand">Go</button>
				<button class="ui icon tiny button gray" v-on:click="clearConsole">Clear</button>
			</div>
		</div>
	</div>
	<div v-else>Console disabled on demo.</div>
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
    var sCommand;
	var sConsole="<p>Welcome to the RPC console.<br/>Type help for an overview of available commands.<br/><br/></p>";
	var isDemo=window.isDemo;
    return {
      isDemo,sCommand,sConsole
    }
  },

  components: {},
  created: function() {
  },
  mounted: function() {
	$('.log').css('height', $(window).height()-350);
	$('#Command').focus();
  },
  updated: function() {
	var elem = document.getElementById('Console');
	elem.scrollTop = elem.scrollHeight;
	$('pre').each(function(i, block) {
  hljs.highlightBlock(block);
});
  },
  beforeDestroy: function() {
  },
  methods: {
	clearConsole: function()
	{
		let vm=this;
		vm.sConsole="";
	},
	   jsonPretty: function(value) {
      let json = JSON.stringify(JSON.parse(value), null, 2)
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, function(match) {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
    },
	executeCommand: function()
	{
		let vm=this;
		var command=vm.sCommand;
		vm.sCommand="";
		axios.post(window.hostname + 'command', {token: window.token,rpcport: window.rpcport,command: command}, window.config).then(function(res)
		{
			if (!res.data["error"])
			{
				console.log(res.data);
				vm.sConsole+="<i class='ion-arrow-up-c'></i>&nbsp;<code>" + moment().format("HH:mm:ss") + " " + command+"</code><br><pre>";
				if (res.data=="[object Object]") vm.sConsole+=vm.jsonPretty(JSON.stringify(res.data)); else vm.sConsole+=res.data;
				vm.sConsole+="<br><br></pre>";
			}
			else
			{
				swal({type: 'warning',title: 'Oops...',text: res.data["error"]["message"]});
			}
		});
    }
  }
};
$(window).resize(function(){
    $('.log').css('height', $(window).height()-350);
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