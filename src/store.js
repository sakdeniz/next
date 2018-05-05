import Vue from 'vue'
import Vuex from 'vuex'

import * as API from './API'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    transactions: [],
    blockchainInfo: {},
    stakingInfo: {},
    stakeReport: {},
    info: {},
    proposals: [],
    communitySiteProposals: [],
    combinedProposals: [],
    errorMessage: '',
    error: {},
  },
  mutations: {
    error (state, error) { state.errorMessage = error.message; state.error = error },
    addInfo (state, info) { state.info = info, state.errorMessage = '' },
    addTransactions (state, transactions) { state.transactions = transactions },
    addBlockchainInfo (state, blockchainInfo) { state.blockchainInfo = blockchainInfo },
    addStakingInfo (state, stakingInfo) { state.stakingInfo = stakingInfo },
    addStakeReport (state, stakeReport) { state.stakeReport = stakeReport },
    addProposals (state, proposals) { state.proposals = proposals || state.proposals },
    addCommunitySiteProposals (state, proposals) { state.communitySiteProposals = proposals },
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
    getInfo(context) {
      API.getInfo()
        .then(info => context.commit('addInfo', info))
        .catch(err => context.commit('error', err))
    },
    getTransactions (context) {
      API.getTransactions()
        .then(transactions => context.commit('addTransactions', transactions))
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
