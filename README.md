# Next - NavCoin Wallet
http://next.navcommunity.net

Installation Instructions for Ubuntu 16.04
==========================================
<pre>
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g electron --unsafe-perm=true --allow-root
cd next
npm install
sudo npm install -g electron-packager
npm run package-linux-x64
</pre>