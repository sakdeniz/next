//os.type(); // Linux, Darwin or Windows_NT
//os.platform(); // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
var os=require("os");
var child=require('child_process').spawn;
var child_ef=require('child_process').execFile;
var iniparser=require('iniparser');
var sb=require('satoshi-bitcoin');
var request=require('request');
var fs=require('fs');
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
const rpcuser=crypto.createHash('sha256').update(randomBytes, 'utf8').digest('hex');
const rpcpassword=crypto.createHash('md5').update(randomBytes, 'utf8').digest('hex');
const zmq=require('zeromq');
const bitcore=require('bitcore-lib'); // npm install encrypt-s/bitcore-lib
const clock=require('human-readable-time');
const printf=require('printf');
const sock=zmq.socket('sub');
const hrt=new clock('%D%/%M%/%YY% %hh%:%mm%:%ss%');
const Block=bitcore.Block;
const Transaction=bitcore.Transaction;
const portZMQ=30000;
const binDir="bin";
var appDataPath;
var executablePath;
var daemonPath;
var welcomeWin;
var downloadWin;
var eWindow;
var rpcport;
var testnet;
var addnode;
var reindexchainstate;
var reindex;
var zapwallettxes;
var bootstrap="";
var	printtoconsole=" -printtoconsole";
var bBootstrap=false;
var bShowBootstrapWindow=false;
var bShowWelcomeWindow=false;
var bShell=false;
var bRepairWallet=false;
var bReindexChainState=false;
var bReindex=false;
var bTestnet=false;
var bError=true;
var bExit=true;
var bDaemonError=false;
var now=new Date(); 
var datetime=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+'-'+now.getHours()+'-'+now.getMinutes()+'-'+now.getSeconds(); 
var eNotify;
var coins=require(__dirname+'/coins.json');
var coin=new Object();
console.log("NEXT");
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
sock.connect('tcp://127.0.0.1:'+portZMQ);
//sock.subscribe('hashblock');
//sock.subscribe('hashtx');
//sock.subscribe('rawblock');
//sock.subscribe('rawtx');
sock.on('message', (topic, message) => {
	if(topic=='rawtx')
	{
		var tx=new Transaction(message).toObject();
		tx.outputs.forEach(function(element)
		{
			if (element.script)
			{
				axios.post('http://localhost:3000/decodescript',{rpcuser:rpcuser,token:rpcpassword,rpcport:rpcport,script:element.script},config).then(function(res)
				{
					if (res.data.addresses!="undefined")
					{
						for(var k in res.data.addresses)
						{
							axios.post('http://localhost:3000/validateaddress',{rpcuser:rpcuser,token:rpcpassword,rpcport:rpcport,address:res.data.addresses[k]},config).then(function(res)
							{
								if (res.data.ismine==true)
								{
									eNotify.notify({title: 'Incoming Transaction',text: sb.toBitcoin(element.satoshis)+ " "+coin.symbol});
								}
							}).catch(function(err)
							{
								console.log(err);
							})
						}
					}
				}).catch(function(err)
				{
					console.log(err);
				})
			}
		});
	}
});
let win;
if (!fs.existsSync(binDir))
{
    console.log("Bin directory not found, creating...");
	fs.mkdirSync(binDir);
}
//
//store.clear();
//store.delete('coin');
//store.set('update_preference',"3");
//console.log("Update Preference:"+store.get('update_preference'));
function showDownloadWindow()
{
	downloadWin=new BrowserWindow({width: 700, height: 200});
	downloadWin.setMenu(null);
	downloadWin.loadURL(`file://${__dirname}/dist/static/download.html`);
	downloadWin.on('close', function (event)
	{
		app.exit();
	});
}

function updateGlobals()
{
	global.coin=coin;
	global.assetDataPath=process.env.APPDATA ? process.env.APPDATA+"\\"+coin.data_dir_windows+"\\" : (process.platform == 'darwin' ? process.env.HOME+'/Library/Application Support/'+coin.data_dir_osx+'/' : process.env.HOME+'/'+coin.data_dir_linux+'/');
	global.fileConfig=global.assetDataPath+coin.config_file;
	global.fileAddressBook=global.assetDataPath+"addressbook.dat";
}

