<template>
<div class="content">
  <div class="container-fluid">
  <h4 class="card-title"><i class="ion-paper-airplane"></i> Send</h4>
    <div class="row">
      <div class="col-md-12">
	  <span v-if="info.unlocked_until==0" title="Unlock Wallet" class="ui visible message yellow"><i class="ion-unlocked"></i>&nbsp;Your wallet is locked. You will be asked for your wallet password when you send {{coin.symbol}}.</span>
      <button title="Set Wallet Password" class="btn btn-xs btn-fill btn-danger" v-on:click="setPassword"><i class="ion-android-lock"></i>&nbsp;Set Password</button><br><br>
      </div>
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            Send to this address : <input type="text" class="form-control" style="width:100%;" id="to" name="to"></input>
			<div v-if="coin.bool_support_open_alias=='1'"><span class="ui pointing basic label">Open Alias supported, you can enter receiver address in e-mail style. For example john@nav.community</span></div>
            <br>Amount ({{coin.symbol}}) : <input type="text" class="form-control" style="width:100%;" id="amount" name="amount"></input>
            <br>Comment (Optional) : <input type="text" class="form-control" style="width:100%;" id="comment" name="comment"></input><small>A comment used to store what the transaction is for. This is not part of the transaction, just kept in your wallet.</small>
            <br>Comment To (Optional) : <input type="text" class="form-control" style="width:100%;" id="commentto" name="commentto"></input><small>A comment to store the name of the person or organization to which you're sending the transaction. This is not part of the transaction, just kept in your wallet.</small>
			<div v-if="coin.bool_anon_send=='1'" style="margin-left:10px;margin-top:20px;">
				<sui-checkbox label="Use Private Balance" toggle v-model="cPrivateSend" @click="t(1)"/>
			</div>
			<div v-if="coin.bool_anon_send=='1'" style="margin-left:10px;margin-top:20px;">
				<sui-checkbox label="Mix Coins (Participating in an aggregation session)" toggle v-model="cPrivateMixSend" @click="t(2)"/>
			</div>
            <br><br>
            <button class='btn btn-fill btn-info' v-on:click='send'><i class="ion-paper-airplane"></i>&nbsp;Send</button>
            <!--<button class='btn btn-fill btn-success' v-on:click='startaggregationsession'><i class="ion-play"></i>&nbsp;Start Aggregation Session</button>
            <button class='btn btn-fill btn-danger' v-on:click='stopaggregationsession'><i class="ion-stop"></i>&nbsp;Stop Aggregation Session</button>!-->
          <br/>
          </div>
        </div>
      </div>

      <div class="col-md-12">
    	<div class="card">
    	    <div class="card-header">
            	<h4 class="card-title"><i class='ion-shuffle'></i>&nbsp;Coin Mixing Service</h4>
        	</div>
      		<div class="card-body">
	          <p>
	          	Service is {{(aggregationsessions.running?"running":"not running")}}<br/>
	          	TX Candidates Count : {{aggregationsessions.txCandidatesCount}}
	          </p>
      		</div>
  		</div>
	  </div>

      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title"><i class='ion-ios-bookmarks-outline'></i>&nbsp;Address Book</h4></div>
          <div class="card-body">
            <input type="text" class="form-control" style="width:100%;" name="name" id="name" value="" placeholder="Name"></input><br>
            <input type="text" class="form-control" style="width:100%;" name="email" id="email" value="" placeholder="E-Mail"></input><br>
            <input type="text" class="form-control" style="width:100%;" name="address" id="address" value="" placeholder="Address"></input>
            <br><button class='btn btn-fill btn-success' v-on:click='addContact'><i class="ion-plus"></i>&nbsp;Add</button><br><br>
            <table>
              <tr>
                <th nowrap>Action</th>
                <th nowrap>Name</th>
                <th nowrap>E-Mail</th>
                <th nowrap style="width:100%">Address</th>
              </tr>
              <tr v-for="itm in arr">
                <td nowrap><button title="Delete" class="btn btn-xs btn-fill btn-danger" v-on:click="deleteContact(itm.index)"><i class="ion-close-round"></i></button>&nbsp;<button class="btn btn-xs btn-fill btn-info" v-on:click="selectContact(itm.index)">Select</button></td>
                <td>{{itm.name}}</td>
                <td>{{itm.email}}</td>
                <td>{{itm.address}}</td>
              </tr>
            </table>
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

