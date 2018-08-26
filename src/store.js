import Vue from 'vue'
import Vuex from 'vuex'
import * as API from './API'
Vue.use(Vuex)

const aliasDomain="nav.community";
const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, responseType: 'text' }
var coins=require('../coins.json');
const checkGoogleDNS = async (name) => {
  console.log(name);
  return new Promise(async function(resolve, reject) {
    try {
      const url = 'nav.community'
      const randomPadding = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
      const finalUrl=`https://dns.google.com/resolve?name=${name}.${url}&type=16&cd=0&edns_client_subnet=0.0.0.0/0&random_padding=${randomPadding}`;
	  console.log(finalUrl);
	  const dnsResponse = await fetch(finalUrl);
      const json = await dnsResponse.json()

      // Get the previous address from DNS
      console.log(json)
      if (json.Status === 0) {
        if (Array.isArray(json.Answer)) {
          for (var i = 0; i < json.Answer.length; i++ ) {
            const oaAddr = json.Answer[i].data
            if (oaAddr.includes('oa1:nav')) {
              console.log(oaAddr)
              // Found a previous address. Use this to check signature
              resolve(oaAddr.substring(oaAddr.indexOf('recipient_address=') + 18, oaAddr.indexOf(';')))
            }
          }
        }
      }

      resolve('')
    } catch (err) {
      reject()
    }
  })
}

