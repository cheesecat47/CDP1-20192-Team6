# 2019-2 Capstone Design Project 1

#### School of Computer Science and Engineering, Kyungpook National University.  

# Blockchain used market service using Ethereum.




## Install Development Environment

#### Ubuntu 18.04 version

1. Clone git  
   ```Bash
   $ git clone https://github.com/cheesecat47/CDP1-20192-Team6.git
   cd CDP1-20192-Team6
   ```

1. Run 'install.sh'
    ```Bash
    $ ./install.sh
    ```

### If you want to install manually, try these.  
1. node.js
    ```Bash
    $ apt install nodejs
    $ apt install npm
    $ cd dev/app
    $ npm install
    $ npm install -g nodemon
    ```

1. ganache-cli  
    ```Bash
    $ cd dev/app
    $ npm install -g ganache-cli
    ```

1. truffle
    ```Bash
    $ npm install -g truffle
    ```

1. Metamask  
    https://metamask.io  
    Download __Chrome__ extension.  

1. IPFS daemon  
    ```Bash
    # Download IPFS Prebuild Package from this site.
    # https://docs.ipfs.io/guides/guides/install/
    $ tar xvfz 'download_ipfs_file.tar.gz'
    $ cd go-ipfs
    $ ./install.sh
    
    # Initialise IPFS Daemon
    $ ipfs init
    
    # Allow IPFS to access with http protocol in web browser.
    $ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
    $ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
    $ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
    ```

1. MongoDB
    ```bash
    $ sudo apt-get update
    $ sudo apt-get install mongodb
    $ sudo mkdir -p /data/db
    ```

   

## How to run Development Environment

> You have to enter command in the specified path.



1. Install dependency package

   * Install packages using npm

   ```bash
   ~/CDP1-20192-Team6/dev/app$ npm install
   ```

1. Blockchain setting

   * Run ganache on localhost:8545

   ```Bash
   $ ganache-cli
   ```

   * Deploy the Ecommerce contract  on Ganache

   ```bash
   ~/CDP1-20192-Team6/dev$ truffle migrate 
   ```

1. DB setting

   * Start mongoDB server (Initialize) on localhost:27017

   ```bash
   $ sudo rm -rf /data
   $ sudo mkdir -p /data/db
   $ sudo mongod
   ```

1. Node.js server setting 

   * Run server.js on nodemon  on localhost:3000

   ```bash
   ~/CDP1-20192-Team6/dev/app$ npm install -g nodemon
   ~/CDP1-20192-Team6/dev/app/src$ nodemon server.js
   ```

1. IPFS daemon  

   * Start IPFS daemon on port 5001

   ```Bash
   $ ipfs daemon
   ```

1. Run web hosting server

   * Run webpack-dev-server  on localhost:8081

   ```Bash
   ~/CDP1-20192-Team6/dev/app$ npm run dev
   ```

1. (Optional) Add 10 product-samples to the Store 

   * Run script to make samples

   ```  bash
   ~/CDP1-20192-Team6/dev$ truffle exec ./app/src/sample.js
   ```



##  API for Querying from FE to DB 

> You can query to DB using a URL.



#### How to Query to DB using 'JQuery.ajax()' on a '.js' file

Assuming the DB and web server is running on localhost, you can do the following example to get All products :

```javascript
$.ajax({
    url: "http://localhost:3000/products",
    type: 'get',
    contentType: "application/json; charset=utf-8",
    data: {}
}).done(function(data){
    console.log(data); // something to do 
});
```



If you want use filter on the field(id, name, category, price, condition, seller) of the products, you can do the following example.

```javascript
$.ajax({
    url: "http://localhost:3000/products?id=3&name=iPhone&category=phone", // pass by URL
    type: 'get',
    contentType: "application/json; charset=utf-8",
    data: {}
}).done(function(data){
    console.log(data); //something to do
});
```

