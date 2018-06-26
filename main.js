//os.type(); // Linux, Darwin or Windows_NT
//os.platform(); // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
var os=require("os");
if (os.type==="Windows_NT") var child=require('child_process').spawn; else var child=require('child_process').execFile;
var child_ef=require('child_process').execFile;
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
//
var appDataPath;
var executablePath;
var daemonPath;
var rpcport;
var testnet;
var addnode;
var reindexchainstate;
var reindex;
var zapwallettxes;
var printtoconsole;
//
var bShell=false;
var bRepairWallet=false;
var bReindexChainState=false;
var bReindex=false;
var bTestnet=false;
var bError=true;
var bExit=true;
//
var now=new Date(); 
var datetime=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+'-'+now.getHours()+'-'+now.getMinutes()+'-'+now.getSeconds(); 
var warning;
var eWindow;
if (store.get('warning')) warning=store.get('warning'); else warning="1";
if (store.get('repair_wallet')=="1")
{
	store.set('repair_wallet', '0');
	bRepairWallet=true;
}
if (store.get('reindex')=="1")
{
	store.set('reindex', '0');
	bReindex=true;
}
if (store.get('reindex-chainstate')=="1")
{
	store.set('reindex-chainstate', '0');
	bReindexChainState=true;
}
console.log("OS Type : "+os.type());
console.log("Repair : "+bRepairWallet);
console.log("Reindex : "+bReindex);
console.log("Reindex Chainstate : "+bReindexChainState);
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
	appDataPath=process.env.HOME+"/.navcoin4";
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

