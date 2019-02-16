var fs=require('fs');
var url=require('url');
var path=require('path');
var http=require('http');
var argv=require('minimist')(process.argv.slice(2));
var qs=require('querystring');
var axios=require('axios');
var moment = require('moment');
var sb = require('satoshi-bitcoin');
var server;
const config={ headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, responseType: 'text' }
const bitcore = require('bitcore-lib') ;
const crypto=require('crypto');
const Client=require('bitcoin-core');
const stringifyObject=require('stringify-object');
var Mnemonic = require('bitcore-mnemonic');
var Message = require('bitcore-message');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

var ENCRYPTION_KEY;
const IV_LENGTH = 16; // For AES, this is always 16
const walletFileName='wallet.db';
const apiURL='https://navcommunity.net/api/lw/';
const network='dev';
var adapter;
var db;

function initWallet(password,res)
{
	console.log("Init Wallet");
	console.log("Password:"+password);
	ENCRYPTION_KEY=crypto.createHash('md5').update(password).digest("hex"); // Must be 256 bytes (32 characters)
	adapter=new FileSync(walletFileName, {serialize: (data) => encrypt(JSON.stringify(data)),deserialize: (data) => JSON.parse(decrypt(data))});
	db=low(adapter);
	var code = new Mnemonic(Mnemonic.Words.ENGLISH);
	db.defaults({addr:[],mnemonics:code.toString(),count:0}).write();
	generate(res);
}

function unlockWallet(password)
{
	console.log("Unlock Wallet");
	console.log("Password:"+password);
	ENCRYPTION_KEY=crypto.createHash('md5').update(password).digest("hex"); // Must be 256 bytes (32 characters)
	adapter=new FileSync(walletFileName, {serialize: (data) => encrypt(JSON.stringify(data)),deserialize: (data) => JSON.parse(decrypt(data))});
	db=low(adapter);
	if (db.getState()==false) return false; else return true;
}

function encrypt(text)
{
	try
	{
		let iv = crypto.randomBytes(IV_LENGTH);
		let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return iv.toString('hex') + ':' + encrypted.toString('hex');
		console.log("Encrypt");
	}
	catch (e)
	{
		console.log("Encryption failed.");
		return false;
	}
}

function decrypt(text)
{
	try
	{
		let textParts = text.split(':');
		let iv = new Buffer(textParts.shift(), 'hex');
		let encryptedText = new Buffer(textParts.join(':'), 'hex');
		let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		console.log("Decrypt");
		return decrypted.toString();
	}
	catch (e)
	{
		console.log("Decryption failed.");
		return false;
	}
}

  
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

function generate(res)
{
	code = new Mnemonic(db.get('mnemonics').value());
	var xpriv = code.toHDPrivateKey();
	var value = Buffer.from(code.toString());
	var hash = bitcore.crypto.Hash.sha256(value);
	var bn = bitcore.crypto.BN.fromBuffer(hash);
	var privateKey = new bitcore.PrivateKey(bn);
	var address = privateKey.toAddress();
	var exported = privateKey.toWIF();
	/*console.log("Mnemonics\r\n" + code);
	console.log("Private Key\r\n" + privateKey);
	console.log("HD Private Key\r\n" + xpriv);
	console.log("Public Address\r\n" + address);*/
	const addrExist = db
	.get('addr')
	.find({ publicAddress: address.toString() })
	.value()
	if (!addrExist)
	{
		db.get('addr')
		.push(
		{
			publicAddress: address.toString(),
			privateKey: privateKey.toWIF(),
			xpriv: xpriv.toString()
		})
		.write()
	}
	sendResponse(res,200,JSON.stringify(
	{
		"mnemonics":code.toString(),
		"address":address.toString(),
		"privateKey":privateKey.toWIF(),
		"xpriv":xpriv.toString(),
	}
	));
}

