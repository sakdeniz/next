var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var argv = require('minimist')(process.argv.slice(2));
var qs = require('querystring');
var server;
const crypto=require('crypto');
const Client = require('bitcoin-core');
const appDataPath=process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences/Navcoin4/' : '/var/local/NavCoin4/');
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
		var post=JSON.parse(body);
		const client = new Client({host:"localhost", port:post.rpcport,username:post.token,password:post.token});
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
				if (req.url=="/getaddressbook")
				{
					var fs=require('fs');
					var data=fs.readFileSync(fileAddressBook,'utf8');
					console.log(data);
					sendResponse(res, 200,data);
				}
				if (req.url=="/validateaddress")
				{
					console.log(post.address);
					client.validateAddress(post.address).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/sendtoaddress")
				{
					client.sendToAddress(post.to,post.amount,post.comment,post.commentto).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/createproposal")
				{
					console.log("Address :"+post.navcoinaddress+"\r\nAmount:"+post.amount+"\r\nDeadline:"+post.deadline+"\r\nDesc:"+post.desc);
					client.createproposal(post.navcoinaddress,post.amount,post.deadline,post.desc).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
				}
				if (req.url=="/proposalvote")
				{
					console.log("Hash:"+post.proposal_hash+"\r\nVote:"+post.vote_type);
					client.proposalvote(post.proposal_hash.toString(),post.vote_type.toString()).then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
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