function deleteFile(dir, file) {
	var fs=require('fs');
    return new Promise(function (resolve, reject) {
        var filePath = path.join(dir, file);
        fs.lstat(filePath, function (err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(deleteDirectory(filePath));
            } else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
}

function deleteDirectory(dir) {
return new Promise(function (resolve, reject) {
		var fs=require('fs');
        fs.access(dir, function (err) {
            if (err) {
                return reject(err);
            }
            fs.readdir(dir, function (err, files) {
                if (err) {
                    return reject(err);
                }
                Promise.all(files.map(function (file) {
                    return deleteFile(dir, file);
                })).then(function () {
                    fs.rmdir(dir, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                }).catch(reject);
            });
        });
    });
}

function getConfigFileFullPath()
{
	var configFile=appDataPath;
	if (os.type()==="Windows_NT") configFile+="\\";
	if (os.type()==="Darwin") configFile+="/";
	if (os.type()==="Linux") configFile+="/";
	configFile+="navcoin.conf";
	return configFile;
}

function RestartDaemon(network)
{
	bExit=false;
	console.log("Restart Daemon:"+network);
	try
	{
		var fs=require('fs');
		var iniBuilder=require('ini-builder');
		var data=iniBuilder.parse(fs.readFileSync(getConfigFileFullPath()));
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
		fs.writeFileSync(getConfigFileFullPath(), iniBuilder.serialize(data));
	}).catch(function(err)
	{
		console.log(err);
	})
}

function StartDaemon()
{
	var newProcess;
	console.log("Checking config file : " + getConfigFileFullPath());
	try
	{
		var conf=iniparser.parseSync(getConfigFileFullPath());
		console.log("Config file found.");
		console.log("Config file testnet variable :"+conf.testnet);
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
		console.log("Config file not found, creating...");
		var fs=require('fs');
		var fileContent="testnet=0\r\nstaking=0\r\ntxindex=0\r\naddressindex=0";
		try
		{
			fs.writeFileSync(getConfigFileFullPath(), fileContent);
			console.log("Config file created successfully.");
		}
		catch (e)
		{
			console.log("Cannot write file ", e);
		}
	}
	if (os.platform()=="win32")
	{
		executablePath="navcoind.exe";
		bShell=false;
		printtoconsole=" -printtoconsole";
	}
	if (os.platform()=="linux")
	{
		executablePath="./navcoind";
		bShell=true;
		printtoconsole="";
	}
	if (os.platform()=="darwin")
	{
		executablePath="./navcoind";
		bShell=true;
		printtoconsole="";
	}
	if (bReindex) reindex=" -reindex"; else reindex="";
	if (bReindexChainState) reindexchainstate=" -reindex-chainstate"; else reindexchainstate="";
	if (bRepairWallet) zapwallettxes=" -zapwallettxes=2"; else zapwallettxes="";
	var ntp="";
	//ntp=" -ntpservers=pool.ntp.org -ntpminmeasures=1";
	var parameters = ["-rpcuser=" + rpcuser + " -rpcport=" + rpcport +" -rpcpassword=" + rpcpassword + testnet + reindex + reindexchainstate + zapwallettxes + printtoconsole + " -server -rpcbind=127.0.0.1 -zmqpubrawblock=tcp://127.0.0.1:30000 -uacomment=NEXT"+addnode+ntp];
	console.log("Daemon Parameters : [" + parameters + "]");
	const defaults = {cwd:__dirname,env:process.env,shell:bShell,windowsVerbatimArguments:true};
	console.log("App Path : "+app.getAppPath());
	console.log("App Data Path : "+appDataPath);
	console.log("Shell : "+bShell);
	console.log("Platform : "+os.platform());
	console.log("Testnet : "+bTestnet);
	console.log("RPC Port : "+rpcport);
	if (os.platform()=="linux" || os.platform()=="darwin")
	{
		daemonPath=app.getAppPath()+"/navcoind";
		console.log("Setting daemon file as executable " + daemonPath);
		var buttons = ['OK', 'Cancel'];
		var chmodProcess=child_ef("chmod +x " + daemonPath, null, defaults, function(err, data)
		{
			newProcess=child(executablePath, parameters, defaults, function(err, data)
			{
				if (err)
				{
					bError=false;
					console.log(err);
					displayError("Daemon start failed",err.message);
				}
			});
			if (newProcess.pid!=undefined)
			{
				if (bExit==false)
				{
					win.loadURL(`file://${__dirname}/dist/index.html?rpcpassword=${rpcpassword}&rpcport=${rpcport}&warning=${warning}`);
				}
				bExit=true;
				console.log("Daemon started . PID :" + newProcess.pid);
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
				console.log(err);
				displayError("Daemon start failed",err.message);
			}
		});
		if (newProcess.pid!=undefined)
		{
			if (bExit==false)
			{
				win.loadURL(`file://${__dirname}/dist/index.html?rpcpassword=${rpcpassword}&rpcport=${rpcport}&warning=${warning}`);
			}
			bExit=true;
			console.log("Daemon started [win32]. PID :" + newProcess.pid);
			if (!win) createMainWindow();
			newProcess.on("exit", function ()
			{
				console.log("Daemon stopped.");
				setTimeout(CloseApp, 1000);
			});
			newProcess.stdout.on('data', (data) =>
			{
				console.log(data.toString());
			});
		}
		else
		{
			console.log("Daemon start failed.");
		}
	}
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, rep) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), rep);
}

