//os.type(); // Linux, Darwin or Windows_NT
//os.platform(); // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
var os=require("os");
var child=require('child_process').execFile;
const dialog=require('electron').dialog;
const axios=require('axios');
const {app,BrowserWindow}=require('electron');
const isDev=require('electron-is-dev');
const path=require('path');
const url=require('url');
const crypto=require('crypto');
const Store=require('electron-store');
const store=new Store();
const config={headers: {'Content-Type': 'application/x-www-form-urlencoded'},responseType: 'text'};
const randomBytes=crypto.randomBytes(256);
const rpcuser=crypto.createHash('md5').update(randomBytes, 'utf8').digest('hex');
const rpcpassword = crypto.createHash('md5').update(randomBytes, 'utf8').digest('hex');
var iniparser=require('iniparser');
var appDataPath;
var executablePath;
var daemonPath;
var rpcport;
var testnet;
var addnode;
var reindexchainstate;
var bshell=false;
var breindexchainstate=false;
var bTestnet=false;
var bError=true;
var bExit=true;
var now=new Date(); 
var datetime=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+'-'+now.getHours()+'-'+now.getMinutes()+'-'+now.getSeconds(); 
var warning;
if (store.get('warning')) warning=store.get('warning'); else warning="1";
console.log("OS Type:"+os.type());
if (os.type()==="Windows_NT")
{
	appDataPath=app.getPath("appData")+"\\NavCoin4";
}
else if (os.type()==="Darwin")
{
	appDataPath=app.getPath("appData")+"/NavCoin4";
}
else
{
	appDataPath=app.getPath("appData")+"/NavCoin4";
}
require('electron-context-menu')({
	showInspectElement:false,
	labels: {
	cut: 'Cut',
	copy: 'Copy',
	paste: 'Paste',
	save: 'Save Image',
	copyLink: 'Copy Link',
	inspect: 'Inspect'
	},
	prepend: (params, browserWindow) => [{
		visible: params.mediaType === 'image'
	}]
});
let win;
if (bTestnet)
{
	rpcport=44445;
	testnet=" -testnet";
	addnode=" -addnode=37.148.210.7";
}
else
{
	rpcport=44444;
	testnet="";
	addnode="";
}
function RestartDaemon(network)
{
	bExit=false;
	console.log("Restart Daemon:"+network);
	try
	{
		var fs=require('fs');
		var iniBuilder=require('ini-builder');
		var data=iniBuilder.parse(fs.readFileSync(appDataPath+"\\navcoin.conf"));
	}
	catch (e)
	{
		console.log("Configuration file exception occured.")
	}
	axios.post('http://localhost:3000/stop',{token:rpcpassword,rpcport:rpcport},config).then(function(res)
	{
		console.log(res.data);
		if (network=="testnet")
		{
			rpcport=44445;
			testnet=" -testnet";
			addnode=" -addnode=46.4.24.136";
			try
			{
				if(iniBuilder.find(data, 'testnet'))
				{
					console.log("Config file testnet key exist, changing value to 1");
					iniBuilder.find(data, 'testnet').value = '1';
				}
				else
				{
					console.log("Config file testnet key not exist, creating...");
					data.push({
						path: ['testnet'],
						value: '1'
					});
				}
			}
			catch (e)
			{
				console.log("Configuration file exception occured.")
			}
		}
		if (network=="mainnet")
		{
			rpcport=44444;
			testnet="";
			addnode="";
			try
			{
				if(iniBuilder.find(data, 'testnet'))
				{
					console.log("Config file testnet key exist, changing value to 0");
					iniBuilder.find(data, 'testnet').value = '0';
				}
				else
				{
					console.log("Config file testnet key not exist, creating...");
					data.push({
						path: ['testnet'],
						value: '0'
					});
				}
			}
			catch (e)
			{
			}
		}
		fs.writeFileSync(appDataPath+"\\navcoin.conf", iniBuilder.serialize(data));
	}).catch(function(err)
	{
		console.log(err);
	})
}

