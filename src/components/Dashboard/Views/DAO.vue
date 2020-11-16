<template>
<div class="content">
	<div class="container-fluid">
		<div id="wrapper">
			<div id="left">
				<img style="width:260px;height:auto" src="static/img/navcoin-dao-banner.png"/>
			</div>
			<div id="right">
				<h3 class="card-title">NavCoin DAO</h3>
				<p>
					A decentralized autonomous organization (DAO) is an organization represented by rules encoded as a computer program that is transparent, controlled by shareholders and not influenced by a central government.
				</p>
				<p>
					The consultation system is created to gauge the community sentiment on any topics. The most obvious benefit is that when new features are introduced to NavCoin, the community used to have to vote on soft forks to activate said features. With the consultation system, developers can easily communicate with the community to see if new features will be accepted even before they are worked on.
				    Besides that, there are many other use cases for consultations. Stakers can create polls of which privacy protocol to implement or predictions of how much bitcoin will worth in 10 years. One can say consultations are providing directions that the community decides as a whole and follow as a whole.
				</p>
			</div>
		</div>
		<div style="margin-top:30px;">
		</div>
		<sui-dropdown icon="ion-funnel" class="labeled icon teal" text="Filter" button floating>
          <sui-dropdown-menu>
            <sui-dropdown-item v-on:click="listconsultations()">All</sui-dropdown-item>
            <sui-dropdown-item v-on:click="listconsultations('not_enough_answers')">Not enough answers</sui-dropdown-item>
            <sui-dropdown-item v-on:click="listconsultations('waiting_for_support')">Waiting for support</sui-dropdown-item>
            <sui-dropdown-item v-on:click="listconsultations('reflection')">Reflection</sui-dropdown-item>
            <sui-dropdown-item v-on:click="listconsultations('voting')">Voting</sui-dropdown-item>
			<sui-dropdown-item v-on:click="listconsultations('finished')">Finished</sui-dropdown-item>
          </sui-dropdown-menu>
        </sui-dropdown>

        <router-link to="/admin/create-consultation" tag="sui-dropdown-item" class="ui button violet"><i class="ion-plus-round"></i>&nbsp;Create Consultation</router-link>
        <router-link to="/admin/propose-consensus-change" tag="sui-dropdown-item" class="ui button blue"><i class="ion-gear-a"></i>&nbsp;Propose Consensus Change</router-link>
        <!--<a class="ui button red" v-on:click="generate(1)">Generate 1</a>
        <a class="ui button red" v-on:click="generate(10)">Generate 10</a>!-->
        <a class="ui button green" v-on:click="refresh()"><i class="ion-refresh"></i> Refresh</a>
        <div class="ui fluid card blue">
        	<div class="content">
        		<h4>
        			Consultation States
        		</h4>
        		<table>
        			<thead>
	        			<tr>
	        				<!--<th>
	        					ID
	        				</th>!-->
	        				<th>
	        					State
	        				</th>
	        				<th>
	        					Description
	        				</th>
	        			</tr>
        			</thead>
        			<tbody>
        				<tr>
        					<!--<td>
        						0
        					</td>!-->
        					<td>
        						Waiting for Support
        					</td>
        					<td>
        						Support is awaited for voting for the consultation request
        					</td>
        				</tr>
        				<tr>
        					<!--<td>
        						1
        					</td>!-->
        					<td>
        						Voting Started
        					</td>
        					<td>
        						The consultation request has received sufficient support and voting continues
        					</td>
        				</tr>
        				<tr>
        					<!--<td>
        						8
        					</td>!-->
        					<td>
        						Reflection Phase
        					</td>
        					<td>
        						The consultation request is in reflection phase
        					</td>
        				</tr>
        				<tr>
        					<!--<td>
        						9
        					</td>!-->
        					<td>
        						Found Support
        					</td>
        					<td>
        						The consultation request found sufficient support
        					</td>
        				</tr>
        				<tr>
        					<!--<td>
        						3
        					</td>!-->
        					<td>
        						Finished
        					</td>
        					<td>
        						The consultation request completed
        					</td>
        				</tr>
        				<tr>
        					<!--<td>
        						7
        					</td>!-->
        					<td>
        						Passed
        					</td>
        					<td>
        						The consulation request passed
        					</td>
        				</tr>
        			</tbody>
        		</table>
        	</div>
        </div>
        <div class="ui fluid card violet" v-for="(consultation,index) in consultations">
			<div class="content">
				<div class="right floated meta">Cycle {{consultation.votingCyclesFromCreation}}</div>
				<!--({{consultation.version}})!-->
				<div class="header">
					<span v-if="consultation.version==13" class="ion-gear-a"></span>
					<span v-if="consultation.version==3" class="ion-code-working"></span>
					<span v-if="consultation.version==1||consultation.version==5" class="ion-more"></span>
					{{consultation.question}}
				</div>
		  	</div>
		  	<div class="content">
				<div style="margin-bottom:20px">
					<!--<div>
						<pre>
							{{consultation}}
						</pre>
					</div>!-->
					<span v-if="consultation.version==3" class="label ui default">
						Min : {{consultation.min}}
					</span>
					<span v-if="consultation.version==3" class="label ui default">
						Max : {{consultation.max}}
					</span>
					<span v-if="consultation.version==5" class="label ui default">
						Max Selection : {{consultation.max}}
					</span>
					<span v-if="consultation.version==3 && consultation.state==0">
						<a class="ui green header" v-on:click="support(consultation.hash,true)"><i class="thumbs up outline icon" aria-hidden="true"></i></a>
						<a class="ui red header" v-on:click="support(consultation.hash,false)"><i class="thumbs down outline icon" aria-hidden="true"></i></a>
					</span>
				</div>
				
				<div v-for="(itm,index) in consultation.answers" v-if="consultation.version==3">
					<div style="margin-bottom:15px;" v-if="consultation.state==1">
						<a class="ui button success" v-on:click="vote_value(consultation,consultation.min,consultation.max)">Vote</a>
					</div>
					<table class="table table-bordered"  v-if="consultation.answers.length>0">
						<thead>
							<tr>
								<th nowrap>
									Option
								</th>
								<th style="width:100%">
									Votes
								</th>
							</tr>
						</thead>
						<tr v-for="(support, option) in itm" :key="support">
							<td>{{option}}</td>
							<td>{{support}}</td>
						</tr>
					</table>
				</div>

					<table class="table table-bordered" v-if="consultation.version==1||consultation.version==5||consultation.version==13" >
						<thead>
							<tr>
								<th nowrap v-if="consultation.state==0">
									Your Support
								</th>
								<th nowrap v-if="consultation.state==1">
									Your Votes
								</th>
								<th nowrap>
									Option
								</th>
								<th nowrap>
									Support
								</th>
								<th nowrap>
									Votes
								</th>
								<th style="width:100%">
									Status
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(itm,index) in consultation.answers">
								<td nowrap v-if="consultation.state==0">
									<a class="ui green header" v-on:click="support(itm.hash,true)"><i class="thumbs up outline icon" aria-hidden="true"></i></a>
									<a class="ui red header" v-on:click="support(itm.hash,false)"><i class="thumbs down outline icon" aria-hidden="true"></i></a>
								</td>
								<td nowrap v-if="consultation.state==1">
									<a class="ui green header" v-on:click="vote(itm.hash,'yes')"><i class="thumbs up outline icon" aria-hidden="true"></i></a>
									<a class="ui red header" v-on:click="vote(itm.hash,'remove')"><i class="thumbs down outline icon" aria-hidden="true"></i></a>
									<a class="ui gray header" v-on:click="vote(itm.hash,'abs')"><i class="question circle outline icon" aria-hidden="true"></i></a>
								</td>
								<td nowrap>
									{{itm.answer}}
								</td>
								<td nowrap>
									{{itm.support}}
								</td>
								<td nowrap>
									{{itm.votes}}
								</td>
								<td nowrap style="text-transform:capitalize;">
									{{itm.status}}
								</td>
							</tr>
						</tbody>
					</table>
			        <div class="extra content">
			  	   		<span class="left floated" style="text-transform:capitalize;">
			  	   			<i class="flag outline icon"></i>
			  	   			{{consultation.status}}
			  	   		</span>
						<span class="right floated star" v-if="consultation.version==3">
							<i class="star icon"></i>
					  		Support {{consultation.support}}
						</span>
			  		</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import Card from 'src/components/UIComponents/Cards/Card.vue'
