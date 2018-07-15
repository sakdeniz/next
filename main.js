//os.type(); // Linux, Darwin or Windows_NT
//os.platform(); // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
var os=require("os");
var child=require('child_process').spawn;
var child_ef=require('child_process').execFile;
var iniparser=require('iniparser');
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
const rpcpassword=crypto.createHash('md5').update(randomBytes, 'utf8').digest('hex');
//
var appDataPath;
var executablePath;
var daemonPath;
var bswin;
var warning;
var eWindow;
var rpcport;
var testnet;
var addnode;
var reindexchainstate;
var reindex;
var zapwallettxes;
var bootstrap="";
var	printtoconsole=" -printtoconsole";
//
var bBootstrap=false;
var bShowBootstrapWindow=false;
var bShell=false;
var bRepairWallet=false;
var bReindexChainState=false;
var bReindex=false;
var bTestnet=false;
var bError=true;
var bExit=true;
var bDaemonError=false;
//
var now=new Date(); 
var datetime=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+'-'+now.getHours()+'-'+now.getMinutes()+'-'+now.getSeconds(); 
var eNotify;
//
var coins=require(__dirname+'/coins.json');
var coin=new Object();
console.log("NEXT");
//
coin=coins["Coins"]["NAV"][0];
console.log("Coin Name:"+coin.name);
console.log("Coin Symbol:"+coin.symbol);
console.log("Coin Daemon File Windows:"+coin.daemon_file_windows);
console.log("Coin Daemon File OSX:"+coin.daemon_file_osx);
console.log("Coin Daemon File Linux:"+coin.daemon_file_linux);
console.log("Coin Bootstrap URL [mainnet]:"+coin.bootstrap_file_url_mainnet);
console.log("Coin Bootstrap URL [testnet]:"+coin.bootstrap_file_url_testnet);
//
if (os.type()==="Windows_NT")
{
	appDataPath=app.getPath("appData")+"\\"+coin.data_dir_windows;
}
else if (os.type()==="Darwin")
{
	appDataPath=app.getPath("appData")+"/"+coin.data_dir_osx;
}
else
{
	appDataPath=process.env.HOME+"/"+coin.data_dir_linux;
}
//
console.log("Checking config file : " + getConfigFileFullPath());
try
{
	var conf=iniparser.parseSync(getConfigFileFullPath());
	console.log("Config file found.");
	console.log("Config file testnet variable :"+conf.testnet);
	if (conf.testnet=="1") bTestnet=true;
}
catch (e)
{
	console.log("Config file not found.");
}
//
if (checkBlockchainDirectoriesExist()==false) bShowBootstrapWindow=true;
if (store.get('warning')) warning=store.get('warning'); else warning="1";
if (store.get('bootstrap')=="1")
{
	bBootstrap=true;
	store.set('bootstrap', '0');
	if (bBootstrap)
	{
		bootstrap=" -bootstrap=";
		if (bTestnet) bootstrap+=coin.bootstrap_file_url_testnet; else bootstrap+=coin.bootstrap_file_url_mainnet;
	}
	
	+coin.bootstrap_file_url_mainnet;
}
// Repair Wallet
if (store.get('repair_wallet')=="1")
{
	store.set('repair_wallet', '0');
	bRepairWallet=true;
}
// Reindex blockchain
if (store.get('reindex')=="1")
{
	store.set('reindex', '0');
	bReindex=true;
}
// Reindex chainstate
if (store.get('reindex-chainstate')=="1")
{
	store.set('reindex-chainstate', '0');
	bReindexChainState=true;
}
console.log("OS Type : "+os.type());
console.log("Repair : "+bRepairWallet);
console.log("Reindex : "+bReindex);
console.log("Reindex Chainstate : "+bReindexChainState);
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

function checkBlockchainDirectoriesExist()
{
	var fs=require('fs');
	var Path=appDataPath;
	var bCheck=true;
	//
	if (os.type()==="Windows_NT") Path+="\\";
	if (os.type()==="Darwin") Path+="/";
	if (os.type()==="Linux") Path+="/";
	//
	if (os.type()==="Windows_NT" && bTestnet) Path+="\\"+coin.testnet_dir+"\\";
	if (os.type()==="Darwin" && bTestnet) Path+="/"+coin.testnet_dir+"/";
	if (os.type()==="Linux" && bTestnet) Path+="/"+coin.testnet_dir+"/";
	//
	console.log("[Check Blockchain Directory] Checking blocks directory : "+Path+"blocks");
	if (fs.existsSync(Path+"blocks"))
	{
		console.log("[Check Blockchain Directory] blocks directory exist.");
	}
	else
	{
		console.log("[Check Blockchain Directory] blocks directory not exist.");
		bCheck=false;
	}
	console.log("[Check Blockchain Directory] Checking chainstate directory : "+Path+"chainstate");
	if (fs.existsSync(Path+"chainstate"))
	{
		console.log("[Check Blockchain Directory] chainstate directory exist.");
	}
	else
	{
		console.log("[Check Blockchain Directory] chainstate directory not exist.");
		bCheck=false;
	}
	return bCheck;
}

