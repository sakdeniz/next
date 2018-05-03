const urlParams = new URLSearchParams(window.location.search)

const token = urlParams.get('rpcpassword')
const rpcport = urlParams.get('rpcport')
const host = 'http://localhost:3000/'
const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, responseType: 'text' }

const handleError = (res) => {
  if (res.data && res.data.error) {
    console.log(res.data.error)
    throw res.data.error
  }

  return res
}

const getTransactions = () => {
  return axios.post(hostname + "listtransactions", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getBlockchainInfo = () => {
  return axios.post(hostname + "getblockchaininfo", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getStakingInfo = () => {
  return axios.post(hostname + "getstakinginfo", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getStakeReport = () => {
  return axios.post(hostname + "getstakereport", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getInfo = () => {
  return axios.post(hostname + "getinfo", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getProposals = () => {
  return axios.post(hostname + "listproposals", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getCommunitySiteProposals = () => {
  return axios.post(hostname + "navcommunity-getproposals", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

export {
  getTransactions,
  getBlockchainInfo,
  getStakingInfo,
  getStakeReport,
  getInfo,
  getProposals,
  getCommunitySiteProposals
}