function Init(bStartDaemon)
{
	bBootstrap=false;
	bootstrap="";
	console.log("Name:"+coin.name);
	console.log("Symbol:"+coin.symbol);
	console.log("Daemon File Windows:"+coin.daemon_file_windows);
	console.log("Daemon File OSX:"+coin.daemon_file_osx);
	console.log("Daemon File Linux:"+coin.daemon_file_linux);
	console.log("Data Path:"+global.assetDataPath);
	console.log("Bootstrap URL [mainnet]:"+coin.bootstrap_file_url_mainnet);
	console.log("Bootstrap URL [testnet]:"+coin.bootstrap_file_url_testnet);
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
	if (checkBlockchainDirectoriesExist()==false && store.get('bootstrap')!="1") bShowBootstrapWindow=true;
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
	console.log("Bootstrap : "+store.get('bootstrap'));
	if (bStartDaemon)
	{
		if (bTestnet)
		{
			rpcport=coin.rpc_port_testnet;
			testnet=" -testnet";
			addnode=" -addnode=37.148.210.7";
		}
		else
		{
			rpcport=coin.rpc_port_mainnet;
			testnet="";
			addnode="";
		}
	}
	else
	{
		rpcport=coin.rpc_port_mainnet;
		testnet="";
		addnode="";
	}
	if (bShowBootstrapWindow && !win)
	{
		Bootstrap();
	}
	if ((store.get('bootstrap')=="1") && coin.bool_support_bootstrap=="1")
	{
		console.log("Bootstrapping...");
		bBootstrap=true;
		bShowBootstrapWindow=false;
		store.set('bootstrap', '0');
		bootstrap=" -bootstrap=";
		if (bTestnet) bootstrap+=coin.bootstrap_file_url_testnet; else bootstrap+=coin.bootstrap_file_url_mainnet;
	}
	else
	{
		if (bStartDaemon)
		{
			console.log("Starting daemon...");
			bBootstrap=false;
			bShowBootstrapWindow=false;
			StartDaemon();
		}
	}
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
	bBootstrap=false;
	bootstrap="";
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
	axios.post('http://localhost:3000/stop',{rpcuser:rpcuser,token:rpcpassword,rpcport:rpcport},config).then(function(res)
	{
		console.log(res.data);
		if (network=="testnet")
		{
			rpcport=coin.rpc_port_testnet;
			testnet=" -testnet";
			addnode=" -addnode=37.148.210.7";
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
			rpcport=coin.rpc_port_mainnet;
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
					data.push({path: ['testnet'],value: '0'});
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

function downloadFile(file_url,targetPath){
    var received_bytes = 0;
    var total_bytes = 0;
    var req = request({
        method: 'GET',
        uri: file_url
    });
    var out = fs.createWriteStream(targetPath);
    req.pipe(out);
    req.on('response', function ( data ) {
        total_bytes = parseInt(data.headers['content-length']);
    });
    req.on('data', function(chunk) {
        received_bytes += chunk.length;
        showProgress(received_bytes, total_bytes);
    });
    req.on('end', function() {
        downloadWin.hide();
		console.log("Daemon file succesfully downloaded...");
        console.log("Starting daemon...");
		out.end();
		setTimeout(function() {StartDaemon();},3000);
    });
}

function showProgress(received,total){
    var percentage = (received * 100) / total;
    console.log(percentage.toFixed(2) + "% | " + received + " bytes out of " + total + " bytes.");
	downloadWin.webContents.executeJavaScript(`document.getElementById('info').innerHTML='`+percentage.toFixed(2) + `% | ` + received + ` bytes out of ` + total + ` bytes downloaded.`+`';`);
}

function StartDaemon()
{
	console.log("Checking config file : " + getConfigFileFullPath());
	try
	{
		var conf=iniparser.parseSync(getConfigFileFullPath());
		console.log("Config file found.");
		console.log("Config file testnet variable :"+conf.testnet);
		if (conf.testnet=="1")
		{
			rpcport=coin.rpc_port_testnet;
			testnet=" -testnet";
			addnode=" -addnode=37.148.210.7";
			bTestnet=true;
		}
		else
		{
			rpcport=coin.rpc_port_mainnet;
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
		executablePath=binDir+"\\"+coin.daemon_file_windows;
		var daemonBinaryFileName=coin.daemon_file_windows;
		bShell=false;
	}
	if (os.platform()=="linux")
	{
		executablePath=binDir+"/./"+coin.daemon_file_linux;
		var daemonBinaryFileName=coin.daemon_file_linux;
		bShell=true;
	}
	if (os.platform()=="darwin")
	{
		executablePath=binDir+"/./"+coin.daemon_file_osx;
		var daemonBinaryFileName=coin.daemon_file_osx;
		bShell=true;
	}
	var fs=require('fs');
	if (!fs.existsSync(executablePath))
	{
		showDownloadWindow();
		const downloadURL="http://next.navcommunity.net/update/bin/"+os.platform()+"/"+daemonBinaryFileName;
		console.log("Daemon binary not found : " + executablePath);
		console.log("Downloading from : " + downloadURL);
		downloadFile(downloadURL,executablePath);
	}
	else
	{
		const daemon_local_md5=crypto.createHash('md5').update(fs.readFileSync(executablePath)).digest('hex');
		console.log("Checking remote md5 of "+daemonBinaryFileName+"("+os.platform()+")");
		console.log("Local Daemon md5  :"+daemon_local_md5);
		axios.get('http://next.navcommunity.net/update/bin/get_daemon_bin_md5.php', {params: {platform: os.platform(),filename:daemonBinaryFileName}}).then(function(res)
		{
			const daemon_remote_md5=res.data;
			console.log("Remote Daemon md5 :"+daemon_remote_md5);
			if (daemon_local_md5==daemon_remote_md5)
			{
				console.log("Daemon version up to date.");
				startProcess();
			}
			else
			{
				showDownloadWindow();
				console.log("Daemon versions different, downloading new version from remote...")
				const downloadURL="http://next.navcommunity.net/update/bin/"+os.platform()+"/"+daemonBinaryFileName;
				console.log("Downloading from : " + downloadURL);
				downloadFile(downloadURL,executablePath);
				return;
			}
		}).catch(function(err)
		{
			startProcess();
			console.log(err);
		})
	}
}

function startProcess()
{
	if (bReindex) reindex=" -reindex"; else reindex="";
	if (bReindexChainState) reindexchainstate=" -reindex-chainstate"; else reindexchainstate="";
	if (bRepairWallet) zapwallettxes=" -zapwallettxes=2"; else zapwallettxes="";
	var ntp="";
	var zmq="";
	zmq=" -zmqpubrawblock=tcp://127.0.0.1:30000 -zmqpubrawtx=tcp://127.0.0.1:30000 -zmqpubhashblock=tcp://127.0.0.1:30000 -zmqpubhashtx=tcp://127.0.0.1:30000";
	ntp=" -ntpservers=pool.ntp.org -ntpminmeasures=1";
	var parameters = ["-rpcuser=" + rpcuser + " -rpcport=" + rpcport +" -rpcpassword=" + rpcpassword + testnet + reindex + reindexchainstate + zapwallettxes + printtoconsole + bootstrap + zmq + " -debug=0 -server -rpcbind=127.0.0.1 -uacomment=NEXT"+addnode+ntp];
	console.log("Daemon Parameters : [" + parameters + "]");
	const defaults = {cwd:__dirname,env:process.env,shell:bShell,windowsVerbatimArguments:true};
	console.log("App Path : "+app.getAppPath());
	console.log("App Data Path : "+appDataPath);
	console.log("Shell : "+bShell);
	console.log("Platform : "+os.platform());
	console.log("Testnet : "+bTestnet);
	console.log("RPC Port : "+rpcport);
	var newProcess;
	if (os.platform()=="linux" || os.platform()=="darwin")
	{
		if (os.platform()=="linux") daemonPath=app.getAppPath()+"/"+binDir+"/"+coin.daemon_file_linux;
		if (os.platform()=="darwin") daemonPath=app.getAppPath()+"/"+binDir+"/"+coin.daemon_file_osx;
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
					win.loadURL(`file://${__dirname}/dist/index.html?rpcuser=${rpcuser}&rpcpassword=${rpcpassword}&rpcport=${rpcport}&coin=`+JSON.stringify(coin));
				}
				bExit=true;
				console.log("Daemon started. PID:" + newProcess.pid);
				if (!win) createMainWindow();
				newProcess.on('exit', (code) => {
					newProcess=null;
					console.log("Daemon stopped. Exit Code : "+code);
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
				win.loadURL(`file://${__dirname}/dist/index.html?rpcuser=${rpcuser}&rpcpassword=${rpcpassword}&rpcport=${rpcport}&coin=`+JSON.stringify(coin));
			}
			bExit=true;
			console.log("Daemon started. PID:" + newProcess.pid);
			if (!win) createMainWindow();
			newProcess.on('exit', (code) => {
				newProcess=null;
				console.log("Daemon stopped. Exit Code : "+code);
				if(!bDaemonError) setTimeout(CloseApp, 1000);
			});
			newProcess.stdout.on('data', (data) =>
			{
				console.log(data.toString());
				if (bBootstrap)
				{
					var m=data.toString().split("\r")[0];
					if (data.toString().indexOf("init message: Downloaded")!=-1)
					{
						bBootstrap=false;
						bswin.webContents.executeJavaScript(`document.getElementById('info').innerHTML='Completed.';`);
						bswin.hide();
						createMainWindow();
					}
					if (data.toString().indexOf("init message: [BOOTSTRAP] Downloaded")!=-1)
					{
						bswin.webContents.executeJavaScript(`document.getElementById('info').innerHTML='Downloading... `+m.split(" ")[2]+"/"+m.split(" ")[4]+" "+m.split(" ")[6]+`';`);
					}
					if (m1.indexOf("[UNTAR] Extracting from")!=-1)
					{
						bswin.webContents.executeJavaScript(`document.getElementById('info').innerHTML='Extracting blockchain files...';`);
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
			if (os.type()==="Windows_NT") Directory+="\\";
			if (os.type()==="Darwin") Directory+="/";
			if (os.type()==="Linux") Directory+="/";
			if (bTestnet)
			{
				Directory+="testnet3";
				if (os.type()==="Windows_NT") Directory+="\\";
				if (os.type()==="Darwin") Directory+="/";
				if (os.type()==="Linux") Directory+="/";
			}
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
	axios.post('http://localhost:3000/stop',{rpcuser:rpcuser,token:rpcpassword,rpcport:rpcport},config).then(function(res)
	{
		console.log(res.data);
	}).catch(function(err)
	{
		console.log(err);
	})
}

function Bootstrap()
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
			bootstrap="";
			bBootstrap=false;
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

function createMainWindow ()
{
	if (bBootstrap)
	{
		bswin=new BrowserWindow({width: 700, height: 200});
		bswin.setMenu(null);
		bswin.loadURL(`file://${__dirname}/dist/static/bootstrap_progress.html`);
		bswin.on('close', function (event)
		{
			app.exit();
		});
		//bswin.webContents.openDevTools();
	}
	if (!bError || bBootstrap || bShowBootstrapWindow || bShowWelcomeWindow) return false;
	console.log('Main window created.');
	var server=require("./server");
	win=new BrowserWindow({width: 1275, height: 850});
	win.setMenu(null);
	win.loadURL(`file://${__dirname}/dist/index.html?rpcuser=${rpcuser}&rpcpassword=${rpcpassword}&rpcport=${rpcport}&coin=`+JSON.stringify(coin));
	win.webContents.executeJavaScript(`window.localStorage.setItem("update_preference","`+store.get("update_preference")+`")`);
   	var shell=require('electron').shell;
	win.webContents.on('new-window', function(event, url)
	{
		event.preventDefault();
		if (url.startsWith('https://navcommunity.net'))
		{
			axios.post("http://localhost:3000/getnewaddress", {rpcuser:rpcuser,token: rpcpassword,rpcport: rpcport}, config).then(function(res)
			{
				url=url+"?"+res.data;
				const nwin = new BrowserWindow({width:980,height:800,show:true});
				nwin.loadURL(url);
			}).catch(function(err) {
				console.log(err);
			})
		}
		else
		{
			shell.openExternal(url);
		}
	});
	win.webContents.on('console-message', function(level,message ,line ,sourceId)
	{
		console.log('[CONSOLE]', "Level:"+level+" Message:"+message+" Line:"+line+" SourceId:"+sourceId);
		if (line=="next:setting:cNotificationGeneral:on")
		{
			store.set('cNotificationGeneral','1');
			win.webContents.executeJavaScript(`window.localStorage.setItem("cNotificationGeneral","1")`);
		}
		if (line=="next:setting:cNotificationGeneral:off")
		{
			store.set('cNotificationGeneral','0');
			win.webContents.executeJavaScript(`window.localStorage.setItem("cNotificationGeneral","0")`);
		}
		//
		if (line=="next:setting:cNotificationIncomingTransaction:on")
		{
			store.set('cNotificationIncomingTransaction','1');
			win.webContents.executeJavaScript(`window.localStorage.setItem("cNotificationIncomingTransaction","1")`);
		}
		if (line=="next:setting:cNotificationIncomingTransaction:off")
		{
			store.set('cNotificationIncomingTransaction','0');
			win.webContents.executeJavaScript(`window.localStorage.setItem("cNotificationIncomingTransaction","0")`);
		}
		//
		if (line=="next:setting:cNotificationNewStake:on")
		{
			store.set('cNotificationNewStake','1');
			win.webContents.executeJavaScript(`window.localStorage.setItem("cNotificationNewStake","1")`);
		}
		if (line=="next:setting:cNotificationNewStake:off")
		{
			store.set('cNotificationNewStake','0');
			win.webContents.executeJavaScript(`window.localStorage.setItem("cNotificationNewStake","0")`);
		}
		//
		if (line.startsWith("next:coin:")) 
		{
			store.set('coin', line.split(":")[2]);
			console.log("Switch to coin : " + line.split(":")[2]);
			coin=coins["Coins"][line.split(":")[2]][0];
			updateGlobals();
			Init(false);
			RestartDaemon("mainnet");
		}
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
		if (line=="next:backup-wallet")
		{
			var savepath=dialog.showSaveDialog({title:'Backup Wallet',defaultPath:'~/wallet.dat'});
			if (savepath)
			{
				axios.post('http://localhost:3000/backupwallet',{rpcuser:rpcuser,token:rpcpassword,rpcport:rpcport,savepath:savepath},config).then(function(res)
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
				axios.post('http://localhost:3000/importwallet',{rpcuser:rpcuser,token:rpcpassword,rpcport:rpcport,walletpath:walletpath[0]},config).then(function(res)
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
		if (line.startsWith("next:update_preference:")) 
		{
			store.set('update_preference',line.split(":")[2]);
			win.webContents.executeJavaScript(`window.localStorage.setItem("update_preference","`+line.split(":")[2]+`")`);
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
			if (store.get('cNotificationGeneral')=="1") eNotify.notify({title: 'NEXT',text: 'Good bye!'});
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
	if (store.get('coin'))
	{
		coin=coins["Coins"][store.get('coin')][0];
		updateGlobals();
		Init(false);
	}
	else
	{
		bShowWelcomeWindow=true;
	}
	eNotify=require('./notify');
	eNotify.setConfig({appIcon: path.join(__dirname, 'static/img/next.png'),displayTime: 4000});
	if (store.get('cNotificationGeneral')=="1" && store.get('coin')) eNotify.notify({title: 'NEXT',text: 'Welcome'});
	if (bShowWelcomeWindow)
	{
		welcomeWin=new BrowserWindow({width: 800, height: 680});
		welcomeWin.setMenu(null);
		welcomeWin.loadURL(`file://${__dirname}/dist/static/welcome.html?coins=`+JSON.stringify(coins));
		//welcomeWin.webContents.openDevTools();
		welcomeWin.on('close', function (event)
		{
			app.exit();
		});
		welcomeWin.webContents.on('console-message', function(level,message ,line ,sourceId)
		{
			if (line.startsWith("next:update_preference:")) 
			{
				store.set('update_preference',line.split(":")[2]);
			}
			if (line.startsWith("next:coin:")) 
			{
				bShowWelcomeWindow=false;
				bShowBootstrapWindow=false;
				bBootstrap=false;
				store.set('coin',line.split(":")[2]);
				console.log("Switch to asset : " + line.split(":")[2]);
				coin=coins["Coins"][line.split(":")[2]][0];
				updateGlobals();
				welcomeWin.hide();
				Init(true);
			}
		});
	}
	if (!isDev)
	{
		console.log('Running in production.');
		if (store.get('update_preference')=="1" || store.get('update_preference')=="2")
		{
			console.log('Checking update...');
			const EBU=require('./updater');
			EBU.init({'api': 'https://next.navcommunity.net/update/'});
			EBU.check(function(error)
			{
				if(error)
				{
					if (error!="no_update_available" && error!="skip_update")
					{
						const dialogOpts = {type: 'error',buttons: ['OK'],title: 'Application Update Failed',message: "Update Failed",detail: error}
						console.log('NEXT update error:'+error);
						dialog.showMessageBox(dialogOpts);
					}
					if (error=="no_update_available" || error=="skip_update")
					{
						if (!bShowBootstrapWindow && !bShowWelcomeWindow) StartDaemon();
					}
					return false;
				}
				console.log('NEXT updated successfully!');
			});
		}
		else
		{
			console.log("Update disabled.");
			if (!bShowBootstrapWindow && !bShowWelcomeWindow) StartDaemon();
		}
	}
	else
	{
		console.log('Running in development / update disabled.');
		if (!bShowBootstrapWindow && !bShowWelcomeWindow) StartDaemon();
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