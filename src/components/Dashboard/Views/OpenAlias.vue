<template>
<div class="content">
	<div class="container-fluid">
		<h4 class="card-title"><i class="ion-arrow-return-right"></i> Open Alias</h4>
		<div class="ui one column grid">
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Check Alias</a>
					<p></p>
					<div class="ui form">
						<div class="field">
							<input placeholder="Alias" type="text" id="talias" name="talias" v-model="talias">
						</div>
						<button class="ui icon tiny button gray" v-on:click="cAlias"><i class="ion-search"></i>&nbsp;Check availability</button><br/><br/>
						<div v-if="address">
							<div class="ui red horizontal label">Sorry, this alias already in use. Try different one!</div><br><br>
							<div class="ui purple horizontal label">{{address}}</div>
							<div class="ui gray horizontal label">{{signmessage}}</div>
						</div>
						
						<div v-if="!address && alias"><div class="ui green medium horizontal label"><i class="ion-checkmark"></i>&nbsp;Alias '{{alias}}' is available!</div><br><br>
							<div class="field">
								<button class="btn btn-sm btn-fill btn-success" v-on:click="getnewaddress" style="margin-bottom:5px;"><i class="ion-asterisk"></i>&nbsp;Generate New Address</button>&nbsp;
								<button title="Select Existing Address" class="btn btn-sm btn-fill btn-info" v-on:click="selectAddress" style="margin-bottom:5px;"><i class="ion-arrow-down-b"></i> Select From Existing Addresses</button><input type="text" class="form-control" style="width:100%;" id="navcoinaddress" name="navcoinaddress" v-model="navcoinaddress" placeholder="NAVCoin Address"></input>
							</div>
							<button class="ui icon tiny button green" v-on:click="cRegister"><i class="ion-plus"></i>&nbsp;Register it!</button><br/><br/>
							<div v-if="registersignmessage">
							<!--<div class="ui purple horizontal label">Alias</div><div class="ui gray medium horizontal label">{{registeralias}}</div><br><br>
							<div class="ui purple horizontal label">Address</div><div class="ui gray medium horizontal label">{{registeraddress}}</div><br><br>
							<div class="ui purple horizontal label">Signature</div><div class="ui gray medium horizontal label">{{registersignmessage}}</div><br><br>!-->
							<div v-if=registerapimessage.openAlias>
								<div class="ui green horizontal label">Success!</div><br><br>
								<div class="ui purple horizontal label">Address</div><div class="ui gray medium horizontal label">{{registerapimessage.address}}</div><br><br>
								<div class="ui purple horizontal label">Open Alias</div><div class="ui gray medium horizontal label">{{registerapimessage.openAlias}}</div><br><br>
								<div class="ui purple horizontal label">Name</div><div class="ui gray medium horizontal label">{{registerapimessage.name}}</div><br><br>
							</div>
							<div v-else>
								<div class="ui red horizontal label">Error!</div>
								<div class="ui gray medium horizontal label">{{registerapimessage.error}}</div><br><br>
							</div>
							</div>
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
import Vue from "vue";
import {
  mapState,
  mapActions
} from "vuex";
export default {
  data: function() {
    return {
	  talias:"",
	  navcoinaddress:"",
      addresslist: [],
      total_address: 0,
      checked: true
    }
  },
   computed: {
    ...mapState({
      address: state => state.address,
      alias: state => state.alias,
      signmessage: state => state.signmessage,
	  registeraddress: state => state.registeraddress,
      registeralias: state => state.registeralias,
      registersignmessage: state => state.registersignmessage,
	  registerapimessage: state => state.registerapimessage,
    })
  },
  components: {},
  created: function() {
    this.listaddressgroupings();
  },
  methods: {
    ...mapActions({
      checkAlias: "checkAlias",
	  registerAlias: "registerAlias",
    }),
	cAlias: function(event) {
		this.checkAlias(this.talias);
	},
	cRegister: function(event) {
		const arr=[];
		arr["registeralias"]=this.talias;
		arr["registeraddress"]=this.navcoinaddress;
		this.registerAlias(arr);
	},
    selectAddress: function(event) {
  	  let vm=this;
      var navAddressList = [];
      axios.post(window.hostname + 'listaddressgroupings', {
        token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res) {
        jsonQ.each(res.data, function(key, value) {
          jQuery.each(value, function(index, item) {
            navAddressList.push({
              address: item[0],
              name: item[0]
            });
          });
        });
        var options = {};
        $.map(navAddressList,
          function(o) {
            options[o.address] = o.name;
          });
        const {
          value: navaddress
        } = swal({
          title: 'Select an address',
          input: 'select',
          inputOptions: options,
          inputPlaceholder: 'Select an address',
          showCancelButton: true,
          inputValidator: (value) => {
            return new Promise((resolve) => {
              resolve();
            })
          }
        }).then(formValues => {
          if (formValues["value"])
		  {
			$("#navcoinaddress").val(formValues["value"]);
			vm.navcoinaddress=formValues["value"];
		  }
        });
      }).catch(function(err) {
        console.log(err)
      })
    },
    getnewaddress: function(event) {
      let vm=this;
	  axios.post(window.hostname + 'getnewaddress', {token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
        vm.navcoinaddress=res.data;
      }).catch(function(err) {
        console.log(err);
      })
    },
    copytoclipboard: function(selector) {
      copy(selector);
    },
    listaddressgroupings: function(event) {
      let vm = this;
      axios.post(window.hostname + 'listaddressgroupings', {token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
		if (!res.data["error"])
		{
			var account = "";
			var i=0;
			jsonQ.each(res.data, function(key, value)
			{
				jQuery.each(value, function(index, item)
				{
					if (item[2] != undefined) account = item[2]; else account = "";
					vm.addresslist.push({address: item[0],balance: item[1],account: account});
					i++;
				});
				vm.total_address = i;
			});
		}
      }).catch(function(err) {
        console.log(err)
      })
    }
  },
}
</script>