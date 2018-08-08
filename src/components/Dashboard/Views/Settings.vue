<template>
<div class="content">
  <div class="container-fluid">
    <h4 class="card-title"><i class="ion-gear-a"></i> Settings</h4>
    <div v-if="!isDemo">
		<div class="ui one column grid">
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Data Folder</a>
					<div class="ui ignored warning message">Data folder includes Blockchain data files, Configuration and Wallet file.</div>
					<div class="row">
						<div class="col-md-12" style="margin-left:10px">
							<button class="ui icon tiny button blue" v-on:click="openDataFolder"><i class="ion-folder"></i>&nbsp;Open Data Folder</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="ui one column grid">
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Repair Wallet</a>
					<div class="ui ignored warning message">If your balance looks invalid, you can try repairing wallet. NEXT will automatically close and you should start NEXT manually.</div>
					<div class="row">
						<div class="col-md-12" style="margin-left:10px">
							<button class="ui icon tiny button blue" v-on:click="repairWallet"><i class="ion-wrench"></i>&nbsp;Repair Wallet</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="ui one column grid">
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Backup & Import Wallet</a>
					<div class="row">
						<div class="col-md-12" style="margin-left:10px">
						<br>
							<div class="row">
							<div class="col-md-6">
							<div class="ui ignored warning message">Safely copies current wallet file to destination.</div>
							<button class="ui icon tiny button blue" v-on:click="backupWallet"><i class="ion-arrow-up-c"></i>&nbsp;Backup Wallet</button>
							</div>
							<div class="col-md-6">
							<div class="ui ignored warning message">Imports keys from a wallet dump file.</div>
							<button class="ui icon tiny button blue" v-on:click="importWallet"><i class="ion-arrow-down-c"></i>&nbsp;Import Wallet</button>
							</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="ui one column grid">
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Lock Wallet</a>
					<div class="ui ignored warning message"><ul><li>If you want Staking enabled, you need to keep your wallet unlocked.</li><li>If your wallet is encrypted, you will be prompted for a password while sending.</li></ul></div>
					<div class="ui form">
						<div class="ui visible message red" v-if="info.unlocked_until==0"><i class="ion-android-lock"></i>&nbsp;Wallet Locked</div>
						<div class="ui visible message green" v-if="info.unlocked_until!=0"><i class="ion-unlocked"></i>&nbsp;Wallet Unlocked</div>
						<div class="field">
							<input v-if="info.unlocked_until==0||info.unlocked_until==null" placeholder="Password" type="password" id="walletpassphrase" v-model="walletpassphrase">
						</div>
						<button v-if="info.unlocked_until==null" class="ui icon tiny button green" v-on:click="encryptWallet"><i class="ion-android-lock"></i>&nbsp;Encrypt Wallet</button>
						<button v-if="info.unlocked_until==0" class="ui icon tiny button green" v-on:click="walletPassphrase(true)"><i class="ion-unlocked"></i>&nbsp;Unlock Wallet for Staking Only</button>
						<button v-if="info.unlocked_until==0" class="ui icon tiny button green" v-on:click="walletPassphrase(false)"><i class="ion-unlocked"></i>&nbsp;Unlock Wallet</button>
						<button v-if="info.unlocked_until!=0 && info.unlocked_until!=null" class="ui icon tiny button red" v-on:click="walletLock"><i class="ion-android-lock"></i>&nbsp;Lock Wallet</button>
						<button v-if="info.unlocked_until!=null" class="ui icon tiny button green" v-on:click="walletPassPhraseChange"><i class="ion-edit"></i>&nbsp;Change Wallet Password</button>
					</div>
				</div>
			</div>
		</div>
		<div class="ui one column grid">
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Configuration</a>
					<br><br>
					<div class="row">
						<div class="col-md-12">
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
			</div>
		</div>
		<div class="ui one column grid">
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Notifications</a>
					<br><br>
					<div class="row">
						<div class="col-md-12">
							<div class="col-md-12 ui toggle checkbox" style="margin-left:10px">
								<input name="NotificationGeneral" type="checkbox" v-model="cNotificationGeneral" true-value="1" false-value="0" v-on:change="changeNotificationGeneral">
								<label>General Notifications</label>
							</div>
							<div class="col-md-12 ui toggle checkbox" style="margin-left:10px">
								<input name="NotificationIncomingTransaction" type="checkbox" v-model="cNotificationIncomingTransaction" true-value="1" false-value="0" v-on:change="changeNotificationIncomingTransaction">
								<label>Incoming Transactions</label>
							</div>
							<div class="col-md-12 ui toggle checkbox" style="margin-left:10px">
								<input name="NotificationNewStake" type="checkbox" v-model="cNotificationNewStake" true-value="1" false-value="0" v-on:change="changeNotificationNewStake">
								<label>New Stakes</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="ui one column grid">
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Update Settings</a>
					<br><br>
					<div class="row">
						<div class="col-md-12">
							<sui-form>
								<sui-form-fields grouped>
									<label>Choose your update preference</label>
									<sui-form-field>
										<sui-checkbox label="Auto update" radio value="1" v-model="update_preference" v-on:change="updatePreference(1)"/>
									</sui-form-field>
									<sui-form-field>
										<sui-checkbox label="Ask me" radio value="2" v-model="update_preference" v-on:change="updatePreference(2)"/>
									</sui-form-field>
									<sui-form-field>
										<sui-checkbox label="Never update" radio value="3" v-model="update_preference" v-on:change="updatePreference(3)"/>
									</sui-form-field>
								</sui-form-fields>
							</sui-form>
						</div>
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
					<br><br>
					<div class="ui form">
						<div class="field">
							<input name="first-name" placeholder="Private Key" type="text" id="privkey" v-model="privkey">
						</div>
					</div>
					<br><button class="ui icon tiny button green" v-on:click="importPrivKey"><i class="ion-eye"></i>&nbsp;Import Private Key</button>
				</div>
			</div>
		</div>
		<div class="ui one column grid">
			<div class="column">
				<div class="ui segment">
					<a class="ui purple ribbon label">Sign Message</a>
					<div class="ui ignored warning message">You can sign messages/agreements with your addresses to prove you can receive coins sent to them. Be careful not to sign anything vague or random, as phishing attacks may try to trick you into signing your identity over to them. Only sign fully-detailed statements you agree to.</div>
					<div class="ui form">
						<div class="field">
							<input name="first-name" placeholder="Address" type="text" id="navaddress" v-model="navaddress">
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
					<div class="ui ignored warning message">Enter the receiver's address, message (ensure you copy line breaks, spaces, tabs, etc. exactly) and signature below to verify the message. Be carefull not to read more into the signature than what is in the signed message itself, to avoid being tricked by a man-in-the-middle attack. Note that this only proves the signing party receives with the address, it cannot prove sendership of any transaction!</div>
					<div class="ui form">
						<div class="field">
							<input name="first-name" placeholder="Address" type="text" id="verify_navaddress" v-model="verify_navaddress">
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
    <div v-else>Settings disabled on demo.</div>
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
function errorhandler(data) {
  if (data) {
    if (data["error"]) {
      swal("Error!", data["error"]["message"], "error");
    }
  }
}
export default {
  data: function() {
    var walletpassphrase;
	var masterprivkey;
	var privkey;
    var signmessage;
    var navaddress;
    var message;
    var verify_navaddress;
    var verify_signature;
    var verify_message;
    var config;
    var is_verify_success;
    var cStaking=false;
    var cTestnet=false;
    var cTxindex=false;
    var cAddressIndex=false;
	var cNotificationGeneral=0;
	var cNotificationIncomingTransaction=0;
	var cNotificationNewStake=0;
	var isDemo=window.isDemo;
	var update_preference=1;
    return {
	 isDemo,
      walletpassphrase,
	  masterprivkey,
	  privkey,
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
	  cNotificationGeneral,
	  cNotificationIncomingTransaction,
	  cNotificationNewStake,
      is_verify_success,
	  update_preference
    }
  },
  components: {},
  created: function() {
	this.getInfo();
    this.timer=setInterval(this.resync, 1000);
    this.loadConfig();
	this.getSettings();
  },
      computed: {
    ...mapState({
      info: "info",
    })
  },
   beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
     ...mapActions({
      getInfo: "getInfo",
    }),
    updatePreference: function(up) {
		console.log("next:update_preference:"+this.update_preference);
	},
    openDataFolder: function(event) {
		console.log("next:open-data-folder");
	},
    getSettings: function(event) {
		let vm=this;
		this.cNotificationGeneral=localStorage.getItem("cNotificationGeneral");
		this.cNotificationIncomingTransaction=localStorage.getItem("cNotificationIncomingTransaction");
		this.cNotificationNewStake=localStorage.getItem("cNotificationNewStake");
		this.update_preference=localStorage.getItem("update_preference");
	},
    repairWallet: function(event) {
		console.log("next:repair-wallet");
	},
    backupWallet: function(event) {
		console.log("next:backup-wallet");
	},
    importWallet: function(event) {
		console.log("next:import-wallet");
	},
    resync: function() {
	  this.getInfo();
    },
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
	changeNotificationGeneral: function(event) {
      let vm=this;
	  if (vm.cNotificationGeneral=="1") console.log("next:setting:cNotificationGeneral:on"); else console.log("next:setting:cNotificationGeneral:off");
	},
	changeNotificationIncomingTransaction: function(event) {
      let vm=this;
      if (vm.cNotificationIncomingTransaction=="1") console.log("next:setting:cNotificationIncomingTransaction:on"); else console.log("next:setting:cNotificationIncomingTransaction:off");
	},
	changeNotificationNewStake: function(event) {
      let vm=this;
      if (vm.cNotificationNewStake=="1") console.log("next:setting:cNotificationNewStake:on"); else console.log("next:setting:cNotificationNewStake:off");
	},
    loadConfig: function(event) {
      let vm = this;
      axios.post(window.hostname + 'loadconfig', {
        rpcuser: window.rpcuser,
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
      axios.post(window.hostname + 'saveconfig', {
        rpcuser: window.rpcuser,
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
        rpcuser: window.rpcuser,
		token: window.token,
        rpcport: window.rpcport
      }, window.config).then(function(res) {
   		  if (!res.data["error"])
		  {
              vm.masterprivkey = res.data;
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
    },
	importPrivKey: function(event) {
      let vm = this;
      axios.post(window.hostname + 'importprivkey', {
        rpcuser: window.rpcuser,
		token: window.token,
        rpcport: window.rpcport,
		privkey: vm.privkey
      }, window.config).then(function(res) {
		  if (res.data==null)
		  {
              swal({type: 'success',title: 'Import Private Key',text: "Your private key imported."});
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
    },
    signMessage: function(event) {
      let vm = this;
      if (!$("#navaddress").val()) {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: "Enter a valid Address"
        });
      } else if (!$("#message").val()) {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: "Enter a message"
        });
      } else {
        axios.post(window.hostname + 'signmessage', {
          rpcuser: window.rpcuser,
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
	walletPassPhraseChange: function()
	{
      let vm=this;
	  var htmlEncryptionPassword="";
	  var bWalletLocked=false;
	  if (vm.info.unlocked_until!=null)
	  {
		bWalletLocked=true;
		htmlEncryptionPassword='<input id="wallet_password" name="wallet_password" type="password" placeholder="Wallet Encryption Password" class="swal2-input">'
	  }
	  const {
        value: accept
      } = swal({
        title: 'Change Encryption Password',
        html: "<div style='text-align:left'><div class='ui form'><div class='field'><input id='old_password' name='old_password' type='password' placeholder='Old Password' class='ui form-control'></input></div><div class='field'><input id='new_password' name='new_password' type='password' placeholder='New Password' class='ui form-control'></div></div></div>",
        allowOutsideClick: false,
	    onOpen: () => {$("#old_password").focus();},
        confirmButtonColor: '#cc0000',
		confirmButtonText: 'Change Password',
        cancelButtonText: 'Cancel',
  	    showCancelButton: true,
      }).then(function(res) {
	    if (res.value)
		{
			axios.post(window.hostname + 'walletpassphrasechange', {
			rpcuser: window.rpcuser,
			token: window.token,
			rpcport: window.rpcport,
			old_password: $("#old_password").val(),
			new_password: $("#new_password").val(),
			}, config).then(function(res) {
			errorhandler(res.data);
			console.log("Status:" + res.status);
			console.log("Return:" + res.data);
			if (res.data==null)
			{
				swal("Change Wallet Password", "You have successfully changed your encryption password.", "success");
			}
			})
			.catch(function(err) {
			console.log(err);
			})
		}
      });
	},
	encryptWallet: function(event) {
      let vm = this;
      if (!$("#walletpassphrase").val()) {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: "Enter a password"
        });
      } else {
	  
	  swal({
  title: 'Are you sure?',
  html: "You won't be able to revert this!<br>After encryption complete NEXT wallet will be closed automatically. You should manually start NEXT.",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, encrypt the wallet!'
}).then((result) => {
  if (result.value) {
		swal({onOpen: () => {swal.showLoading()},allowOutsideClick:false,html: 'Your wallet is being encrypted.<br><br>NEXT Wallet will automatically close itself after encryption complete.<br><br>Please wait...'});
        axios.post(window.hostname + 'encryptwallet ', {
          rpcuser: window.rpcuser,
		  token: window.token,
          rpcport: window.rpcport,
          passphrase: vm.walletpassphrase
        }, window.config).then(function(res) {
          if (!res.data["error"])
		  {
              swal({type: 'success',title: 'Encrypt Wallet',text: "Wallet encrypted successfully."});
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
})
      }
    },
    walletPassphrase: function(bUnlockForStaking) {
	  let vm = this;
	  var unlockText;
	  if (bUnlockForStaking) unlockText="Your wallet unlocked for staking only"; else unlockText="Your wallet unlocked";
      if (!$("#walletpassphrase").val()) {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: "Enter a password"
        });
      } else {
        axios.post(window.hostname + 'walletpassphrase ', {
          rpcuser: window.rpcuser,
		  token: window.token,
          rpcport: window.rpcport,
          passphrase: vm.walletpassphrase,
		  bunlockforstaking:bUnlockForStaking
        }, window.config).then(function(res) {
		vm.walletpassphrase="";
		  if (res.data==null)
		  {
              swal({type: 'success',title: 'Unlock Wallet',text: unlockText});
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
	walletLock: function(event) {
        axios.post(window.hostname + 'walletlock ', {
          rpcuser: window.rpcuser,
		  token: window.token,
          rpcport: window.rpcport,
        }, window.config).then(function(res) {
		  if (res.data==null)
		  {
              swal({type: 'success',title: 'Lock Wallet',text: "Your wallet locked"});
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
    },
    verifyMessage: function(event) {
      let vm = this;
      if (!$("#verify_navaddress").val()) {
        swal({
          type: 'warning',
          title: 'Oops...',
          text: "Enter a valid Address"
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
          rpcuser: window.rpcuser,
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