const store = new Vuex.Store({
  state: {
    transactions: [],
    peers: [],
    blockchainInfo: {},
	networkInfo: {},
    stakingInfo: {},
    walletInfo: {},
    stakeReport: {},
    info: {},
	price: {},
	softForks: {},
	version:'',
    proposals: [],
	storeitems: [],
	storeItems:[],
	buystoreitems: [],
	buyStoreItems:[],
    communitySiteProposals: [],
    communitySiteNews: [],
    communitySiteGames: [],
    combinedProposals: [],
    errorMessage: '',
    error: {},
	address: '',
    alias: '',
	signmessage: '',
	registeraddress: '',
    registeralias: '',
	registersignmessage: '',
	registerapimessage: '',
	coin:{},
	coins:{},
  },
  mutations: {
	saveAlias (state, arr) {
      state.address = arr["address"];
      state.alias = arr["alias"];
	  state.signmessage = arr["signmessage"];
	  //
	  state.registeraddress="";
	  state.registeralias="";
	  state.registersignmessage="";
    },
	saveRegisterAlias (state, arr) {
      state.registeraddress = arr["registeraddress"];
      state.registeralias = arr["registeralias"];
	  state.registersignmessage = arr["registersignmessage"];
	  state.registerapimessage = arr["registerapimessage"];
    },
    error (state, error) { state.errorMessage = error.message; state.error = error },
	addCoin (state, coin) { state.coin = coin, state.errorMessage = '' },
	addCoins (state, coins) { state.coins = coins, state.errorMessage = '' },
	addInfo (state, info) { state.info = info, state.errorMessage = '' },
    addVersion (state, version) { state.version = version, state.errorMessage = '' },
    addTransactions (state, transactions) { state.transactions = transactions },
    addPrice (state, price) { state.price = price },
    addSoftForks (state, softForks) { state.softForks = softForks },
    addPeers (state, peers) { state.peers = peers },
    addBlockchainInfo (state, blockchainInfo) { state.blockchainInfo = blockchainInfo },
    addNetworkInfo (state, networkInfo) { state.networkInfo = networkInfo },
    addWalletInfo (state, walletInfo) { state.walletInfo = walletInfo },
    addStakingInfo (state, stakingInfo) { state.stakingInfo = stakingInfo },
    addStakeReport (state, stakeReport) { state.stakeReport = stakeReport },
    addProposals (state, proposals) { state.proposals = proposals || state.proposals },
    addCommunitySiteProposals (state, proposals) { state.communitySiteProposals = proposals },
    addCommunitySiteNews (state, communitySiteNews) { state.communitySiteNews = communitySiteNews },
	addCommunitySiteGames (state, communitySiteGames) { state.communitySiteGames = communitySiteGames },
    addStoreItems (state, storeitems) { state.storeItems = storeitems },
    buyStoreItems (state, buystoreitems) { state.buyStoreItems = buystoreitems },
    addCombineProposals (state, combined) {
      const combinedProposals = []
      if (!combined || !combined.community || !combined.proposals) {
        return
      }
      // Merge the proposals from community site and blockchain
      combined.community.forEach(communityProposal => {
        combined.proposals.forEach(proposal => {
          if (communityProposal.hash === proposal.hash) {
            const combinedProposal = { ...proposal, ...communityProposal, image: communityProposal.image || "static/img/placeholder.png" }
            combinedProposals.push(combinedProposal)
          }
        })
      })

      state.combinedProposals = combinedProposals
    },
  },
  actions: {
    async checkAlias (context, alias) {
      var arr=[];
	  const address=await checkGoogleDNS(alias)
	  arr["address"]=address;
	  arr["alias"]=alias;
      const message=alias+"@"+aliasDomain;
	  API.signMessage(address,message)
        .then(msg=>{arr["signmessage"]="You are owner this alias!";context.commit('saveAlias',arr);})
        .catch(err => {arr["signmessage"]="You don't owner of this address.";context.commit('saveAlias',arr);})
    },
	async registerAlias (context, arr) {
		console.log("alias:"+arr["registeralias"]);
		console.log("address:"+arr["registeraddress"]);
		const message=arr["registeralias"]+"@"+aliasDomain;
	    API.signMessage(arr["registeraddress"],message)
        .then(msg=>{
			arr["registersignmessage"]=msg;
			const params = new URLSearchParams();
			params.append('address', arr["registeraddress"]);
			params.append('name', arr["registeralias"]);
			params.append('addressSig', msg);
			axios.post('https://openalias-api.nav.community/',params)
			.then(function (response)
			{
				console.log(response.data);
				arr["registerapimessage"]=response.data;
				context.commit('saveRegisterAlias',arr);
			})
			.catch(function (error)
			{
				console.log("Error:"+JSON.stringify(error.response.data));
				arr["registerapimessage"]=error.response.data;
				context.commit('saveRegisterAlias',arr);
			    console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.statusText);
				console.log(error.response.headers);
				console.log(error.response.config);
			});
			})
        .catch(err => {arr["registersignmessage"]="You don't owner of this address";context.commit('saveAlias',arr);})
	},
	async getCoin(context) {
		context.commit('addCoin', JSON.parse(API.getCoin()));
    },
	async getCoins(context) {
		context.commit('addCoins', coins);
    },
    async getVersion(context) {
      API.getVersion()
        .then(version => context.commit('addVersion', version))
        .catch(err => context.commit('error', err))
    },
    async getInfo(context) {
      API.getInfo()
        .then(info => context.commit('addInfo', info))
        .catch(err => context.commit('error', err))
    },
	async getPrice(context) {
      API.getPrice()
        .then(price => context.commit('addPrice', price))
        .catch(err => context.commit('error', err))
    },
	async getCommunitySoftForks(context) {
      API.getCommunitySoftForks()
        .then(softForks => context.commit('addSoftForks', softForks))
        .catch(err => context.commit('error', err))
    },
    async getTransactions (context) {
      API.getTransactions()
        .then(transactions => context.commit('addTransactions', transactions))
        .catch(err => context.commit('error', err))
    },
    async getPeerInfo (context) {
      API.getPeerInfo()
        .then(peers => context.commit('addPeers', peers))
        .catch(err => context.commit('error', err))
    },
    async getBlockchainInfo (context) {
      API.getBlockchainInfo()
        .then(blockchainInfo => context.commit('addBlockchainInfo', blockchainInfo))
        .catch(err => context.commit('error', err))
    },
    async getNetworkInfo (context) {
      API.getNetworkInfo()
        .then(networkInfo => context.commit('addNetworkInfo', networkInfo))
        .catch(err => context.commit('error', err))
    },
    async getWalletInfo (context) {
      API.getWalletInfo()
        .then(walletInfo => context.commit('addWalletInfo', walletInfo))
        .catch(err => context.commit('error', err))
    },
    async getStakingInfo(context) {
      API.getStakingInfo()
        .then(stakingInfo => context.commit('addStakingInfo', stakingInfo))
        .catch(err => context.commit('error', err))
    },
    async getStakeReport(context) {
      API.getStakeReport()
        .then(stakeReport => context.commit('addStakeReport', stakeReport)    )
        .catch(err => context.commit('error', err))
    },
    async getProposals(context) {
      API.getProposals()
        .then(proposals => context.commit('addProposals', proposals))
        .catch(err => context.commit('error', err))
    },
    async getCommunitySiteProposals(context) {
      API.getCommunitySiteProposals()
        .then(proposals => context.commit('addCommunitySiteProposals', proposals))
        .catch(err => context.commit('error', err))
    },
    async getCommunitySiteNews(context) {
      API.getCommunitySiteNews()
        .then(communitySiteNews => context.commit('addCommunitySiteNews', communitySiteNews[1].news))
        .catch(err => context.commit('error', err))
    },
    async getCommunitySiteGames(context) {
      API.getCommunitySiteGames()
        .then(communitySiteGames => context.commit('addCommunitySiteGames', communitySiteGames[1].games))
        .catch(err => context.commit('error', err))
    },
    async getStoreItems(context) {
      API.getStoreItems()
        .then(storeitems => context.commit('addStoreItems', storeitems[1].items))
        .catch(err => context.commit('error', err))
    },
    async buyStoreItems(context,store_item_id,store_item_price,store_item_payment_address,name,surname,country,address,city,state,zipcode,phone,email,notes) {
      const buystoreitems = await API.buyStoreItems(store_item_id,store_item_price,store_item_payment_address,name,surname,country,address,city,state,zipcode,phone,email,notes);
	  if (buystoreitems)
	  {
		context.commit('buyStoreItems', buystoreitems);
	  }
    },
    async getCombinedProposals(context) {
      try {
        const proposals = await API.getProposals()
        const communitySiteProposals = await API.getCommunitySiteProposals()
        const communityProposals = communitySiteProposals && communitySiteProposals[1] && communitySiteProposals[1].proposals
        if (proposals && communityProposals) {
          context.commit('addCombineProposals', { proposals: proposals, community: communityProposals })
        }
      } catch (err) {
        context.commit('error', err)
      }
    }
  }
})

export default store