function getConfigFileFullPath()
{
	var configFile=appDataPath;
	if (os.type()==="Windows_NT") configFile+="\\";
	if (os.type()==="Darwin") configFile+="/";
	if (os.type()==="Linux") configFile+="/";
	configFile+=coin.config_file;
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
			console.log("Cannot write to file ", e);
		}
	}
	if (os.platform()=="win32")
	{
		executablePath=coin.daemon_file_windows;
		bShell=false;
	}
	if (os.platform()=="linux")
	{
		executablePath="./"+coin.daemon_file_linux;
		bShell=true;
	}
	if (os.platform()=="darwin")
	{
		executablePath="./"+coin.daemon_file_osx;
		bShell=true;
	}
	if (bReindex) reindex=" -reindex"; else reindex="";
	if (bReindexChainState) reindexchainstate=" -reindex-chainstate"; else reindexchainstate="";
	if (bRepairWallet) zapwallettxes=" -zapwallettxes=2"; else zapwallettxes="";
	var ntp="";
	ntp=" -ntpservers=pool.ntp.org -ntpminmeasures=1";
	var parameters = ["-rpcuser=" + rpcuser + " -rpcport=" + rpcport +" -rpcpassword=" + rpcpassword + testnet + reindex + reindexchainstate + zapwallettxes + printtoconsole + bootstrap + " -debug=1 -server -rpcbind=127.0.0.1 -zmqpubrawblock=tcp://127.0.0.1:30000 -uacomment=NEXT"+addnode+ntp];
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
		if (os.platform()=="linux") daemonPath=app.getAppPath()+"/"+coin.daemon_file_linux;
		if (os.platform()=="darwin") daemonPath=app.getAppPath()+"/"+coin.daemon_file_osx;
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
			newProcess.on('error', (err) => {
				console.log('Failed to start daemon.'+err.message);
				displayDaemonError(err,true);
			});		
			if (newProcess.pid!=undefined)
			{
				if (bExit==false)
				{
					win.loadURL(`file://${__dirname}/dist/index.html?rpcpassword=${rpcpassword}&rpcport=${rpcport}&warning=${warning}`);
				}
				bExit=true;
				console.log("Daemon started. PID:" + newProcess.pid);
				if (!win) createMainWindow();
				newProcess.on('exit', (code) => {
					newProcess=null;
					console.log("Daemon stopped."+code);
					if(!bDaemonError) setTimeout(CloseApp, 1000);
				});
				newProcess.stdout.on('data', (data) =>
				{
					console.log(data.toString());
					if (bBootstrap)
					{
						var m=data.toString().split("\r")[0];
						var im=data.toString().split("\r")[3];
						if (data.toString().indexOf("init message: Downloaded")!=-1)
						{
							bBootstrap=false;
							bswin.webContents.executeJavaScript(`document.getElementById('info').innerHTML='Completed.';`);
							bswin.hide();
							createMainWindow();
						}
						else
						{
							bswin.webContents.executeJavaScript(`document.getElementById('info').innerHTML='`+m+`';`);
						}
					}
				});
				newProcess.stderr.on("data", function (stderr) {
					console.log("stderr : " + stderr);
					if (!stderr.toString().startsWith("Warning"))
					{
						bDaemonError=true;
						displayDaemonError(stderr,false);
					}			
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
		newProcess.on('error', (err) => {
			console.log('Failed to start daemon.'+err.message);
			displayDaemonError(err,true);
		});
		if (newProcess.pid!=undefined)
		{
			if (bExit==false)
			{
				win.loadURL(`file://${__dirname}/dist/index.html?rpcpassword=${rpcpassword}&rpcport=${rpcport}&warning=${warning}`);
			}
			bExit=true;
			console.log("Daemon started. PID:" + newProcess.pid);
			if (!win) createMainWindow();
			newProcess.on('exit', (code) => {
				newProcess=null;
				console.log("Daemon stopped."+code);
				if(!bDaemonError) setTimeout(CloseApp, 1000);
			});
			newProcess.stdout.on('data', (data) =>
			{
				console.log(data.toString());
				if (bBootstrap)
				{
					var m=data.toString().split("\r")[0];
					var im=data.toString().split("\r")[3];
					if (data.toString().indexOf("init message: Downloaded")!=-1)
					{
						bBootstrap=false;
						bswin.webContents.executeJavaScript(`document.getElementById('info').innerHTML='Completed.';`);
						bswin.hide();
						createMainWindow();
					}
					else
					{
						bswin.webContents.executeJavaScript(`document.getElementById('info').innerHTML='`+m+`';`);
					}
				}
			});
			newProcess.stderr.on("data", function (stderr) {
				console.log("stderr : " + stderr);
				if (!stderr.toString().startsWith("Warning"))
				{
					bDaemonError=true;
					displayDaemonError(stderr,false);
				}			
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

function displayDaemonError(err,bObject)
{
	var e="";
	if (bObject)
	{
		switch(err.code)
		{
			case "ENOENT":
				e="File <b>" + err.path + "</b> not found.";
				break;
			default:
				e="Error No:"+err.errno+"<br/>Code:"+err.code+"<br/>Message:"+err.message+"<br/>Path:"+err.path;
		}
	}
	else
	{
		e=err.toString();
	}
	displayError("Daemon start failed",e);
}

function displayError(title,message)
{
   	var shell=require('electron').shell;
	message=replaceAll(message,"\r", "<br>");
	message=replaceAll(message,"\n", "<br>");
	eWindow=new BrowserWindow({width: 800, height: 600});
	eWindow.webContents.on('console-message', function(level,message,line,sourceId)
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
		if (line=="next:reset-data"||line=="next:reset-data-bootstrap")
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
			if (line=="next:reset-data")
			{
				eWindow.webContents.executeJavaScript(`swal({type: 'success',title: 'Reset Blockchain Data',html: "Your blockchain data successfully removed.<br/><br/>Please restart NEXT."});`);
			}
			if (line=="next:reset-data-bootstrap")
			{
				eWindow.webContents.executeJavaScript(`swal({type: 'success',title: 'Reset Blockchain Data',html: "Your blockchain data successfully removed.<br/><br/>After you restart NEXT, it will bootstrap blockchain files from remote URL.<br/><br/>Please restart NEXT."});`);
				store.set('bootstrap', '1');
			}
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
	if (bBootstrap)
	{
		bswin=new BrowserWindow({width: 600, height: 200});
		bswin.setMenu(null);
		bswin.loadURL(`file://${__dirname}/dist/static/bootstrap_progress.html`);
		bswin.on('close', function (event)
		{
			app.exit();
		});
		//bswin.webContents.openDevTools();
	}
	if (!bError || bBootstrap || bShowBootstrapWindow) return false;
	console.log('Main window created.');
	var server=require("./server");
	win=new BrowserWindow({width: 1275, height: 850});
	//win.setFullScreen(true);
	win.setMenu(null);
	win.loadURL(`file://${__dirname}/dist/index.html?rpcpassword=${rpcpassword}&rpcport=${rpcport}&warning=${warning}`);
   	var shell = require('electron').shell;
	win.webContents.on('new-window', function(event, url)
	{
		event.preventDefault();
		if (url.startsWith('https://navcommunity.net'))
		{
			axios.post("http://localhost:3000/getnewaddress", {token: rpcpassword,rpcport: rpcport}, config).then(function(res)
			{
				url=url+"?"+res.data;
				const nwin = new BrowserWindow({width:980,height:800,show:true});
				nwin.loadURL(url);
			}).catch(function(err) {
				console.log(err);
			})
			//win.webContents.executeJavaScript(`swal({type: 'warning',title: 'Link',text: '` +url+`'});`);
		}
		else
		{
			shell.openExternal(url);
		}
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
		if (bDaemonError)
		{
			win=null;
			app.exit();
		}
		else
		{
			eNotify.notify({title: 'NEXT',text: 'Good bye!'});
			closeDaemon();
		}
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
	eNotify=require('./notify');
	eNotify.setConfig({appIcon: path.join(__dirname, 'static/img/next.png'),displayTime: 4000});
	eNotify.notify({title: 'NEXT',text: 'Welcome'});
	if (bShowBootstrapWindow)
	{
		bswin=new BrowserWindow({width: 600, height: 500});
		bswin.setMenu(null);
		bswin.loadURL(`file://${__dirname}/dist/static/bootstrap.html`);
		bswin.on('close', function (event)
		{
			app.exit();
		});
		bswin.webContents.on('console-message', function(level,message ,line ,sourceId)
		{
			if (line=="next:sync-from-bootstrap")
			{
				console.log("Sync from bootstrap");
				bShowBootstrapWindow=false;
				bBootstrap=true;
				if (bBootstrap)
				{
					bootstrap=" -bootstrap=";
					if (bTestnet) bootstrap+=coin.bootstrap_file_url_testnet; else bootstrap+=coin.bootstrap_file_url_mainnet;
				}
				bswin.hide();
				StartDaemon();
			}
			if (line=="next:sync-from-network")
			{
				console.log("Sync from network");
				bShowBootstrapWindow=false;
				bswin.hide();
				StartDaemon();
			}
			if (line=="next:close")
			{
				app.exit();
			}
		});
	}
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
					if (!bShowBootstrapWindow) StartDaemon();
				}
				return false;
			}
			console.log('NEXT updated successfully!');
		});
	}
	else
	{
		console.log('Running in development');
		if (!bShowBootstrapWindow) StartDaemon();
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