function StartDaemon()
{
	var newProcess;
	try
	{
		var conf=iniparser.parseSync(appDataPath+"\\navcoin.conf");
		console.log("navcoin.conf file found.");
		console.log("Config.testnet:"+conf.testnet);
		if (conf.testnet=="1")
		{
			rpcport=44445;
			testnet=" -testnet";
			addnode=" -addnode=37.148.210.7";
			bTestnet=true;
		}
		else
		{
			rpcport=44444;
			testnet="";
			addnode="";
			bTestnet=false;
		}
	}
	catch (e)
	{
		console.log("navcoinf.conf file not found.");
	}
	if (breindexchainstate) reindexchainstate=" -reindex-chainstate"; else reindexchainstate="";
	var ntp="";
	//ntp=" -ntpservers=pool.ntp.org -ntpminmeasures=1";
	var parameters = ["-rpcuser=" + rpcuser + " -rpcport=" + rpcport +" -rpcpassword=" + rpcpassword + testnet + reindexchainstate + " -server -rpcbind=127.0.0.1 -debug -uacomment=NEXT"+addnode+ntp];
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
		executablePath="./navcoind";
		bshell=true;
	}
	const defaults = {cwd:__dirname,env:process.env,shell:bshell,windowsVerbatimArguments:true};
	console.log("App Path : "+app.getAppPath());
	console.log("App Data Path : "+appDataPath);
	console.log("Shell : "+bshell);
	console.log("Platform : "+os.platform());
	console.log("Testnet : "+bTestnet);
	console.log("RPC Port : "+rpcport);
	if (os.platform()=="linux" || os.platform()=="darwin")
	{
		daemonPath=app.getAppPath()+"/navcoind";
		console.log("Setting daemon file as executable " + daemonPath);
		var buttons = ['OK', 'Cancel'];
		var chmodProcess=child("chmod +x " + daemonPath, null, defaults, function(err, data)
		{
			newProcess=child(executablePath, parameters, defaults, function(err, data)
			{
				if (err)
				{
					bError=false;
					console.log(err)
					dialog.showMessageBox({ type: 'error', title:"Daemon failed", buttons: ['OK'], message: err.message }, function (buttonIndex)
					{
						win=null;
						app.exit();
					});
				}
			});
			if (newProcess.pid!=undefined)
			{
				if (bExit==false)
				{
					win.loadURL(`file://${__dirname}/dist/index.html?rpcpassword=${rpcpassword}&rpcport=${rpcport}&warning=${warning}`);
				}
				bExit=true;
				console.log("Daemon started. PID :" + newProcess.pid);
				if (!win) createMainWindow();
				newProcess.on("exit", function ()
				{
					newProcess=null;
					console.log("Daemon stopped.");
					setTimeout(CloseApp, 1000);
				});
			}
			else
			{
				console.log("Daemon start failed.");
			}
		});
	}
	else
	{
		newProcess=child(executablePath, parameters, defaults, function(err, data)
		{
			if (err)
			{
				bError=false;
				console.log(err)
				dialog.showMessageBox({ type: 'error', title:"Daemon failed",buttons: ['OK'], message: err.message }, function (buttonIndex)
				{
					win=null;
					app.exit();
				});
			}
		});
		if (newProcess.pid!=undefined)
		{
			if (bExit==false)
			{
				win.loadURL(`file://${__dirname}/dist/index.html?rpcpassword=${rpcpassword}&rpcport=${rpcport}&warning=${warning}`);
			}
			bExit=true;
			console.log("Daemon started. PID :" + newProcess.pid);
			if (!win) createMainWindow();
			newProcess.on("exit", function ()
			{
				console.log("Daemon stopped.");
				setTimeout(CloseApp, 1000);
			});
		}
		else
		{
			console.log("Daemon start failed.");
		}
	}
}

function CloseApp ()
{
	if(bError && bExit)
	{
		win.destroy();
	}
	else
	{
		StartDaemon();
	}
}

function createMainWindow ()
{
	if (!bError) return false;
	console.log('Main window created.');
	var server=require("./server");
	win=new BrowserWindow({width: 1275, height: 800});
	//win.setFullScreen(true);
	win.setMenu(null);
	win.loadURL(`file://${__dirname}/dist/index.html?rpcpassword=${rpcpassword}&rpcport=${rpcport}&warning=${warning}`);
   	var shell = require('electron').shell;
	win.webContents.on('new-window', function(event, url)
	{
		event.preventDefault();
		shell.openExternal(url);
		//const nwin = new BrowserWindow({width:800,height:600,show:true});
		//nwin.loadURL(url);
		//event.newGuest = nwin;
	});
    /*
	let $=require("jquery");
	win.webContents.on('did-finish-load', ()=>
	{
		win.webContents.executeJavaScript(`
    		$(document).on('click', 'a[class^="external"]', function(event) {
			event.preventDefault();
			shell.openExternal(this.href);
		});
		`);
    });*/
	win.webContents.on('console-message', function(level,message ,line ,sourceId)
	{
		//console.log('[CONSOLE]', "Level:"+level+" Message:"+message+" Line:"+line+" SourceId:"+sourceId);
		if (line=="mainnet" || line=="testnet") RestartDaemon(line);
		if (line=="next:open-data-folder")
		{
			var path=appDataPath;
			console.log("Open data folder:"+path);
			shell.openItem(`${path}`);
		}
		if (line=="next:disable-warning") store.set('warning', '0');
	});
	//win.webContents.openDevTools();
	win.on('close', function (event)
	{
		event.preventDefault();
		win.webContents.executeJavaScript(`swal({onOpen: () => {swal.showLoading()},allowOutsideClick:false,text: 'Please wait...'});`);
		console.log("win.on -> close");
		axios.post('http://localhost:3000/stop',{token:rpcpassword,rpcport:rpcport},config).then(function(res)
		{
			console.log(res.data);
		}).catch(function(err)
		{
			console.log(err);
		})
	});
    win.on('closed', () => {
		console.log("win.on -> closed");
		if(bError && bExit)
		{
			win=null;
			app.exit();
		}
    })
}
app.on('ready', () => {
	if (!isDev)
	{
		console.log('Running in production');
		const EBU=require('./updater');
		EBU.init({'api': 'https://next.navcommunity.net/update/'});
		EBU.check(function(error)
		{
			if(error)
			{
				if (error!="no_update_available")
				{
					const dialogOpts = {type: 'error',buttons: ['OK'],title: 'Application Update Failed',message: "Update Failed",detail: error}
					console.log('NEXT update error:'+error);
					dialog.showMessageBox(dialogOpts);
				}
				if (error=="no_update_available")
				{
					StartDaemon();
				}
				return false;
			}
			console.log('NEXT updated successfully!');
		});
	}
	else
	{
		console.log('Running in development');
		StartDaemon();
	}
});
app.on('browser-window-created',function(e,window)
{
	window.setMenu(null);
	console.log("app.on -> browser-window-created");
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin' && bExit)
	{
		console.log("app.on -> window-all-closed");
		if(bError) app.quit();
    }
})
app.on('activate', () => {
    if (win === null)
	{
		console.log("app.on -> activate");
		createMainWindow();
    }
})

process.on('uncaughtException', function (error) {
    console.log(error);
});