import LTable from 'src/components/UIComponents/Table.vue'
import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'
import axios from 'axios';
import moment from 'moment';
import Vue from 'vue';

export default {
  components: {
    Checkbox,
    Card,
    LTable,
  },
  data: function() {
    var consultations = [];
    return {
      consultations,
    }
  },
  created: function() {
	this.listconsultations();
  },
  methods: {
  	support: function(hash,bool_vote_type)
  	{
  		console.log(hash);
    	let vm=this;
  		axios.post(window.hostname + 'support',
  		{
    		rpcuser: window.rpcuser,
			token: window.token,
    		rpcport: window.rpcport,
    		hash:hash,
    		bool_vote_type:bool_vote_type
  		}, window.config).then(function(res)
  		{
  			if (res.data.error)
  			{
  				swal("Oops...", res.data.error.message, "error");
  			}
  			else
  			{
  				swal("Success!", "Support status changed to '" + (bool_vote_type?"Yes":"No") + "'", "success");
  			}
		}).catch(function(err)
		{
             swal("Oops...", res.data.error.message, "error");
        })
  	},
  	vote: function(hash,vote_type,value)
  	{
    	let vm=this;
  		axios.post(window.hostname + 'consultationvote',
  		{
    		rpcuser: window.rpcuser,
			token: window.token,
    		rpcport: window.rpcport,
    		hash:hash,
    		vote_type:vote_type,
    		value:value
  		}, window.config).then(function(res)
  		{
  			if (res.data.error)
  			{
  				swal("Oops...", res.data.error.message, "error");
  			}
  			else
  			{
  				swal("Success!", "Vote status changed to '" + vote_type + "'", "success");
  			}
		}).catch(function(err)
		{
             swal("Oops...", res.data.error.message, "error");
        })
  	},
    listconsultations: function(filter)
    {
    	let vm=this;
  		axios.post(window.hostname + 'listconsultations',
  		{
    		rpcuser: window.rpcuser,
			token: window.token,
    		rpcport: window.rpcport,
    		filter:filter
  		}, window.config).then(function(res)
  		{
  			vm.consultations=res.data;
  		})
  		.catch(function(err)
		{
              //swal(err);
        })
	},
	generate: function(amount)
  	{
    	let vm=this;
  		axios.post(window.hostname + 'generate',
  		{
    		rpcuser: window.rpcuser,
			token: window.token,
    		rpcport: window.rpcport,
    		amount:amount
  		}, window.config).then(function(res)
  		{
		}).catch(function(err)
		{
        })
  	},
  	vote_value: function(consultation,min,max)
  	{
  		let vm=this;
        const {
          value
        } = swal({
          html:'Please specify a value between ' + min + " and " + max + '<br/><input type="number" min="'+min+'" max="'+max+'" id="v" class="swal2-input">',
          showCancelButton: true,
          preConfirm: function()
          {
			var retval=document.getElementById('v').value;
			if (parseInt(retval)<min || parseInt(retval)>max)
			{
				return false;
			}
		  }
        }).then(formValues => {
          if (formValues["value"])
          {
			var retval=document.getElementById('v').value;
          	if (parseInt(retval)<min || parseInt(retval)>max)
          	{
          		return;
          	}
          	else
          	{
          		vm.vote(consultation.hash,"value",retval);
          	}
          }
        });

  	},
  	refresh: function()
  	{
  		this.listconsultations();
  	},
}
}
</script>
<style>
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