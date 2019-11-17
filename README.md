# 2019-2 Capstone Design Project 1
#### School of Computer Science and Engineering, Kyungpook National University.  

# Blockchain used market service using Ethereum.


## Install Development Environment
1. Clone git  
	```Bash
	$ git clone https://github.com/cheesecat47/CDP1-20192-Team6.git
	```  
1. ganache-cli  
	```Bash
	$ 
	```
1. ipfs daemon  
	```Bash
	$ 
	```


## Development Environment Settings
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
	

### Initialise IPFS Daemon
```Bash
$ rm -rf ~/.ipfs
$ ipfs init

# Allow IPFS to access with http protocol in web browser.
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
```  
	