function displayError(title,message)
{
   	var shell=require('electron').shell;
	message=replaceAll(message,"\r", "<br>");
	message=replaceAll(message,"\n", "<br>");
	eWindow=new BrowserWindow({width: 800, height: 600});
	eWindow.webContents.on('console-message', function(level,message ,line ,sourceId)
	{
		if (line=="next:close")
		{
			app.exit();
		}
		if (line=="next:reindex")
		{
			store.set('reindex', '1');
			app.exit();
		}
		if (line=="next:reindex-chainstate")
		{
			store.set('reindex-chainstate', '1');
			app.exit();
		}
		if (line=="next:reset-data")
		{
			var Directory=appDataPath;
			//
			if (os.type()==="Windows_NT") Directory+="\\";
			if (os.type()==="Darwin") Directory+="/";
			if (os.type()==="Linux") Directory+="/";
			//
			if (bTestnet)
			{
				Directory+="testnet3";
				if (os.type()==="Windows_NT") Directory+="\\";
				if (os.type()==="Darwin") Directory+="/";
				if (os.type()==="Linux") Directory+="/";
			}
			//
			console.log("Removing blockchain data folder : " + Directory);
			deleteDirectory(Directory+"database");
			deleteDirectory(Directory+"chainstate");
			deleteDirectory(Directory+"cfund");
			deleteDirectory(Directory+"blocks");
			eWindow.webContents.executeJavaScript(`swal({type: 'success',title: 'Reset Blockchain Data',text: "Your blockchain data successfully removed."});`);
		}
	});
	eWindow.loadURL(`file://${__dirname}/dist/static/error.html`);
	eWindow.webContents.on('did-finish-load', ()=>{eWindow.webContents.executeJavaScript(`document.getElementById('error').innerHTML='`+message+`';`);});
	eWindow.webContents.on('new-window', function(event, url)
	{
		event.preventDefault();
		shell.openExternal(url);
	});
}

function CloseApp ()
{
	if(bError && bExit)
	{
		win.destroy();
	}
	else if (!bExit)
	{
		StartDaemon();
	}
}

function closeDaemon()
{
	win.webContents.executeJavaScript(`swal({onOpen: () => {swal.showLoading()},allowOutsideClick:false,text: 'Please wait...'});`);
	axios.post('http://localhost:3000/stop',{token:rpcpassword,rpcport:rpcport},config).then(function(res)
	{
		console.log(res.data);
	}).catch(function(err)
	{
		console.log(err);
	})
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
		if (line=="next:network:mainnet") RestartDaemon("mainnet");
		if (line=="next:network:testnet") RestartDaemon("testnet");
		if (line=="next:open-data-folder")
		{
			var path=appDataPath;
			console.log("Open data folder:"+path);
			shell.openItem(`${path}`);
		}
		if (line=="next:repair-wallet")
		{
			store.set('repair_wallet', '1');
			closeDaemon();
		}
		if (line=="next:disable-warning") store.set('warning', '0');
		if (line=="next:backup-wallet")
		{
			var savepath=dialog.showSaveDialog({title:'Backup Wallet',defaultPath:'~/wallet.dat'});
			if (savepath)
			{
				axios.post('http://localhost:3000/backupwallet',{token:rpcpassword,rpcport:rpcport,savepath:savepath},config).then(function(res)
				{
					if (res.data==null)
					{
						win.webContents.executeJavaScript(`swal({type: 'success',title: 'Backup Wallet',text: "Your wallet has been successfully backed up."});`);
					}
					else
					{
						win.webContents.executeJavaScript(`swal({type: 'warning',title: 'Oops...',text: '` + res.data["error"]["message"]+`'});`);
					}
				}).catch(function(err)
				{
					win.webContents.executeJavaScript(`swal({type: 'warning',title: 'Oops...',text: '` + err+`'});`);
				})
			}
		}
		if (line=="next:import-wallet")
		{
			var walletpath=dialog.showOpenDialog({properties: ['openFile']});
			if (walletpath)
			{
				axios.post('http://localhost:3000/importwallet',{token:rpcpassword,rpcport:rpcport,walletpath:walletpath[0]},config).then(function(res)
				{
					if (res.data==null)
					{
						win.webContents.executeJavaScript(`swal({type: 'success',title: 'Backup Wallet',text: "Your wallet has been imported successfully."});`);
					}
					else
					{
						win.webContents.executeJavaScript(`swal({type: 'warning',title: 'Oops...',text: '` + res.data["error"]["message"]+`'});`);
					}
				}).catch(function(err)
				{
					win.webContents.executeJavaScript(`swal({type: 'warning',title: 'Oops...',text: '` + err+`'});`);
				})
			}
		}
	});
	//win.webContents.openDevTools();
	win.on('close', function (event)
	{
		event.preventDefault();
		console.log("win.on -> close");
		closeDaemon();
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
    //console.log(error);
});