server=http.createServer(function (req, res)
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
		
		if (req.url=="/initwallet")
		{
			initWallet(post.password,res);
		}
		
		if (req.url=="/generate")
		{
			generate(res);
		}
		
		if (req.url=="/iswalletexist")
		{
			console.log("Checking wallet exist...");
			try
			{

				if (fs.existsSync(walletFileName))
				{
					console.log("Wallet exist.");
					sendResponse(res,200,JSON.stringify(
					{
						"exist":true,
					}));
				}
				else
				{
					console.log("Wallet not exist.");
					sendResponse(res,200,JSON.stringify(
					{
						"exist":false,
					}));
				}
			}
			catch(e)
			{
				console.log("Wallet not exist.");
				sendResponse(res,200,JSON.stringify(
				{
					"exist":false,
					"error":e
				}));
			}
		}

		if (req.url=="/unlockwallet")
		{
			console.log("Unlocking wallet...");
			retval=unlockWallet(post.password,res);
			sendResponse(res,200,JSON.stringify(
			{
				"isUnlocked":retval
			}));
		}
		
		if (req.url=="/sign")
		{
			console.log(post.message);
			console.log(post.privateKey);
			if (!post.message || !post.privateKey)
			{
				sendResponse(res,200,JSON.stringify({"error":true,"message":"Please enter a message and private key"}));
			}
			else
			{
				try
				{
					var privateKey = new bitcore.PrivateKey(post.privateKey);
					var message = new Message(post.message);
					var signature = message.sign(privateKey);
					console.log(signature.toString());
					sendResponse(res,200,JSON.stringify(
					{
						"error":false,
						"signature":signature.toString()
					}));
				}
				catch(err)
				{
					sendResponse(res,200,JSON.stringify(
					{
						"error":true,
						"errno":err.errno,
						"code":err.code,
						"path":err.path,
						"message":err.message
					}));
				}
			}
		}
		
		if (req.url=="/send")
		{
		    const publicAddress=db.get('addr').value()[0].publicAddress;
			axios.get(apiURL+'utxo', {
				params: {
				  network: network,
				  a: publicAddress
				}
			})
			.then(function (response)
			{
				var utxo=response.data;	  
			    try
				{
					console.log("To:"+post.to);
					console.log("Amount:"+post.amount);
					const publicAddress=db.get('addr').value()[0].publicAddress;
					const privateKey=db.get('addr').value()[0].privateKey;
					var tx = new bitcore.Transaction()
					.from(utxo)
					.to(post.to, parseInt(post.amount))
					.settime(moment().unix())
					.change(publicAddress)
					.sign(privateKey);
					console.log(tx.toObject());
					console.log(tx.serialize());
					axios.post(apiURL+'sendrawtransaction', "network="+network+"&a="+tx.serialize().toString(),config)
						.then((retval) => 
						sendResponse(res,200,JSON.stringify(
						{
							"hex":retval.data
						}
						))
						).catch((e) => {sendError(res, 200,e);})
				}
				catch(err)
				{
					sendResponse(res,200,JSON.stringify(
					{
						"error":true,
						"errno":err.errno,
						"code":err.code,
						"path":err.path,
						"message":err.message
					}
					));
				}
			})
			.catch(function (error)
			{
				console.log(error);
			})
			.then(function ()
			{
			});
		}

		if (req.url=="/createproposal")
		{
		    const publicAddress=db.get('addr').value()[0].publicAddress;
			axios.get(apiURL+'utxo', {
				params: {
					network: network,
					a: publicAddress
				}
			})
			.then(function (response)
			{
				var utxo=response.data;	 
				console.log(utxo);
			    try
				{
					var script = new bitcore.Script()
					.add('OP_RETURN')
					.add('OP_CFUND')
					var strdzeel='{\"n\":'+sb.toSatoshi(post.n)+',\"a\":\"'+post.a+'\",\"d\":'+post.d+',\"s\":\"'+post.s+'\",\"v\":'+post.v+'}';
					console.log("strdzeel:"+strdzeel);
					const publicAddress=db.get('addr').value()[0].publicAddress;
					const privateKey=db.get('addr').value()[0].privateKey;
					var tx=new bitcore.Transaction()
					.from(utxo)
					.addOutput(new bitcore.Transaction.Output({
						script: script,
						satoshis: sb.toSatoshi(50)
					}))
					.settime(moment().unix())
					.change(publicAddress)
					.setversion("4")
					.anondest(strdzeel)
					.sign(privateKey);
					console.log("-----------");
					console.log("TRANSACTION");
					console.log("-----------");
					console.log(tx.toObject());
					console.log("----------");
					console.log("SERIALIZED");
					console.log("----------");
					console.log(tx.serialize({disableSmallFees: true,disableMoreOutputThanInput:true}));
					console.log("-----------");
					axios.post(apiURL+'sendrawtransaction', "network="+network+"&a="+tx.serialize({disableSmallFees: true,disableMoreOutputThanInput:true}).toString(),config)
					.then((retval) =>
					{
						console.log(retval.data);
						sendResponse(res,200,JSON.stringify(
						{
							"hex":retval.data
						}))
					}
					).catch((e) => {sendError(res, 200,e);})
				}
				catch(err)
				{
					sendResponse(res,200,JSON.stringify(
					{
						"error":true,
						"errno":err.errno,
						"code":err.code,
						"path":err.path,
						"message":err.message
					}
					));
				}
			})
			.catch(function (error)
			{
				console.log(error);
			})
			.then(function ()
			{
			});
		}

		if (req.url=="/createpaymentrequest")
		{
		    const publicAddress=db.get('addr').value()[0].publicAddress;
			axios.get(apiURL+'utxo', {
				params: {
					network: network,
					a: publicAddress
				}
			})
			.then(function (response)
			{
				var randomString=moment().unix();
				var signString=randomString+"I kindly ask to withdraw "+sb.toSatoshi(post.n)+"NAV from the proposal "+post.h+". Payment request id: " + post.i;
				console.log("String");
				console.log("======");
				console.log(signString);

				var privateKey = bitcore.PrivateKey.fromWIF(db.get('addr').value()[0].privateKey.toString());
				var signature = Message(signString).sign(privateKey);
				console.log(signature.toString());
				var utxo=response.data;
				console.log(utxo);
			    try
				{
					var script = new bitcore.Script()
					.add('OP_RETURN')
					.add('OP_CFUND')
					var strdzeel='{\"h\":\"'+post.h+'\",\"n\":'+sb.toSatoshi(post.n)+',\"s\":\"'+signature.toString()+'\",\"r\":\"'+randomString+'\",\"i\":\"'+post.i+'\",\"v\":2}';
					console.log("strdzeel:"+strdzeel);
					const publicAddress=db.get('addr').value()[0].publicAddress;
					//const privateKey=db.get('addr').value()[0].privateKey;
					var tx=new bitcore.Transaction()
					.from(utxo)
					.addOutput(new bitcore.Transaction.Output({
						script: script,
						satoshis: 10000
					}))
					.settime(moment().unix())
					.change(publicAddress)
					.setversion("5")
					.anondest(strdzeel)
					.sign(privateKey);
					console.log("-----------");
					console.log("TRANSACTION");
					console.log("-----------");
					console.log(tx.toObject());
					console.log("----------");
					console.log("SERIALIZED");
					console.log("----------");
					console.log(tx.serialize({disableSmallFees: true,disableMoreOutputThanInput:true}));
					console.log("-----------");
					axios.post(apiURL+'sendrawtransaction', "network="+network+"&a="+tx.serialize({disableSmallFees: true,disableMoreOutputThanInput:true}).toString(),config)
					.then((retval) =>
					{
						console.log(retval.data);
						sendResponse(res,200,retval.data);
					}
					).catch((e) => {sendError(res, 200,e);})
				}
				catch(err)
				{
					sendResponse(res,200,JSON.stringify(
					{
						"error":true,
						"errno":err.errno,
						"code":err.code,
						"path":err.path,
						"message":err.message
					}
					));
				}
			})
			.catch(function (error)
			{
				console.log(error);
			})
			.then(function ()
			{
			});
		}
		
		if (req.url=="/listaddr")
		{
			const publicAddress=db.get('addr').value()[0].publicAddress;
			sendResponse(res,200,publicAddress.toString());
		}
		
		if (req.url=="/balance")
		{
 		    const publicAddress=db.get('addr').value()[0].publicAddress;
			axios.get(apiURL+'balance', {
				params: {
					network: network,
					a: publicAddress
				}
			})
			.then(function (response)
			{
				sendResponse(res,200,JSON.stringify(response.data));
				console.log(JSON.stringify(response.data));
			})
			.catch(function (error)
			{
				console.log(error);
			})
		    .then(function ()
			{
			});  
		}

		if (req.url=="/listproposals")
		{
 		    const publicAddress=db.get('addr').value()[0].publicAddress;
			axios.get(apiURL+'listproposals', {
				params: {
					network: network
				}
			})
			.then(function (response)
			{
				sendResponse(res,200,JSON.stringify(response.data));
				console.log(JSON.stringify(response.data));
			})
			.catch(function (error)
			{
				console.log(error);
			})
		    .then(function ()
			{
			});  
		}
		
				if (req.url=="/listpaymentrequests")
		{
 		    const publicAddress=db.get('addr').value()[0].publicAddress;
			axios.get(apiURL+'listpaymentrequests', {
				params: {
					network: network
				}
			})
			.then(function (response)
			{
				sendResponse(res,200,JSON.stringify(response.data));
				console.log(JSON.stringify(response.data));
			})
			.catch(function (error)
			{
				console.log(error);
			})
		    .then(function ()
			{
			});  
		}

		if (req.url=="/utxo")
		{
 		    const publicAddress=db.get('addr').value()[0].publicAddress;
			axios.get(apiURL+'utxo', {
				params: {
					network: network,
					a: publicAddress
				}
			})
			.then(function (response)
			{
				sendResponse(res,200,JSON.stringify(response.data));
				console.log(JSON.stringify(response.data));
			})
			.catch(function (error)
			{
				console.log(error);
			})
		    .then(function ()
			{
			});  
		}
				
		if (req.url=="/height")
		{
 		    const publicAddress=db.get('addr').value()[0].publicAddress;
			axios.get(apiURL+'blockcount', {
				params: {
					network: network,
					a: publicAddress
				}
			})
			.then(function (response)
			{
				sendResponse(res,200,JSON.stringify(response.data));
				console.log(JSON.stringify(response.data));
			})
			.catch(function (error)
			{
				console.log(error);
			})
		    .then(function ()
			{
			});  
		}
		
		if (req.url=="/verify")
		{
			if (!post.message || !post.address || !post.signature)
			{
				sendResponse(res,200,JSON.stringify({"error":true,"message":"Please enter a message, address and a signature"}));
			}
			else
			{
				try
				{
					var address = post.address;
					var signature = post.signature;
					var result = new Message(post.message).verify(address, signature);
					sendResponse(res,200,JSON.stringify(
					{
						"result":result
					}));
				}
				catch(err)
				{
					sendResponse(res,200,JSON.stringify(
					{
						"error":true,
						"errno":err.errno,
						"code":err.code,
						"path":err.path,
						"message":err.message
					}));
				}
			}
		}
	});
});
console.log("NEXT Light Wallet NodeJS Server started...");
console.log("Network : " + network);
if (network=="main")
{
	bitcore.Networks.defaultNetwork = bitcore.Networks.livenet;
}
else
{
	bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
}
process.on('uncaughtException', function(err)
{
  console.log('Caught exception: ' + err);
});
server.listen(argv.p || 3001);
console.log('Server running on port ' + (argv.p || 3001))