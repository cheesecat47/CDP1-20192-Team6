import Web3 from "web3";
// import "./app.css";
import ecommerceStoreArtifact from "../../build/contracts/EcommerceStore.json";

var ipfsClient = require('ipfs-http-client')
var ipfs = ipfsClient({
  host: 'localhost',
  port: '5001',
  protocol: 'http'
})
var reader;

const App = {
  web3: null,
  account: null,
  instance: null,

  start: async function () {
    const {
      web3
    } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ecommerceStoreArtifact.networks[networkId];
      this.instance = new web3.eth.Contract(
        ecommerceStoreArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];


      // Different rendering depeding on which page
      var currentFileName = document.URL.substring(document.URL.lastIndexOf("/") + 1, document.URL.lastIndexOf("/") + 30);
      console.log(currentFileName);

      // index.html
      if (currentFileName.includes("index.html")) {
        this.renderProducts("onDisplay");
      }
      // buy.html
      else if (currentFileName.includes("buy.html")) {
        var listStatus = "onDisplay";
        var pageNum = 1;

        this.renderProducts("onDisplay", 1);

        $("#productList").click(function (event) {
          listStatus = "onDisplay";
          App.renderProducts(listStatus, 1);
        });
        $("#productPurchased").click(function (event) {
          listStatus = "purchased";
          App.renderProducts(listStatus, 1);
        });
        $(".page-number").click(function (event) {
          $(".current-page").removeClass("current-page");
          $(this).addClass("current-page");
          pageNum = parseInt($(this).text());
          App.renderProducts(listStatus, pageNum);
        })
      }
      // product-detail.html
      else if (currentFileName.includes("product-detail.html")) {
        let productId = new URLSearchParams(window.location.search).get('id');
        console.log(productId);
        this.renderProductDetails(productId);
        // $("#product-id").attr("value", productId);
      }
      // buy-info.html
      else if (currentFileName.includes("buy-info.html")) {
        let productId = new URLSearchParams(window.location.search).get('product-id');
        let quantity = new URLSearchParams(window.location.search).get('quantity');
        console.log(productId);
        console.log(quantity);
        $("#buy-now").submit(function (event) {
          console.log("hi");
          $("#msg").hide();
          var sendAmount = $("#buy-now-price").val();
          var productId = $("#product-id").val();
          App.instance.methods.buy(productId).send({
            value: sendAmount,
            from: App.account
          })
          $("#msg").html("You have successfully purchased the product!");
          $("#msg").show();
          event.preventDefault();
        });
      }

      // sell.html
      else if (currentFileName.includes("sell.html")){
        // insert selling items list
        var div_selling_list = document.getElementById('selling-list');
        var div_request_list = document.getElementById('request-list');
        var sellerId = "0xa10f9eae66A1328e62034bFcc4786A8e3B35ED59";

        $.ajax({
          url: "http://localhost:3000/products?seller=" + sellerId, // pass by URL
          type: 'get',
          contentType: "application/json; charset=utf-8",
          data: {}
        }).done(function (data) {
          // console.log(data); //something to do
  
          // iterate to get each information in selling-list
          for (var item of data) { 
            console.log(item);
            var innerbox = document.createElement('div');
            innerbox.id = item['blockchainId'];
            innerbox.className = 'item new col-md-4';
            innerbox.innerHTML = `
              <a href="sell-info.html?blockchainId=${item['blockchainId']}" style="min-height: 300px;">
                <div class="featured-item">
                  <img src="http://ipfs.io/ipfs/${item['ipfsImageHash']}" alt="No image">
                  <h4>${item['name']}</h4>
                  <h6>Price: ${displayPrice(String(item['price']))}</h6>
                </div>
              </a>
              `;
              div_selling_list.appendChild(innerbox);
          }

          // iterate to get each information in request-list
          for (var item of data) { 
            console.log(item);
            var innerbox = document.createElement('div');
            innerbox.id = item['blockchainId'];
            innerbox.className = 'item new col-md-4';
            innerbox.innerHTML = `
              <a href="sell-info.html?blockchainId=${item['blockchainId']}" style="min-height: 300px;">
                <div class="featured-item">
                  <img src="http://ipfs.io/ipfs/${item['ipfsImageHash']}" alt="No image">
                  <h4>${item['name']}</h4>
                  <h6>Price: ${displayPrice(String(item['price']))}</h6>
                  <h6>Status: ${item['condition']}</h6>
                </div>
              </a>
              `;
              div_request_list.appendChild(innerbox);
          }
        });
      }

      // sell-info.html
      else if (currentFileName.includes("sell-info.html")) {
        let productId = new URLSearchParams(window.location.search).get('blockchainId');
        // console.log(productId);
        this.renderSellInfo(productId);
      }



      $("#add-item-to-store").submit(function (event) {
        const req = $("#add-item-to-store").serialize();
        let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        let decodedParams = {}
        Object.keys(params).forEach(function (v) {
          decodedParams[v] = decodeURIComponent(decodeURI(params[v]));
        });
        console.log(decodedParams);
        App.saveProduct(decodedParams);
        event.preventDefault();
      });

      $('#product-image').change(function (event) {
        const file = event.target.files[0]
        reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
      });


      $("#release-funds").click(function (event) {
        const {
          releaseAmountToSeller
        } = App.instance.methods;
        let productId = new URLSearchParams(window.location.search).get('id');
        console.log(productId);
        $("#msg").html("Your transaction has been submitted. please wait for few seconds for the confirmation");
        $("#msg").show();
        releaseAmountToSeller(productId).send({
          from: App.account,
          gas: 4700000
        }).then(window.location.reload());
      });


      $("#refund-funds").click(function (event) {
        const {
          refundAmountToBuyer
        } = App.instance.methods;
        let productId = new URLSearchParams(window.location.search).get('id');
        console.lof(productId);
        $("#msg").html("Your transaction has been submitted. please wait for few seconds for the confirmation");
        $("#msg").show();
        refundAmountToBuyer(productId).send({
          from: App.account,
          gas: 4700000
        }).then(window.location.reload());
      });
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  saveProduct: async function (product) {
    const {
      addProductToStore
    } = this.instance.methods;
    let imageId = await this.saveImageOnIpfs(reader);
    let descId = await this.saveTextBlobOnIpfs(product["product-description"]);
    addProductToStore(product["product-name"], product["product-category"], imageId,
      descId, Date.parse(product["product-start-time"]) / 1000,
      this.web3.utils.toWei(product["product-price"], 'ether'), product["product-condition"]).send({
      from: this.account,
      gas: 4700000
    });
  },

  saveImageOnIpfs: async function (reader) {
    return new Promise(function (resolve, reject) {
      const buffer = Buffer.from(reader.result);
      ipfs.add(buffer)
        .then((response) => {
          console.log(response)
          resolve(response[0].hash);
        }).catch((err) => {
          console.error(err)
          reject(err);
        })
    })
  },

  saveTextBlobOnIpfs: async function (blob) {
    return new Promise(function (resolve, reject) {
      const descBuffer = Buffer.from(blob, 'utf-8');
      ipfs.add(descBuffer)
        .then((response) => {
          console.log(response)
          resolve(response[0].hash);
        }).catch((err) => {
          console.error(err)
          reject(err);
        })
    })
  },

  renderProducts: async function (storeName, pageNum) {
    const {
      getProduct,
      productIndex
    } = this.instance.methods;

    var count = await productIndex().call();
    var itemNumber;
    var product;
    var eachItem;
    $(".featured-item").css("display", "none");
    console.log(count);
    if (storeName == "onDisplay") {
      for (var i = (pageNum - 1) * 6 + 1; i <= (pageNum - 1) * 6 + 6 && i <= count; i++) {
        product = await getProduct(i).call();
        eachItem = "#item-" + ((i - 1) % 6);
        $(eachItem).closest("a").attr("href", "product-detail.html?id=" + product[0]);
        $(eachItem).children("img").attr("src", "http://ipfs.io/ipfs/" + product[3]);
        $(eachItem).children("h4").text(product[1]);
        $(eachItem).children("h6").text(displayPrice(product[6]));
        $(eachItem).css("display", "");
      }
    } else if (storeName == "puchased") {
      for (var i = 1; i <= count; i++) {
        if (f[8] != '0x0000000000000000000000000000000000000000') {
          product = await getProduct(i).call();
          eachItem = "#item-" + i;
          $(eachItem).children("img").attr("src", "http://ipfs.io/ipfs/" + product[3]);
          $(eachItem).children("h4").text(product[1]);
          $(eachItem).children("h6").text(displayPrice(product[6]));
          $(eachItem).css("display", "");
        }
      }
    }
  },

  renderProductDetails: async function (productId) {
    const {
      getProduct,
      escrowInfo,
      productIndex
    } = this.instance.methods;
    var p = await getProduct(productId).call();
    var count = await productIndex().call();
    $("#product-name").text(p[1]);
    $("#product-image").attr("src", "http://ipfs.io/ipfs/" + p[3]);
    $("#product-price").html(displayPrice(p[6]));
    $("#product-id").val(p[0]);
    // $("#buy-now-price").val((p[6]));
    if (p[8] == '0x0000000000000000000000000000000000000000') {
      $("#product-status").text("상태 : 구매가능");
    } else {
      $("#product-status").text("상태 : 거래중");
    }
    // var desFile = await ipfs.cat(p[4]);

    // var content = desFile.toString();
    // $("#product-desc").text(content);
    var j = 0
    for (var i = 1; i <= count; i++) {
      var otherProduct = await getProduct(i).call();
      if (p[0] != i) {
        // $(".owl-carousel").trigger('remove.owl.carousel',[i]).trigger('refresh.owl.carousel');
        $(".owl-carousel").trigger('add.owl.carousel', [$("<a href='product-detail.html'>\
                                                            <div class='featured-item'>\
                                                              <img src='http://ipfs.io/ipfs/" + otherProduct[3] + "' alt='Item 1'>\
                                                              <h4>" + otherProduct[1] + "</h4> \
                                                              <h6>" + displayPrice(otherProduct[6]) + "</h6> \
                                                            </div> \
                                                          </a>\
                                                      ")]).trigger('refresh.owl.carousel');
        j++;
      }
    }

    //escrow
    if (p[8] == '0x0000000000000000000000000000000000000000') {
      $("#escrow-info").hide();
    } else {
      $("#buy-now").hide();
      const i = await escrowInfo(productId).call();
      $("#buyer").html('Buyer : ' + i[0]);
      $("#seller").html('seller : ' + i[1]);
      $("#arbiter").html('arbiter : ' + i[2]);
      $("#release-count").html(i[4]);
      $("#refund-count").html(i[5]);
    }
  },

  renderSellInfo: async function (productId) {
    $.ajax({
      // url: "http://localhost:3000/products?productId=" + productId,
      url: "http://localhost:3000/products?id=" + productId,
      type: 'get',
      contentType: "application/json; charset=utf-8",
      data: {}
    }).done(function(data){
        var thisData = data[0];
        console.log(thisData)
        $("#product-name").text(thisData['name']);
        $("#product-image").attr("src", "http://ipfs.io/ipfs/" + thisData['ipfsImageHash']);
        $("#product-price").html('Price: ' + displayPrice(String(thisData['price'])));
        // $("#product-id").val(p[0]);
    });
  }
};

function displayPrice(amt) {
  return "Ξ" + App.web3.utils.fromWei(amt, 'ether');
}

window.App = App;

window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});