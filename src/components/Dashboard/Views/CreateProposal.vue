<template>
<div class="content">
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12 col-sm-12">
        <sui-dropdown icon="ion-navicon-round" class="labeled icon large violet" text="Menu" button floating>
          <sui-dropdown-menu>
            <router-link to="/admin/create-proposal" tag="sui-dropdown-item"><i class="ion-plus-round"></i>&nbsp;Create Proposal</router-link>
            <router-link to="/admin/community-proposals" tag="sui-dropdown-item"><i class="ion-grid"></i>&nbsp;All Proposals</router-link>
            <router-link to="/admin/my-proposals" tag="sui-dropdown-item"><i class="ion-heart"></i>&nbsp;My Proposals</router-link>
            <router-link to="/admin/proposal-vote-list" tag="sui-dropdown-item"><i class="ion-checkmark-round"></i>&nbsp;Proposal Vote List</router-link>
            <router-link to="/admin/payment-request-vote-list" tag="sui-dropdown-item"><i class="ion-log-out"></i>&nbsp;Payment Request Vote List</router-link>
          </sui-dropdown-menu>
        </sui-dropdown>
        <br><br>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Create Proposal</h4></div>
          <div class="card-body">
            <br>Proposal Title : <input type="text" class="form-control" style="width:100%;" id="desc" name="desc"></input>
            <br>Payment Address : <button title="Select" class="btn btn-xs btn-fill btn-success" v-on:click="selectAddress" style="margin-bottom:5px;"><i class="ion-arrow-down-b"></i> Select</button><input type="text" class="form-control" style="width:100%;"
              id="navcoinaddress" name="navcoinaddress"></input>
            <br>Amount in NAV :<input type="text" class="form-control" style="width:100%;" id="amount" name="amount"></input>
            <br>Deadline : <input type="date" class="form-control" style="width:100%;" id="deadline" name="deadline"></input>
            <br>Owner/Team Members :<textarea class="form-control editor" style="width:100%;min-height:100px;" id="owner" name="owner"></textarea>
            <br>Web Site URL : <input type="text" class="form-control" style="width:100%;" id="website" name="website"></input>
            <br>Contact E-mail : <input type="text" class="form-control" style="width:100%;" id="email" name="email"></input>
            <br>Proposal Short Description :<textarea class="form-control editor" style="width:100%;min-height:150px;" id="short_desc" name="short_desc"></textarea>
            <br>Proposal Long Description :<textarea class="form-control editor" style="width:100%;min-height:300px;" id="long_desc" name="long_desc"></textarea>
            <br><button class='btn btn-fill btn-info' v-on:click='createproposal'><i class="ion-paper-airplane"></i>&nbsp;Create</button>
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

export default {
  components: {},
    data: function() {
    var editor_short_desc,editor_long_desc;
    return {
      editor_short_desc,editor_long_desc
    }
  },
  created: function() {},
  mounted:function()
  {
	let vm=this;
	ClassicEditor
		.create(document.querySelector('#short_desc'), {
			toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
		}).then(editor =>{
            vm.editor_short_desc=editor;
        });
	ClassicEditor
		.create(document.querySelector('#long_desc'), {
			toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
		}).then(editor =>{
            vm.editor_long_desc=editor;
        });
  },
  methods: {
    selectAddress: function(event) {
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
          if (formValues["value"]) $("#navcoinaddress").val(formValues["value"]);
        });
      }).catch(function(err) {
        console.log(err)
      })
    },
    createproposal: function(event) {
	  let vm=this;
      if ($("#desc").val() == "") {
        swal("Error", "Please enter a proposal description", "error");
        return;
      }
      if ($("#navcoinaddress").val() == "") {
        swal("Error", "Please enter a valid NAV address", "error");
        return;
      }
      if ($("#deadline").val() == "") {
        swal("Error", "Please enter a dead line date", "error");
        return;
      }
      axios.post(window.hostname + 'validateaddress', {
        token: window.token,
        rpcport: window.rpcport,
        address: $("#navcoinaddress").val()
      }, window.config).then(function(res) {
        var isAdressValid = false;
        jsonQ.each(res.data, function(key, value) {
          console.log(key + "=" + value);
          if (key == "isvalid" && value == true) {
            isAdressValid = true;
          }
        });
        if (isAdressValid) {
          if ($("#amount").val() == "") {
            swal("Error", "Please enter amount", "error");
          } else {
            var epoch = moment($("#deadline").val()).unix();
            axios.post(window.hostname + 'createproposal', {
              token: window.token,
              rpcport: window.rpcport,
              desc: $("#desc").val(),
              navcoinaddress: $("#navcoinaddress").val(),
              amount: $("#amount").val(),
              deadline: epoch,
              owner: $("#owner").val(),
              website: $("#website").val(),
              email: $("#email").val(),
              short_desc: vm.editor_short_desc.getData(),
              long_desc: vm.editor_long_desc.getData()
            }, window.config).then(function(res) {
              var hash = "";
              var strDZeel = "";
              console.log("Status:" + res.status)
              console.log("Return:" + res.data)
              $("#desc").val("");
              $("#navcoinaddress").val("");
              $("#amount").val("");
              $("#deadline").val("");
              jsonQ.each(res.data, function(key, value) {
                if (key == "hash") hash = value;
                if (key == "strDZeel") strDZeel = value;
              });
              swal("Success!", "Proposal created.\r\n\r\nHash:" + hash + "\r\n\r\n" + strDZeel, "success");
            }).catch(function(err) {
              console.log(err);
            })
          }
        } else {
          console.log("Invalid address...");
          swal("Invalid address", "Address not valid, check the address...", "error");
        }
      }).catch(function(err) {
        console.log(err)
      })
    }
  },
}
</script>
<style>
.ck-editor__editable {
    min-height: 200px;
}
</style>