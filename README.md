# 2019-2 Capstone Design Project 1
#### School of Computer Science and Engineering, Kyungpook National University.  

# Blockchain used market service using Ethereum.




## Install Development Environment
#### Ubuntu 18.04 version
1. Clone git  
	```Bash
	$ git clone https://github.com/cheesecat47/CDP1-20192-Team6.git
	```  
1. node.js
	```Bash
	$ apt install nodejs
	```
1. ganache-cli  
	```Bash
	$ npm install ganache-cli
	```
1. web3
	```Bash
	$ npm install web3@1.0.0-beta.37
	```
1. solc
	```Bash
	$ npm install solc@0.5.3
	```
1. truffle
	```Bash
	$ npm install -g truffle
	```
1. Metamask  
	https://metamask.io  
	Download Chrome extension.  

1. IPFS daemon  
	```Bash
	# https://ipfs.io/#install
	$ git clone https://github.com/ipfs-shipyard/ipfs-desktop.git
	$ cd ipfs-desktop
	$ npm install
	$ npm start

	# Initialise IPFS Daemon
	$ rm -rf ~/.ipfs
	$ ipfs init

	# Allow IPFS to access with http protocol in web browser.
	$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
	$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
	$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
	```



## How to run Development Environment
1. ganache-cli  
	```Bash
	$ ganache-cli
	```  
1. IPFS daemon  
	```Bash
	$ ipfs daemon
	```  
1. webpack-dev-server  
	```Bash
	$ cd dev/app
	$ npm run dev
	```  
