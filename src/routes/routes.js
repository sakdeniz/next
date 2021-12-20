import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
import NotFound from '../components/GeneralViews/NotFoundPage.vue'
import Overview from '../components/Dashboard/Views/Overview.vue'
import Send from '../components/Dashboard/Views/Send.vue'
import Receive from '../components/Dashboard/Views/Receive.vue'
import Transactions from '../components/Dashboard/Views/Transactions.vue'
import Staking from '../components/Dashboard/Views/Staking.vue'
import Store from '../components/Dashboard/Views/Store.vue'
import Games from '../components/Dashboard/Views/Games.vue'
import Settings from '../components/Dashboard/Views/Settings.vue'
import Console from '../components/Dashboard/Views/Console.vue'
import Logs from '../components/Dashboard/Views/Logs.vue'
import SoftForks from '../components/Dashboard/Views/SoftForks.vue'
import Merchants from '../components/Dashboard/Views/Merchants.vue'
import PeerList from '../components/Dashboard/Views/PeerList.vue'
import CommunityProposals from '../components/Dashboard/Views/CommunityProposals.vue'
import CommunityFund from '../components/Dashboard/Views/CommunityFund.vue'
import DAO from '../components/Dashboard/Views/DAO.vue'
import MeetCommunity from '../components/Dashboard/Views/MeetCommunity.vue'
import MyProposals from '../components/Dashboard/Views/MyProposals.vue'
import CreateProposal from '../components/Dashboard/Views/CreateProposal.vue'
import CreateConsultation from '../components/Dashboard/Views/CreateConsultation.vue'
import ProposeConsensusChange from '../components/Dashboard/Views/ProposeConsensusChange.vue'
import ProposalVoteList from '../components/Dashboard/Views/ProposalVoteList.vue'
import PaymentRequestVoteList from '../components/Dashboard/Views/PaymentRequestVoteList.vue'
import News from '../components/Dashboard/Views/News.vue'
import Swap from '../components/Dashboard/Views/Swap.vue'
import OpenAlias from '../components/Dashboard/Views/OpenAlias.vue'
import ColdStaking from '../components/Dashboard/Views/ColdStaking.vue'
import PrivateToken from '../components/Dashboard/Views/PrivateToken.vue'
import NFT from '../components/Dashboard/Views/NFT.vue'
import dotNAV from '../components/Dashboard/Views/dotNAV.vue'
import About from '../components/Dashboard/Views/About.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/overview'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      },
      {
        path: 'send',
        name: 'Send',
        component: Send
      },
      {
        path: 'receive',
        name: 'Receive',
        component: Receive
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: Transactions
      },
      {
        path: 'staking',
        name: 'Staking',
        component: Staking
      },
      {
        path: 'store',
        name: 'Store',
        component: Store
      },
	  {
        path: 'games',
        name: 'Games',
        component: Games
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings
      },
      {
        path: 'console',
        name: 'Console',
        component: Console
      },
      {
        path: 'logs',
        name: 'Logs',
        component: Logs
      },
      {
        path: 'softforks',
        name: 'SoftForks',
        component: SoftForks
      },
      {
        path: 'peer-list',
        name: 'Peer List',
        component: PeerList
      },
      {
        path: 'merchants',
        name: 'Merchants',
        component: Merchants
      },
      {
        path: 'community-proposals',
        name: 'CommunityProposals',
        component: CommunityProposals
      },
      {
        path: 'community-fund',
        name: 'CommunityFund',
        component: CommunityFund
      },
      {
        path: 'dao',
        name: 'DAO',
        component: DAO
      },
      {
        path: 'dotNAV',
        name: 'dotNAV',
        component: dotNAV
      },
      {
        path: 'meet-community',
        name: 'MeetCommunity',
        component: MeetCommunity
      },
      {
        path: 'create-proposal',
        name: 'CreateProposal',
        component: CreateProposal
      },
      {
        path: 'create-consultation',
        name: 'CreateConsultation',
        component: CreateConsultation
      },
      {
        path: 'propose-consensus-change',
        name: 'ProposeConsensusChange',
        component: ProposeConsensusChange
      },
      {
        path: 'proposal-vote-list',
        name: 'ProposalVoteList',
        component: ProposalVoteList
      },
      {
        path: 'payment-request-vote-list',
        name: 'PaymentRequestVoteList',
        component: PaymentRequestVoteList
      },
      {
        path: 'my-proposals',
        name: 'MyProposals',
        component: MyProposals
      },
      {
        path: 'news',
        name: 'News',
        component: News
      },
      {
        path: 'swap',
        name: 'Swap',
        component: Swap
      },
      {
        path: 'open-alias',
        name: 'OpenAlias',
        component: OpenAlias
      },
      {
        path: 'cold-staking',
        name: 'ColdStaking',
        component: ColdStaking
      },
      {
        path: 'private-token',
        name: 'PrivateToken',
        component: PrivateToken
      },
      {
        path: 'nft',
        name: 'NFT',
        component: NFT
      },
      {
        path: 'about',
        name: 'About',
        component: About
      },
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
