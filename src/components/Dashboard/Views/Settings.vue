<template>
<div class="content">
  <div class="container-fluid">
    <h4 class="card-title"><i class="ion-gear-a"></i> Settings</h4>
    <div class="ui one column grid">
      <div class="column">
        <div class="ui segment">
          <a class="ui purple ribbon label">Configuration</a>
          <br><br>
          <div class="row">
            <div class="col-md-12 ui toggle checkbox" style="margin-left:10px">
              <input name="check1" type="checkbox" v-on:change="changeConfig" v-model="cStaking">
              <label>Staking</label>
            </div>
            <div class="col-md-12 ui toggle checkbox" style="margin-left:10px">
              <input name="check1" type="checkbox" v-on:change="changeConfig" v-model="cTestnet">
              <label>Testnet</label>
            </div>
            <div class="col-md-12 ui toggle checkbox" style="margin-left:10px">
              <input name="check1" type="checkbox" v-on:change="changeConfig" v-model="cTxindex">
              <label>TX Index</label>
            </div>
            <div class="col-md-12 ui toggle checkbox" style="margin-left:10px">
              <input name="check1" type="checkbox" v-on:change="changeConfig" v-model="cAddressIndex">
              <label>Address Index</label>
            </div>
          </div>
          <div class="col-md-12 ui ignored warning message">You must restart the NEXT for the changes to take effect.</div>
          <div class="ui form">
            <div class="field">
              <textarea v-model="config">{{config}}</textarea>
            </div>
            <button class="ui icon tiny button green" v-on:click="saveConfig"><i class="ion-checkmark-round"></i>&nbsp;Save</button>
          </div>
        </div>
      </div>
    </div>
    <div class="ui one column grid">
      <div class="column">
        <div class="ui segment">
          <a class="ui purple ribbon label">Master Private Key</a>
          <p></p>
          <button class="ui icon tiny button green" v-on:click="dumpMasterPrivKey"><i class="ion-eye"></i>&nbsp;Show Master Private Key</button>
          <div><code>{{masterprivkey}}</code></div>
        </div>
      </div>
    </div>
    <div class="ui one column grid">
      <div class="column">
        <div class="ui segment">
          <a class="ui purple ribbon label">Sign Message</a>
          <div class="ui ignored warning message">You can sign messages/agreements with your addresses to prove you can receive navcoins sent to them. Be careful not to sign anything vague or random, as phishing attacks may try to trick you into signing your identity over to them. Only sign
            fully-detailed statements you agree to.</div>
          <div class="ui form">
            <div class="field">
              <input name="first-name" placeholder="NAV Address" type="text" id="navaddress" v-model="navaddress">
            </div>
            <div class="field">
              <input name="last-name" placeholder="Message" type="text" id="message" v-model="message">
            </div>
            <button class="ui icon tiny button green" v-on:click="signMessage"><i class="ion-key"></i>&nbsp;Sign</button>
            <div><code>{{signmessage}}</code></div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui one column grid">
      <div class="column">
        <div class="ui segment">
          <a class="ui purple ribbon label">Verify Message</a>
          <div class="ui ignored warning message">Enter the receiver's address, message (ensure you copy line breaks, spaces, tabs, etc. exactly) and signature below to verify the message. Be carefull not to read more into the signature than what is in the signed message itself, to avoid being
            tricked by a man-in-the-middle attack. Note that this only proves the signing party receives with the address, it cannot prove sendership of any transaction!</div>
          <div class="ui form">
            <div class="field">
              <input name="first-name" placeholder="NAV Address" type="text" id="verify_navaddress" v-model="verify_navaddress">
            </div>
            <div class="field">
              <input name="last-name" placeholder="Signature" type="text" id="verify_signature" v-model="verify_signature">
            </div>
            <div class="field">
              <input name="last-name" placeholder="Message" type="text" id="verify_message" v-model="verify_message">
            </div>
            <button class="ui icon tiny button green" v-on:click="verifyMessage"><i class="ion-checkmark-circled"></i>&nbsp;Verify</button>
            <div><code>{{is_verify_success}}</code></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  data: function() {
    var masterprivkey;
    var signmessage;
    var navaddress;
    var message;
    var verify_navaddress;
    var verify_signature;
    var verify_message;
    var config;
    var is_verify_success;
    var cStaking = false;
    var cTestnet = false;
    var cTxindex = false;
    var cAddressIndex = false;
    return {
      masterprivkey,
      signmessage,
      navaddress,
      message,
      verify_navaddress,
      verify_signature,
      verify_message,
      config,
      cStaking,
      cTestnet,
      cTxindex,
      cAddressIndex,
      is_verify_success
    }
  },
  components: {},
  created: function() {
    this.loadConfig();
  },
  methods: {
    changeConfig: function(event) {
      let vm = this;
      if (vm.cStaking) vm.config = vm.config.replace("staking=0", "staking=1");
      else vm.config = vm.config.replace("staking=1", "staking=0");
      if (vm.cTestnet) vm.config = vm.config.replace("testnet=0", "testnet=1");
      else vm.config = vm.config.replace("testnet=1", "testnet=0");
      if (vm.cTxindex) vm.config = vm.config.replace("txindex=0", "txindex=1");
      else vm.config = vm.config.replace("txindex=1", "txindex=0");
      if (vm.cAddressIndex) vm.config = vm.config.replace("addressindex=0", "addressindex=1");
      else vm.config = vm.config.replace("addressindex=1", "addressindex=0");
    },
    loadConfig: function(event) {
      let vm = this;
      axios.post(window.hostname + 'loadconfig', {
        token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res) {
        if (res.data.toLowerCase().indexOf("staking=1") != -1) {
          vm.cStaking = true;
        }
        if (res.data.toLowerCase().indexOf("testnet=1") != -1) {
          vm.cTestnet = true;
        }
        if (res.data.toLowerCase().indexOf("txindex=1") != -1) {
          vm.cTxindex = true;
        }
        if (res.data.toLowerCase().indexOf("addressindex=1") != -1) {
          vm.cAddressIndex = true;
        }
        if (res.data.toLowerCase().indexOf("staking=") == -1) res.data += "\r\nstaking=0";
        if (res.data.toLowerCase().indexOf("testnet=") == 1) res.data += "\r\ntestnet=0";
        if (res.data.toLowerCase().indexOf("txindex=") == -1) res.data += "\r\ntxindex=0";
        if (res.data.toLowerCase().indexOf("addressindex=") == -1) res.data += "\r\naddressindex=0";
        vm.config = res.data;
      }).catch(function(err) {
        console.log(err);
      })
    },
    saveConfig: function(event) {
      let vm = this;
      swal(vm.config);
      axios.post(window.hostname + 'saveconfig', {
        token: window.token,
        rpcport: window.rpcport,
        data: vm.config
      }, window.config).then(function(res) {
        swal({
          type: 'info',
          title: 'Save Configuration',
          text: res.data
        });
      }).catch(function(err) {
        console.log(err);
      })
    },
    dumpMasterPrivKey: function(event) {
      let vm = this;
      axios.post(window.hostname + 'dumpmasterprivkey', {
        token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res) {
        vm.masterprivkey = res.data;
      }).catch(function(err) {
        console.log(err);
      })
    },
    signMessage: function(event) {
      let vm = this;
      if (!$("#navaddress").val()) {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: "Enter a valid NAV Address"
        });
      } else if (!$("#message").val()) {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: "Enter a message"
        });
      } else {
        axios.post(window.hostname + 'signmessage', {
          token: window.token,
          rpcport: window.rpcport,
          navaddress: vm.navaddress,
          message: vm.message
        }, window.config).then(function(res) {
          if (!res.data["error"]) {
            vm.signmessage = res.data;
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
    },
    verifyMessage: function(event) {
      let vm = this;
      if (!$("#verify_navaddress").val()) {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: "Enter a valid NAV Address"
        });
      } else if (!$("#verify_signature").val()) {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: "Enter a signature"
        });
      } else if (!$("#verify_message").val()) {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: "Enter a message"
        });
      } else {
        axios.post(window.hostname + 'verifymessage', {
          token: window.token,
          rpcport: window.rpcport,
          navaddress: vm.verify_navaddress,
          signature: vm.verify_signature,
          message: vm.verify_message
        }, window.config).then(function(res) {
          if (!res.data["error"]) {
            if (res.data == true) swal({
              type: 'success',
              title: 'Verify Message',
              text: 'Message successfully verified'
            });
            else swal({
              type: 'warning',
              title: 'Verify Message',
              text: 'Message could not be verified'
            });
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
    },
    copytoclipboard: function(selector) {
      copy(selector);
    },
  },
}
</script>
