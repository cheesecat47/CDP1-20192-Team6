# 2019-2 Capstone Design Project 1

#### School of Computer Science and Engineering, Kyungpook National University.  

# Blockchain used market service using Ethereum.




## Install Development Environment

#### Ubuntu 18.04 version

1. Clone git  

   ```Bash
   $ git clone https://github.com/cheesecat47/CDP1-20192-Team6.git
   ```

2. node.js

   ```Bash
   $ apt install nodejs
   ```

3. ganache-cli  

   ```Bash
   $ npm install ganache-cli
   ```

4. web3

   ```Bash
   $ npm install web3@1.0.0-beta.37
   ```

5. solc

   ```Bash
   $ npm install solc@0.5.3
   ```

6. truffle

   ```Bash
   $ npm install -g truffle
   ```

7. Metamask  
   https://metamask.io  
   Download Chrome extension.  

8. IPFS daemon  

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

9. MongoDB

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

2. Blockchain setting

   * Run ganache on localhost:8545

   ```Bash
   $ ganache-cli
   ```

   * Deploy the Ecommerce contract  on Ganache

   ```bash
   ~/CDP1-20192-Team6/dev$ truffle migrate 
   ```

3. DB setting

   * Start mongoDB server (Initialize) on localhost:27017

   ```bash
   $ sudo rm -rf /data
   $ sudo mkdir -p /data/db
   $ sudo mongod
   ```

4. Node.js server setting 

   * Run server.js on nodemon  on localhost:3000

   ```bash
   ~/CDP1-20192-Team6/dev/app/src$ nodemon server.js
   ```

5. IPFS daemon  

   * Start IPFS daemon on port 5001

   ```Bash
   $ ipfs daemon
   ```

6. Run web hosting server

   * Run webpack-dev-server  on localhost:8081

   ```Bash
   ~/CDP1-20192-Team6/dev/app$ npm run dev
   ```

7. (Optional) Add 10 product-samples to the Store 

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

