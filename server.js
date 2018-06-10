var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var argv = require('minimist')(process.argv.slice(2));
var qs = require('querystring');
var axios = require('axios');
var server;
const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, responseType: 'text' }
const crypto=require('crypto');
const Client = require('bitcoin-core');
const appDataPath= process.env.APPDATA ? process.env.APPDATA+"\\NavCoin4\\" : (process.platform == 'darwin' ? process.env.HOME+'/Library/Application Support/Navcoin4/' : process.env.HOME+'/.navcoin4/');
const fileConfig=appDataPath+"navcoin.conf";
const fileAddressBook=appDataPath+"addressbook.dat";
const fileWalletPassword=appDataPath+"walletpass.dat";

function sendResponse(res, statusCode, body)
{
	res.writeHead(statusCode);
	res.write(body);
	res.end();
}

function sendError(res, statusCode, body)
{
	var obj={"error":body};
	console.log("[ERROR] "+ body);
	res.writeHead(statusCode);
	res.write(JSON.stringify(obj))
	res.end();
}

function isJSON(v) {
    str = v.toString();
	if (str.charAt(0)=="{" || str.charAt(0)=="[") return true; else return false;
	}
server = http.createServer(function (req, res)
{
	res.setHeader('Access-Control-Allow-Origin', "*");
	res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	var url=req.url;
	var body='';
	req.on('data', function (data)
	{
		body+=data;
	});
	req.on('end', function ()
	{
		var post= body ? JSON.parse(body) : {}
		if (post.rpcport) port=post.rpcport; else port=44445;
		if (post.token) token=post.token; else token="test";
		const client = new Client({host:"localhost", port:port,username:token,password:token});
		/*console.log("Port:"+port);
		console.log("Token:"+token);*/
		client.command("foobar").then((retval) =>
		{
		}).catch((e) =>
		{
			//console.log("ERROR CODE:"+e.code+" ERROR MESSAGE:"+e.message+" ERROR TYPE:"+e.name);
			console.log(req.url);
			if(e.code==401)
			{
				console.log(e.message);
			}
			else if(e.code=="ECONNREFUSED")
			{
				console.log(e.message);
			}
			else
			{
				if (req.url=="/command")
				{
					var strcmd=post.command;
					var methodname="";
					var params=[];
					strcmd=strcmd.split(" ");
					for(var i =0; i < strcmd.length; i++)
					{
						if (i==0) methodname=strcmd[i];
						if (i!=0) params.push(strcmd[i]);
					}
					console.log("method="+methodname);
					console.log("params="+params);
					const batch = [{ method: methodname, parameters: params }]
					client.command(batch).then((retval) => {
						if (isJSON(retval))
						{
							sendResponse(res, 200,JSON.stringify(retval,null,4));
						}
						else
						{
							sendResponse(res, 200,String(retval));
						}
						}).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/setpassword")
				{
					var fs=require('fs');
					const passwordHash=crypto.createHash('sha256').update(post.password, 'utf8').digest('hex');
					fs.writeFile(fileWalletPassword,passwordHash, function (err)
					{
						if (err)
						{
							console.log("An error occured while saving password.");
							sendResponse(res, 200,"Failed to write password file.");
						}
						else
						{
							console.log("Password saved.");
							sendResponse(res, 200,"Your password succesfully saved.");
						}
					});
				}
				if (req.url=="/checkpassword")
				{
					var fs=require('fs');
					const passwordHash1=fs.readFileSync(fileWalletPassword,'utf8');
					const passwordHash2=crypto.createHash('sha256').update(post.password, 'utf8').digest('hex');
					//console.log("passwordHash1 : ["+passwordHash1+"] passwordHash2 : ["+passwordHash2+"]");
					if (passwordHash1==passwordHash2)
					{
						console.log("Password valid")
						sendResponse(res, 200,"true");
					}
					else
					{
						console.log("Invalid password")
						sendResponse(res, 200,"false");
					}
				}
				if (req.url=="/ispasswordset")
				{
					var fs=require('fs');
					try
					{
						const password=fs.readFileSync(fileWalletPassword,'utf8');
						if (password!=null)
						{
							console.log("Password already set")
							sendResponse(res, 200,"true");
						}
						else
						{
							console.log("Password not set")
							sendResponse(res, 200,"false");
						}
					}
					catch(e)
					{
						console.log("Password file not found")
						sendResponse(res, 200,"false");
					}
				}
				if (req.url=="/saveaddressbook")
				{
					var fs=require('fs');
					fs.writeFile(fileAddressBook,post.data, function (err)
					{
						if (err)
						{
							console.log("An error occured while saving address book.");
							sendResponse(res, 200,"Failed to write addressbook.dat");
						}
						else
						{
							console.log("Address book saved");
							sendResponse(res, 200,"Succesfully saved.");
						}
					});
				}
				if (req.url=="/getversion")
				{
					var packageInfo = require(__dirname+'/package.json');
					var version="";
					if (packageInfo.version) version=packageInfo.version; else version="Unknown";
					sendResponse(res, 200,version);
				}
				if (req.url=="/getaddressbook")
				{
					var fs=require('fs');
					var data=fs.readFileSync(fileAddressBook,'utf8');
					console.log(data);
					sendResponse(res, 200,data);
				}
				if (req.url=="/loadconfig")
				{
					var fs=require('fs');
					var data=fs.readFileSync(fileConfig,'utf8');
					console.log(data);
					sendResponse(res, 200,data);
				}
				if (req.url=="/getlogs")
				{
					var fileLog;
					if (post.rpcport=="44444") fileLog=appDataPath+"debug.log"; else fileLog=appDataPath+"testnet3/debug.log";
					var fs=require('fs');
					var data=fs.readFileSync(fileLog,'utf8');
					sendResponse(res, 200,data);
				}
				if (req.url=="/saveconfig")
				{
					var fs=require('fs');
					fs.writeFile(fileConfig,post.data, function (err)
					{
						if (err)
						{
							console.log("An error occured while saving config file.");
							sendResponse(res, 200,"Failed to write config file.");
						}
						else
						{
							console.log("Config file succesfully saved.");
							sendResponse(res, 200,"Config file succesfully saved.");
						}
					});
				}
				if (req.url=="/validateaddress")
				{
					console.log(post.address);
					client.validateAddress(post.address).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/sendtoaddress")
				{
					if (post.isprivate)
					{
						console.log("Private Send");
						client.anonSend(post.to,post.amount,post.comment,post.commentto).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
					}
					else
					{
						console.log("Send");
						client.sendToAddress(post.to,post.amount,post.comment,post.commentto).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
					}
				}
				if (req.url=="/proposaldonate")
				{
					console.log("Proposal donate. Hash:"+post.proposal_hash+",Payment Address:"+post.proposal_paymentaddress+",Amount:"+post.donate_amount);
					client.sendToAddress(post.proposal_paymentaddress,post.donate_amount,"Proposal Donate (" + post.donator_name + ") (" + post.proposal_hash + ")","").then((retval) => {
						sendResponse(res, 200,JSON.stringify(retval));
						axios.post("https://navcommunity.net/api/proposaldonate.php", "hash="+post.proposal_hash+"&amount="+post.donate_amount+"&address="+post.proposal_paymentaddress+"&donator_name="+post.donator_name+"&txid="+retval,config)
						.then((retval) => console.log(JSON.stringify(retval.data))).catch((e) => {sendError(res, 200,e);})
					}
					).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/createproposal")
				{
					console.log("Address :"+post.navcoinaddress+"\r\nAmount:"+post.amount+"\r\nDeadline:"+post.deadline+"\r\nDesc:"+post.desc+"\r\nOwner:"+post.owner+"\r\nWeb Site URL:"+post.website+"\r\nE-Mail:"+post.email+"\r\nShort Description:"+post.short_desc+"\r\nLong Description:"+post.long_desc);
					client.createproposal(post.navcoinaddress,post.amount,post.deadline,post.desc).then((retval) =>	{
						var t=JSON.parse(JSON.stringify(retval));
						axios.post("https://navcommunity.net/api/createproposal.php", "hash="+t['hash']+"&amount="+post.amount+"&desc="+post.desc+"&navcoinaddress="+post.navcoinaddress+"&deadline="+post.deadline+"&owner="+post.owner+"&website="+post.website+"&email="+post.email+"&short_description="+post.short_desc+"&long_description="+post.long_desc,config)
						.then((retval) => console.log(JSON.stringify(retval.data))).catch((e) => {sendError(res, 200,e);})
						sendResponse(res, 200,JSON.stringify(retval));
					}
					).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/proposalvote")
				{
					console.log("Hash:"+post.proposal_hash+"\r\nVote:"+post.vote_type);
					client.proposalvote(post.proposal_hash.toString(),post.vote_type.toString()).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/paymentrequestvote")
				{
					console.log("Hash:"+post.paymentrequest_hash+"\r\nVote:"+post.vote_type);
					client.paymentrequestvote(post.paymentrequest_hash.toString(),post.vote_type.toString()).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/createpaymentrequest")
				{
					console.log("Hash:"+post.proposal_hash);
					client.createpaymentrequest(post.proposal_hash.toString(),post.amount.toString(),post.id.toString()).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/getnewaddress")
				{
					client.getNewAddress().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/stop")
				{
					client.stop().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/getblockchaininfo")
				{
					client.getBlockchainInfo().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);console.log(e);});
				}
				if (req.url=="/getinfo")
				{
					client.getInfo().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/getpeerinfo")
				{
					client.getPeerInfo().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/cfundstats")
				{
					client.cfundstats().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/listproposals")
				{
					client.listproposals().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/proposalvotelist")
				{
					client.proposalvotelist().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/paymentrequestvotelist")
				{
					client.paymentrequestvotelist().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/getstakereport")
				{
					client.command('getstakereport').then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/listtransactions")
				{
					client.listTransactions('*', 1000,0).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/listaddressgroupings")
				{
					client.command('listaddressgroupings').then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/getstakinginfo")
				{
					client.command('getstakinginfo').then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/dumpmasterprivkey")
				{
					client.command('dumpmasterprivkey').then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/signmessage")
				{
					client.signMessage(post.navaddress,post.message).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/verifymessage")
				{
					client.verifyMessage(post.navaddress,post.signature,post.message).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/addanonserver")
				{
					console.log("node="+post.node+" command="+post.command);
					client.addAnonServer(post.node,post.command,"true").then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/getanonservers")
				{
					var fs=require('fs');
					var data=fs.readFileSync(fileConfig,'utf8');
					var arr=[];
					data.split("\n").map(function (val)
					{
						if (val.indexOf("addanonserver")!=-1)
						{
							arr.push(val.split("=")[1]);
							console.log("Anon server -> " + val.split("=")[1])
						}
					});
					sendResponse(res, 200,JSON.stringify(arr));
				}
				if (req.url=="/navcommunity-getproposals")
				{
					axios.post("https://navcommunity.net/api/getproposals.php", {},{})
					.then((retval) => sendResponse(res, 200,JSON.stringify(retval.data))).catch((e) => {sendError(res, 200,e);})
				}
				if (req.url=="/navcommunity-getnews")
				{
					axios.post("https://navcommunity.net/api/getnews.php", {},{})
					.then((retval) => sendResponse(res, 200,JSON.stringify(retval.data))).catch((e) => {sendError(res, 200,e);})
				}
				if (req.url=="/navcommunity-getmerchantlist")
				{
					axios.post("https://navcommunity.net/api/getmerchantlist.php", {},{})
					.then((retval) => sendResponse(res, 200,JSON.stringify(retval.data))).catch((e) => {sendError(res, 200,e);})
				}
				if (req.url=="/navcommunity-getstoreitems")
				{
					axios.post("https://navcommunity.net/api/getstoreitems.php", {},{})
					.then((retval) => sendResponse(res, 200,JSON.stringify(retval.data))).catch((e) => {sendError(res, 200,e);})
				}
				if (req.url=="/navcommunity-buystoreitems")
				{
					client.sendToAddress(post.store_item_payment_address,post.store_item_price,post.store_item_id+"/"+post.store_item_name,post.store_item_id+"/"+post.store_item_name).then((retval) => 
					axios.post("https://navcommunity.net/api/buystoreitems.php", "store_item_id="+post.store_item_id+"&store_item_price="+post.store_item_price+"&store_item_payment_address="+post.store_item_payment_address+"&name="+post.name+"&surname="+post.surname+"&address="+post.address+"&country="+post.country+"&notes="+post.notes+"&city="+post.city+"&zipcode="+post.zipcode+"&state="+post.state+"&phone="+post.phone+"&email="+post.email+"&notes="+post.notes+"&txid="+retval,config)
					.then((retval) => sendResponse(res, 200,JSON.stringify(retval.data))).catch((e) => {sendError(res, 200,e);})
					).catch((e) => {sendError(res, 200,e);});
					
				}
			}
		});
	});
});
console.log("Next NodeJS server started...");
console.log("Adress book file :"+fileAddressBook);
console.log("Wallet password file :"+fileWalletPassword);
process.on('uncaughtException', function(err)
{
  console.log('Caught exception: ' + err);
});
server.listen(argv.p || 3000);

console.log('Server running on port ' + (argv.p || 3000))