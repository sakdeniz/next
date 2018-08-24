const urlParams=new URLSearchParams(window.location.search);
const rpcuser=urlParams.get('rpcuser');
const token=urlParams.get('rpcpassword');
const rpcport=urlParams.get('rpcport');
const host='http://localhost:3000/';
const config={ headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, responseType: 'text' }
const testCoin='{"name":"NAVCoin","symbol":"NAV","logo":"static/img/coins/nav.png","cmc_symbol":"nav-coin","qrcode_prefix":"navcoin","bgcolor":"black","bgimage":"static/img/sidebar-1.jpg","config_file":"navcoin.conf","data_dir_windows":"NavCoin4","data_dir_osx":"NavCoin4","data_dir_linux":".navcoin4","testnet_dir":"testnet3","daemon_file_windows":"navcoind.exe","daemon_file_osx":"navcoind","daemon_file_linux":"navcoind","rpc_port_mainnet":"44444","rpc_port_testnet":"44445","bool_anon_send":"1","bool_support_staking":"1","bool_support_community_fund":"1","bool_support_open_alias":"1","bootstrap_file_url_mainnet":"https://nav.nyc3.digitaloceanspaces.com/bootstrap/mainnet/bootstrap-navcoin-4.2.1_mainnet.tar","bootstrap_file_url_testnet":"https://navcommunity.net/bootstrap/testnet.tar","social_youtube_url":"https://www.youtube.com/channel/UCjDs4JceVSsaeCyvkA9cWCg","social_facebook_url":"https://www.facebook.com/navcoin","social_twitter_url":"https://www.twitter.com/navcoin","social_github_url":"https://www.github.com/navcoin","social_reddit_url":"https://www.reddit.com/r/NavCoin/","social_instagram_url":"https://www.instagram.com/navcore","block_explorers":{"CryptoID":{"name":"CryptoID","url":"https://chainz.cryptoid.info/nav/"},"NavExplorer":{"name":"NavExplorer","url":"https://navexplorer.com"}}}';
const handleError = (res) => {
	if (res.data && res.data.error)
	{
		console.log(res.data.error);
		throw res.data.error
	}
	return res
}

const getCoin = () => {
  if (urlParams.get('coin')) return decodeURIComponent(urlParams.get('coin')); else return testCoin;
}

const getTransactions = () => {
  return axios.post(hostname + "listtransactions", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data.reverse())
}

const getPeerInfo = () => {
  return axios.post(hostname + "getpeerinfo", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getBlockchainInfo = () => {
  return axios.post(hostname + "getblockchaininfo", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getWalletInfo = () => {
  return axios.post(hostname + "getwalletinfo", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getStakingInfo = () => {
  return axios.post(hostname + "getstakinginfo", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getStakeReport = () => {
  return axios.post(hostname + "getstakereport", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getInfo = () => {
  return axios.post(hostname + "getinfo", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getNetworkInfo = () => {
  return axios.post(hostname + "getnetworkinfo", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getProposals = () => {
  return axios.post(hostname + "listproposals", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getCommunitySiteNews = () => {
  return axios.post(hostname + "navcommunity-getnews", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getCommunitySiteGames = () => {
  return axios.post(hostname + "navcommunity-getgames", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getCommunitySiteProposals = () => {
  return axios.post(hostname + "navcommunity-getproposals", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getStoreItems = () => {
  return axios.post(hostname + "navcommunity-getstoreitems", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const getVersion = () => {
  return axios.post(hostname + "getversion", { rpcuser:rpcuser,token: token, rpcport: rpcport }, config)
  .then(handleError)
  .then(response => response.data)
}

const signMessage = (navaddress,message) => {
  console.log("nav address:"+navaddress);
  console.log("message:"+message);
  return axios.post(hostname + "signmessage", { rpcuser:rpcuser,token: token, rpcport: rpcport, navaddress: navaddress, message: message}, config)
  .then(handleError)
  .then(response => response.data)
}

const getPrice = () => {
  var coin=new Object();
  if (urlParams.get('coin')) coin=JSON.parse(decodeURIComponent(urlParams.get('coin'))); else coin=JSON.parse(testCoin);
  if (!coin.cmc_symbol)	return new Promise(function(resolve, reject) {resolve('')})
  return axios.get("https://api.coinmarketcap.com/v1/ticker/"+coin.cmc_symbol+"/?convert=EUR", {}, config)
  .then(handleError)
  .then(response => response.data)
}

const getCommunitySoftForks = () => {
  return axios.get("https://navcommunity.net/api/softforks.php", {}, config)
  .then(handleError)
  .then(response => response.data)
}

function buyStoreItems (obj) {
  return axios.post(hostname + "navcommunity-buystoreitems", { rpcuser:rpcuser,token: token, rpcport: rpcport, store_item_id: obj["store_item_id"], store_item_name: obj["store_item_name"], store_item_price: obj["store_item_price"], store_item_payment_address: obj["store_item_payment_address"],name:obj["name"],surname:obj["surname"],country:obj["country"],address:obj["address"],city:obj["city"],state:obj["state"],zipcode:obj["zipcode"],phone:obj["phone"],email:obj["email"],notes:obj["notes"]}, config)
  .then(handleError)
  .then(response => response.data)
}

export {
  getCoin,
  getTransactions,
  getBlockchainInfo,
  getWalletInfo,
  getStakingInfo,
  getStakeReport,
  getInfo,
  getNetworkInfo,
  getVersion,
  getProposals,
  getStoreItems,
  buyStoreItems,
  getPeerInfo,
  getPrice,
  signMessage,
  getCommunitySiteProposals,
  getCommunitySiteNews,
  getCommunitySiteGames,
  getCommunitySoftForks
}