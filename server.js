var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var argv = require('minimist')(process.argv.slice(2));
var qs = require('querystring');
var server;
const Client = require('bitcoin-core');

function sendResponse(res, statusCode, body)
{
	res.writeHead(statusCode);
	res.write(body);
	res.end();
}

function sendError(res, statusCode, body)
{
	var obj={"error":body}; 
	console.log(body);
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
	console.log(req.url);
	req.on('data', function (data)
	{
		body+=data;
	});
	req.on('end', function ()
	{
		var post=JSON.parse(body);
		const client = new Client({host:"localhost", port: 44445,username:post.token,password:post.token});
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
			client.getBlockchainInfo().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
		}
		if (req.url=="/getinfo")
		{
			client.getInfo().then((retval) => sendResponse(res, 200,JSON.stringify(retval))).catch((e) => {sendError(res, 200,e);});
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
	});
});
console.log("Next NodeJS server started...");
process.on('uncaughtException', function(err)
{
  console.log('Caught exception: ' + err);
});
server.listen(argv.p || 3000);