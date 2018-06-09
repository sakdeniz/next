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
  .then(response => response.data.reverse())
}

const getPeerInfo = () => {
  return axios.post(hostname + "getpeerinfo", { token: token, rpcport: rpcport }, config)
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

const getCommunitySiteNews = () => {
  return axios.post(hostname + "navcommunity-getnews", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getCommunitySiteProposals = () => {
  return axios.post(hostname + "navcommunity-getproposals", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getStoreItems = () => {
  return axios.post(hostname + "navcommunity-getstoreitems", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getVersion = () => {
  return axios.post(hostname + "getversion", { token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getPrice = () => {
  return axios.get("https://api.coinmarketcap.com/v1/ticker/nav-coin/?convert=EUR", {}, config)
  .then(handleError)
  .then(response => response.data)
}

function buyStoreItems (obj) {
  return axios.post(hostname + "navcommunity-buystoreitems", { token: token, rpcport: rpcport, store_item_id: obj["store_item_id"], store_item_name: obj["store_item_name"], store_item_price: obj["store_item_price"], store_item_payment_address: obj["store_item_payment_address"],name:obj["name"],surname:obj["surname"],country:obj["country"],address:obj["address"],city:obj["city"],state:obj["state"],zipcode:obj["zipcode"],phone:obj["phone"],email:obj["email"],notes:obj["notes"]}, config)
  .then(handleError)
  .then(response => response.data)
}

export {
  getTransactions,
  getBlockchainInfo,
  getStakingInfo,
  getStakeReport,
  getInfo,
  getVersion,
  getProposals,
  getCommunitySiteProposals,
  getCommunitySiteNews,
  getStoreItems,
  buyStoreItems,
  getPeerInfo,
  getPrice
}