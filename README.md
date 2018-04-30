# Next - NavCoin Wallet
http://next.navcommunity.net

Installation Instructions for Ubuntu 16.04
==========================================
<pre>
git clone https://github.com/sakdeniz/next.git
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g electron --unsafe-perm=true --allow-root
cd next
npm install
npm run build
sudo npm install -g electron-packager
npm run package-linux-x64
</pre>

Notes
=====
<ul>
<li>You should replace "node_modules\bitcoin-core\dist\src\methods.js" file with "https://raw.githubusercontent.com/sakdeniz/next/master/lib/methods.js" after clone.</li>
<li>You should replace "node_modules\bootstrap\dist\css\bootstrap.css" file with "https://raw.githubusercontent.com/sakdeniz/next/master/lib/bootstrap.css" after clone.</li>
<li>You should download latest daemon file for your current OS and copy it to root directory your electron application folder after package.</li>
</ul>

Override all local changes
==========================
<pre>
git reset --hard
git pull
</pre>

MacOS Code Sign
==========================
<pre>
https://ademcan.net/blog/2017/06/17/how-to-submit-an-electron-app-to-the-mac-appstore/
http://developer.apple.com/certificationauthority/AppleWWDRCA.cer
npm run sign-macos-x64
electron-osx-sign next.app
codesign --deep --verbose --force --sign "3rd Party Mac Developer Application: XXXXXX XXXXXXXX (XXXXXXXXXX)" next.app
codesign --deep --verbose --force --sign "Developer ID Application: XXXXXX XXXXXXXX (XXXXXXXXXX)" next.app
codesign --verify -vvvv next.app
</pre>