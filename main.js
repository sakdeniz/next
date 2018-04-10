var os = require("os");
var child = require('child_process').execFile;
var executablePath;
var daemonPath;
const dialog = require('electron').dialog;
const axios = require('axios');
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
var bshell=false;
//os.type(); // Linux, Darwin or Window_NT
//os.platform(); // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
var now = new Date(); 
var datetime = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+'-'+now.getHours()+'-'+now.getMinutes()+'-'+now.getSeconds(); 
const rpcuser = crypto.createHash('md5').update(datetime, 'utf8').digest('hex');
const rpcpassword = crypto.createHash('md5').update(datetime, 'utf8').digest('hex');
const config={headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
var server = require("./server");
var parameters = ["-rpcuser=" + rpcuser + " -rpcport=44445 -rpcpassword=" + rpcpassword + " -testnet -server -rpcbind=127.0.0.1 -addnode=46.4.24.136"];
console.log("Daemon Parameters : [" + parameters + "]");
if (os.platform()=="win32")
{
	executablePath="navcoind.exe";
	bshell=false;
}
if (os.platform()=="linux")
{
	executablePath="./navcoind";
	bshell=true;
}
if (os.platform()=="darwin")
{
	executablePath=app.getAppPath()+"/./navcoind";
	bshell=true;
}
console.log("App Path : "+app.getAppPath());
console.log("Shell : " + bshell);
console.log("Platform : " + os.platform());
const defaults = {cwd: undefined,env: process.env,shell:bshell,windowsVerbatimArguments:true};
var newProcess;
if (os.platform()=="linux" || os.platform()=="darwin")
{
	daemonPath=process.cwd()+"/navcoind";
	console.log("Setting daemon file as executable " + daemonPath);
	var chmodProcess = child("chmod +x " + daemonPath, null, defaults, function(err, data)
	{
		console.log(err)
		console.log(data.toString());
		newProcess = child(executablePath, parameters, defaults, function(err, data)
		{
			console.log(err)
			console.log(data.toString());
		});
		if (newProcess.pid!=undefined) console.log("Daemon started. PID :" + newProcess.pid); else console.log("Daemon start failed.");
		newProcess.on("exit", function ()
		{
			console.log("Daemon stopped.");
			win.destroy();
		});
	});
}
else
{
	newProcess = child(executablePath, parameters, defaults, function(err, data)
	{
		console.log(err)
		console.log(data.toString());
	});
	if (newProcess.pid!=undefined) console.log("Daemon started. PID :" + newProcess.pid); else console.log("Daemon start failed.");
    newProcess.on("exit", function ()
	{
		console.log("Daemon stopped.");
		win.destroy();
	});
}
let win

function createWindow ()
{
	win=new BrowserWindow({width: 1024, height: 800});
	//win.setFullScreen(true);
	win.setMenu(null);
	win.loadURL(`file://${__dirname}/dist/index.html?rpcpassword=${rpcpassword}`);
    //win.webContents.openDevTools();
	win.on('close', function (event) {
		event.preventDefault();
		console.log(newProcess);
		console.log("win.on -> close");
		axios.post('http://localhost:3000/stop',{token:rpcpassword},config).then(function(res)
		{
			console.log(res.data);
		}).catch(function(err)
		{
			console.log(err);
		})
	});
    win.on('closed', () => {
		console.log("win.on -> closed");
		win=null;
		app.exit();
    })
}
app.on('ready', createWindow)
app.on('browser-window-created',function(e,window)
{
	window.setMenu(null);
	console.log("app.on -> browser-window-created");
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
	{
		console.log("app.on -> window-all-closed");
		app.quit();
    }
})
app.on('activate', () => {
    if (win === null)
	{
		console.log("app.on -> activate");
		createWindow();
    }
})