<template>
<div class="content">
  <div class="container-fluid">
  	<div class="card fluid">
  		<div id="wrapper">
			<div id="left">
				<img style="width:150px;height:auto;margin:10px;" src="static/img/navcoin-consensus-banner.png"/>
			</div>
			<div id="right">
				<h3 class="card-title" style="margin-top:10px;margin-bottom:20px;">How it works?</h3>
				<p>
					Change Consensus Parameters
				</p>
				<p>
					NavCoin consensus parameters can be changed without the need for any developer, with the support of the majority of community members.
				</p>
			</div>
		</div>
	</div>
    <div class="row" style="margin-top:30px;">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            	<h4 class="card-title">Propose Consensus Change</h4>
           </div>
          	<div class="card-body">
          		<div style="height:300px;overflow-y: scroll">
	          		<table class="table table-bordered">
	          			<thead>
	          				<tr>
	          					<th style="width:100%">
	          						Parameter Name
	          					</th>
	          					<th nowrap>
	          						Current Value
	          					</th>
	          				</tr>
	          			</thead>
	          			<tbody>
	          				<tr v-for="(parameter,index) in parameters">
	          					<td nowrap style="width:100%">
	      							<sui-checkbox :label="parameter.desc" :value="'o_'+parameter.id" radio v-model="id"/>
	          					</td>
	          					<td nowrap>
	          						{{parameter.value}}
	          					</td>
	          				</tr>
	          			</tbody>
	          		</table>
          		</div>
				<sui-form style="margin-top:30px;">
					<input type="number" class="form-control" style="width:100%;" v-model="value" placeholder="Specify a value for selected consensus parameter" />
				</sui-form>
          		<div style="margin-top:20px;">
          			<a class="ui violet plus button large" v-on:click="proposeconsensuschange()"><i class="fa fa-paper-plane-o" aria-hidden="true"></i>&nbsp;Submit Consultation</a>
          		</div>
			</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";

export default {
  data: function() {
    var id;
    var value="";
    var parameters=[];
    return {
		id,value,parameters
	}
  },
  created: function()
  {
  	this.getconsensusparameters();
  },
  methods:
  {
  	getconsensusparameters: function()
    {
    	let vm=this;
  		axios.post(window.hostname + 'getconsensusparameters',
  		{
    		rpcuser: window.rpcuser,
			token: window.token,
    		rpcport: window.rpcport
  		}, window.config).then(function(res)
  		{
  			vm.parameters=res.data;
  		})
  		.catch(function(err)
		{
              //swal(err);
        })
	},
	proposeconsensuschange: function()
	{
		if (!this.id)
		{
			swal({title:"Warning",html:"Please choose a consensus variable",type:"info"});
			return;
		}
		if (!this.value)
		{
			swal({title:"Warning",html:"Please specify a value for selected consensus variable",type:"info"});
			return;
		}
		var e=this.id.split("_");
		var consensusID=e[1];
		var newConsensusValue=this.value;
		axios.post(window.hostname + 'proposeconsensuschange', {
		rpcuser: window.rpcuser,
		token: window.token,
		rpcport: window.rpcport,
		id: consensusID,
		value: newConsensusValue
		}, window.config).then(function(res)
		{
			var hash = "";
			var strDZeel = "";
			console.log("Status:" + res.status)
			console.log("Return:" + JSON.stringify(res.data))
			jsonQ.each(res.data, function(key, value)
			{
				console.log(key +":"+value);
				if (key == "hash") hash = value;
				if (key == "strDZeel") strDZeel = value;
			});
			if (!res.data["error"])
			{
				swal("Success!", "Your consensus change consultation successfully created.", "success");
				//swal("Success!", "Your consultation successfully created..\r\n\r\nHash:" + hash + "\r\n\r\nstrDZeel:" + strDZeel, "success");
			}
			else
			{
				swal("Oops...", res.data["error"]["message"], "error");
			}
		}).catch(function(err)
		{
              console.log(err);
        })
	},
  },
}
</script>
<style>
label
{
	text-transform: none !important;
}
#wrapper {
  display: flex;
}

#wrapper p{
	font-size:10pt;
}

#left {
  flex: 0 0 10%;
}

#right {
	margin-left:30px;
  flex: 1;
}
td .header
{
	font-size:8pt !important;
}
</style>