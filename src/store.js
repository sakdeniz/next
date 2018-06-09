import Vue from 'vue'
import Vuex from 'vuex'

import * as API from './API'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    transactions: [],
    peers: [],
    blockchainInfo: {},
    stakingInfo: {},
    stakeReport: {},
    info: {},
	price: {},
	version:'',
    proposals: [],
	storeitems: [],
	storeItems:[],
	buystoreitems: [],
	buyStoreItems:[],
    communitySiteProposals: [],
    communitySiteNews: [],
    combinedProposals: [],
    errorMessage: '',
    error: {},
  },
  mutations: {
    error (state, error) { state.errorMessage = error.message; state.error = error },
    addInfo (state, info) { state.info = info, state.errorMessage = '' },
    addVersion (state, version) { state.version = version, state.errorMessage = '' },
    addTransactions (state, transactions) { state.transactions = transactions },
    addPrice (state, price) { state.price = price },
    addPeers (state, peers) { state.peers = peers },
    addBlockchainInfo (state, blockchainInfo) { state.blockchainInfo = blockchainInfo },
    addStakingInfo (state, stakingInfo) { state.stakingInfo = stakingInfo },
    addStakeReport (state, stakeReport) { state.stakeReport = stakeReport },
    addProposals (state, proposals) { state.proposals = proposals || state.proposals },
    addCommunitySiteProposals (state, proposals) { state.communitySiteProposals = proposals },
    addCommunitySiteNews (state, communitySiteNews) { state.communitySiteNews = communitySiteNews },
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
    getVersion(context) {
      API.getVersion()
        .then(version => context.commit('addVersion', version))
        .catch(err => context.commit('error', err))
    },
    getInfo(context) {
      API.getInfo()
        .then(info => context.commit('addInfo', info))
        .catch(err => context.commit('error', err))
    },
	getPrice(context) {
      API.getPrice()
        .then(price => context.commit('addPrice', price))
        .catch(err => context.commit('error', err))
    },
    getTransactions (context) {
      API.getTransactions()
        .then(transactions => context.commit('addTransactions', transactions))
        .catch(err => context.commit('error', err))
    },
    getPeerInfo (context) {
      API.getPeerInfo()
        .then(peers => context.commit('addPeers', peers))
        .catch(err => context.commit('error', err))
    },
    getBlockchainInfo (context) {
      API.getBlockchainInfo()
        .then(blockchainInfo => context.commit('addBlockchainInfo', blockchainInfo))
        .catch(err => context.commit('error', err))
    },
    getStakingInfo(context) {
      API.getStakingInfo()
        .then(stakingInfo => context.commit('addStakingInfo', stakingInfo))
        .catch(err => context.commit('error', err))
    },
    getStakeReport(context) {
      API.getStakeReport()
        .then(stakeReport => context.commit('addStakeReport', stakeReport)    )
        .catch(err => context.commit('error', err))
    },
    getProposals(context) {
      API.getProposals()
        .then(proposals => context.commit('addProposals', proposals))
        .catch(err => context.commit('error', err))
    },
    getCommunitySiteProposals(context) {
      API.getCommunitySiteProposals()
        .then(proposals => context.commit('addCommunitySiteProposals', proposals))
        .catch(err => context.commit('error', err))
    },
    getCommunitySiteNews(context) {
      API.getCommunitySiteNews()
        .then(communitySiteNews => context.commit('addCommunitySiteNews', communitySiteNews[1].news))
        .catch(err => context.commit('error', err))
    },
    getStoreItems(context) {
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