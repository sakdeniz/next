<template>
<div class="content">
  <div class="container-fluid">
  	<div class="card fluid">
  		<div id="wrapper">
			<div id="left">
				<img style="width:240px;height:auto" src="static/img/navcoin-dao-consultation.jpg"/>
			</div>
			<div id="right">
				<h3 class="card-title" style="margin-top:10px;margin-bottom:20px;">How it works?</h3>
				<p>
					There are 2 types of questions to consult the NavCoin community. The first is the range of values, and the other is the multiple choice questions.
				</p>
				<p>
					For each consultation question you create, a certain amount of NAV is donated to the community fund from your account.
				</p>
			</div>
		</div>
	</div>
    <div class="row" style="margin-top:30px;">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            	<h4 class="card-title">Create Consultation</h4>
           </div>
          	<div class="card-body">
          		<div>
       		    	Question : <input type="text" class="form-control" style="width:100%;" id="question" name="question" v-model="question"/>
          		</div>
				
				<sui-form style="margin-top:30px;">
					<sui-form-fields grouped>
						<label>Choose your question type</label>
						<sui-form-field>
							<sui-checkbox label="The possible answers are numbers" radio value="1" v-model="question_type"/>
						</sui-form-field>
						<sui-form-field>
							<sui-checkbox label="The possible answers from a list" radio value="2" v-model="question_type"/>
						</sui-form-field>
					</sui-form-fields>
				</sui-form>
				<div v-show="question_type==1">
	    	   		    Answers must be between <input type="number" class="form-control" style="width:120px;display: inline-block;" id="min" name="min" v-model="min"/> and <input type="number" class="form-control" style="width:120px;display: inline-block;" id="max" name="max" v-model="max"/>
          		</div>
				<div v-show="question_type==2">
					<div style="margin-top:20px">
	       		    	Maximum amount of answers stakers can select at the same time:
	          		</div>
	          		
	          		<div>
	       		    	<input type="number" class="form-control" style="width:100%;" id="max_selection" name="max_selection" v-model="max_selection"/>
	          		</div>
					
					<div style="margin-top:20px">
						<sui-checkbox label="Stakers can propose additional answers" toggle v-model="allow_additional_answers" true-value="1" false-value="0"/>
					</div>
					
					<a class="ui green plus button" style="margin-top:20px" v-on:click="addAnswer()"><i class="fa fa-plus"></i>&nbsp;Add Answer</a>
	          		<div style="margin-top:20px">
	          			Possible Answers :
	          		</div>
					<div v-for="(item, index) in answerList">
	    	   		    <div class="row">
	    	   		    	<div class="col-md-12" style="margin-bottom:5px;">
	    	   		    		<a style="display: inline-block;" class="ui green red button tiny" v-on:click="removeAnswer(index)"><i class="fa fa-close"></i></a>
	    	   		    		<input type="text" class="form-control" v-model="item.title" style="width:90%;display: inline-block;"/>
	    	   				</div>
	    	   			</div>
	        	  	</div>
          		</div>
          		<div style="margin-top:20px;">
          			<a class="ui violet plus button large" v-on:click="createconsultation()"><i class="fa fa-paper-plane-o" aria-hidden="true"></i>&nbsp;Submit Consultation</a>
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
    var question="";
    var min="";
    var max="";
    var allow_additional_answers=0;
    var max_selection=1;
    var question_type="";
    var answerList=[];
    return {
		min,max,max_selection,allow_additional_answers,question,question_type,answerList
	}
  },
  created: function()
  {
  },
  methods:
  {
	createconsultation: function()
	{
		let vm=this;
		if (!vm.question)
		{
			swal("Warning", "Please specify a question", "warning");
			return;
		}
		if (!vm.question_type)
		{
			swal("Warning", "Please choice question type", "warning");
			return;
		}
		if (vm.question_type=="1")
		{
			if (!vm.min || !vm.max)
			{
				swal("Warning", "Please specify minimum and maximum values", "warning");
				return;
			}
			axios.post(window.hostname + 'createconsultation', {
			rpcuser: window.rpcuser,
			token: window.token,
			rpcport: window.rpcport,
			question: vm.question,
			min: vm.min,
			max: vm.max,
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
					swal("Success!", "Your consultation successfully created.", "success");
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
        }
        if (vm.question_type=="2")
		{
			if (vm.answerList.length<1)
			{
				swal("Warning", "Please specify some options", "warning");
				return;
			}
			axios.post(window.hostname + 'createconsultationwithanswers', {
			rpcuser: window.rpcuser,
			token: window.token,
			rpcport: window.rpcport,
			question: vm.question,
			answers: vm.answerList,
			max_selection:vm.max_selection,
			allow_additional_answers:(vm.allow_additional_answers?true:false)
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
					swal("Success!", "Your consultation successfully created.", "success");
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
        }
	},
	addAnswer: function()
	{
		this.answerList.push({title:""});
	},
	removeAnswer: function(index)
	{
		this.answerList.splice(index,1);
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