function isOkPass(p) {
  var anUpperCase = /[A-Z]/;
  var aLowerCase = /[a-z]/;
  var aNumber = /[0-9]/;
  var aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
  var obj = {};
  obj.result = true;

  if (p.length < 6) {
    obj.result = false;
    obj.error = "Your password must be at least 6 characters."
    return obj;
  }

  var numUpper = 0;
  var numLower = 0;
  var numNums = 0;
  var numSpecials = 0;
  for (var i = 0; i < p.length; i++) {
    if (anUpperCase.test(p[i]))
      numUpper++;
    else if (aLowerCase.test(p[i]))
      numLower++;
    else if (aNumber.test(p[i]))
      numNums++;
    else if (aSpecial.test(p[i]))
      numSpecials++;
  }

  if (numUpper < 1 || numLower < 1 || numNums < 1 || numSpecials < 1) {
    obj.result = false;
    obj.error = "Wrong Format!";
    return obj;
  }
  return obj;
}
export default {
  components: {},
    computed: {
    ...mapState({
      coin: "coin",
	  info: "info",
    })
  },
  created: function() {
	var interval=3000;
	this.getInfo();
   	this.timer=setInterval(this.resync, interval);
	},
  beforeDestroy() {
	    clearInterval(this.timer);
  	},
  data: function() {
    var i = 0;
    var ni = 0;
    var arr = [];
    var cPrivateSend = false;
    var cPrivateMixSend = false;
    var aggregationsessions=[];
    axios.post(window.hostname + 'getaddressbook', {
      rpcuser: window.rpcuser,
	  token: window.token,
      rpcport: window.rpcport
    }, window.config).then(function(res) {
      jsonQ.each(res.data, function(key, value) {
        var t_name = "";
        var t_address = "";
        var t_email = "";
        jQuery.each(value, function(key2, value2) {
          if (key2 == "name") t_name = value2;
          if (key2 == "email") t_email = value2;
          if (key2 == "address") t_address = value2;
        });
        arr.push({
          index: i,
          name: t_name,
          email: t_email,
          address: t_address
        });
        i++;
      });
    });
    return {
      i,
      ni,
      arr,
      cPrivateSend,
      cPrivateMixSend,
      aggregationsessions
    }
  },
  methods: {
      ...mapActions({
      getInfo: "getInfo",
    }),
    t: function()
    {
    	if (this.cPrivateSend)
    	{
    		this.cPrivateMixSend=false;
	    	this.$forceUpdate();
    		return;
    	}
    	if (this.cPrivateMixSend)
    	{
    		this.cPrivateSend=false;
        	this.$forceUpdate();
			return;
    	}
    },
	resync: function()
	{
		this.viewaggregationsession();
	},
    viewaggregationsession: function()
    {
      let vm=this;
	  axios.post(window.hostname + 'viewaggregationsession', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
	  	console.log(res.data);
		if (!res.data["error"])
		{
			vm.aggregationsessions=res.data;
			vm.$forceUpdate();
		}
      }).catch(function(err) {
        console.log(err)
      })
	},
	startaggregationsession: function()
    {
      let vm=this;
      console.log("startaggregationsession");
	  axios.post(window.hostname + 'startaggregationsession', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
	  	console.log(res.data);
		if (!res.data["error"])
		{
	      swal({
            text: res.data
          });
		}
		else
		{
          swal({
            type: 'warning',
            title: 'Oops...',
            text: res.data["error"]["message"]
          });
	  	}
      }).catch(function(err) {
        console.log(err)
      })
	},
	stopaggregationsession: function()
    {
      let vm=this;
      console.log("stopaggregationsession");
	  axios.post(window.hostname + 'stopaggregationsession', {rpcuser: window.rpcuser,token: window.token,rpcport: window.rpcport}, window.config).then(function(res)
	  {
	  	console.log(res.data);
		if (!res.data["error"])
		{
	      swal({
            text: res.data
          });
		}
		else
		{
          swal({
            type: 'warning',
            title: 'Oops...',
            text: res.data["error"]["message"]
          });
	  	}
      }).catch(function(err) {
        console.log(err)
      })
	},
    setPassword: function() {
      axios.post(window.hostname + 'ispasswordset', {
        rpcuser: window.rpcuser,
		token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res) {
        if (res.data == false) {
          const {
            value: formValues
          } = swal({
            title: 'Set Password',
            html: 'Please enter a strong password.<br/>- Minimum 6 character<br/>- 1 Big letter<br/>- 1 Small letter<br/>- 1 Number<br/>- 1 Special character !@#$%^&*()-_<br/>' +
              '<input id="swal-input1" type="password" placeholder="Password" class="swal2-input">' +
              '<input id="swal-input2" type="password" placeholder="Password (Confirm)" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
              return [document.getElementById('swal-input1').value, document.getElementById('swal-input2').value]
            }
          }).then(formValues => {
            var password = formValues["value"][0];
            var password_confirm = formValues["value"][1];
            var obj = isOkPass(password);
            if (obj.result == false) {
              swal({
                type: 'error',
                title: 'Oops...',
                text: 'Your password is not strong enough!'
              })
            } else {
              if (password == password_confirm) {
                axios.post(window.hostname + 'setpassword', {
                  rpcuser: window.rpcuser,
				  token: window.token,
                  rpcport: window.rpcport,
                  password: password
                }, window.config).then(function(res) {
                  swal({
                    text: res.data
                  });
                })
              } else {
                swal({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Your passwords do not match each other!'
                })
              }
            }
          });
        } else {
          swal({
            type: 'warning',
            title: 'Oops...',
            text: 'Your password already set!'
          })
        }
      })
    },
    saveContacts: function() {
      axios.post(window.hostname + 'saveaddressbook', {
        rpcuser: window.rpcuser,
		token: window.token,
        rpcport: window.rpcport,
        data: JSON.stringify(this.arr)
      }, window.config).then(function(res) {
        //swal(res.data);
      });
    },
    addContact: function() {
      if ($("#name").val() != "" && $("#address").val() != "") {
        this.i = this.arr.length;
        this.arr.push({
          index: this.i,
          name: $("#name").val(),
          email: $("#email").val(),
          address: $("#address").val()
        });
        this.i++;
        this.saveContacts();
        $("#name").val(null);
        $("#email").val(null);
        $("#address").val(null);
      } else {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: 'Please enter a name and a valid address'
        });
      }
    },
    deleteContact: function(index) {
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          for (var i = this.arr.length - 1; i >= 0; i--) {
            if (this.arr[i].index === index) {
              this.arr.splice(i, 1);
              this.saveContacts();
              swal({
                type: 'success',
                title: 'Success!',
                text: 'Your contact has been deleted.'
              });
            }
          }
        } else {
          //swal("It is cancelled.");
        }
      });
    },
    selectContact: function(index) {
      for (var i = this.arr.length - 1; i >= 0; i--) {
        if (this.arr[i].index === index) {
          $("#to").val(this.arr[i].address);
        }
      }
    },
    send: function(event) {
      let vm = this;
	  var htmlEncryptionPassword="";
	  var htmlWalletPassword="";
	  var bWalletEncrypted=false;
	  var sTitle="Please enter your wallet password";
	  if (vm.info.unlocked_until!=null)
	  {
		bWalletEncrypted=true;
		sTitle="Please enter your <b>encryption</b> password";
		htmlEncryptionPassword='<input id="swal-input2" type="password" placeholder="Encryption Password" class="swal2-input">';
	  }
	  else
	  {
		sTitle="Please enter your <b>wallet</b> password.";
		htmlWalletPassword='<input id="swal-input1" type="password" placeholder="Password" class="swal2-input">';
	  }
      axios.post(window.hostname + 'ispasswordset', {
        rpcuser: window.rpcuser,
		token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res) {
        if (res.data == true)
		{
          const {
            value: formValues
          } = swal({
            html: sTitle+htmlWalletPassword+htmlEncryptionPassword,
            focusConfirm: false,
            preConfirm: () => {
				if (bWalletEncrypted)
				{
					return [document.getElementById('swal-input2').value]
				}
				else
				{
					return [document.getElementById('swal-input1').value];
				}
            }
          }).then(formValues => {
            var password = formValues["value"][0];
			var encryption_password="";
			if (bWalletEncrypted) encryption_password=formValues["value"][0];
            axios.post(window.hostname + 'checkpassword', {
              rpcuser: window.rpcuser,
			  token: window.token,
              rpcport: window.rpcport,
              password: password
            }, window.config).then(function(res) {
              if (res.data == true||bWalletEncrypted) {
                axios.post(window.hostname + 'validateaddress', {
                  rpcuser: window.rpcuser,
				  token: window.token,
                  rpcport: window.rpcport,
                  address: $("#to").val()
                }, window.config).then(function(res) {
                  console.log("Send");
                  var isAdressValid = false;
                  /*console.log("Status:" + res.status)
                  console.log("Return:" + res.data)*/
                  jsonQ.each(res.data, function(key, value) {
                    console.log(key + "=" + value);
                    if (key == "isvalid" && value == true) {
                      isAdressValid = true;
                    }
                  });
                  if (isAdressValid||$("#to").val().indexOf('@')>-1) {
                    if (isNaN($("#amount").val())) {
                      swal({
                        type: 'warning',
                        title: 'Oops...',
                        text: "Please enter amount"
                      });
                    } else {
                      axios.post(window.hostname + 'sendtoaddress', {
                        rpcuser: window.rpcuser,
						token: window.token,
                        rpcport: window.rpcport,
                        to: $("#to").val(),
                        amount: $("#amount").val(),
                        comment: $("#comment").val(),
                        commentto: $("#commentto").val(),
                        isprivate: vm.cPrivateSend,
                        isprivatemix: vm.cPrivateMixSend,
					    encryption_password: encryption_password
                      }, window.config).then(function(res) {
                        console.log("Status:" + res.status)
                        console.log("Return:" + res.data)
                        if (!res.data["error"])
						{
                         $("#to").val("");
                         $("#amount").val("");
                         $("#comment").val("");
                         $("#commentto").val("");
                          //swal({type: 'success',title: 'Success!',html: "Sending successful.<br><br>Transaction ID<br><code>" + res.data + "</code>"});
						  swal({type: 'success',title: 'Success!',html: "Sending successful."});
                        } else {
                          swal({
                            type: 'warning',
                            title: 'Oops...',
                            text: res.data["error"]["message"]
                          });
                        }
                      }).catch(function(err) {
                        console.log(err);
                      })
                    }
                  } else {
                    swal({
                      type: 'error',
                      title: 'Oops...',
                      text: 'Address not valid, check the address...'
                    });
                  }
                }).catch(function(err) {
                  console.log(err)
                })
              }
			  else
			  {
                swal({
                  type: 'warning',
                  title: 'Oops...',
                  text: 'Your password is not valid!'
                });
              }
            });
          });
        }
		else
		{
          swal({
            type: 'warning',
            title: 'Oops...',
            text: 'You should set a password for your wallet first!'
          });
        }
      });
    }
  },
}
</script>