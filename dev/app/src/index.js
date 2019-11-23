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
        // $(".page-number").click(function (event) {
        //   $(".current-page").removeClass("current-page");
        //   $(this).addClass("current-page");
        //   pageNum = parseInt($(this).text());
        //   App.renderProducts(listStatus, pageNum);
        // })
      }
      // product-detail.html
      else if (currentFileName.includes("product-detail.html")) {
        let productId = new URLSearchParams(window.location.search).get('id');
        // let productPrice = new URLSearchParams(window.location.search).get('price');

        console.log(productId);
        // console.log(productPrice);

        this.renderProductDetails(productId);

        $.ajax({
          url: "http://localhost:3000/products?id=" + productId,
          type: 'get',
          contentType: "application/json; charset=utf-8",
          data: {}
        }).done(function (data) {
          var thisData = data[0];
          var productPrice = thisData['price'];

          if (thisData['buyer'] == App.account){
            $('#btn-product-detail').val("배송 확인");
            $('#btn-product-detail').prop('type', 'button');
            var btn_product_detail = document.getElementById('btn-product-detail');
            btn_product_detail.id = 'release-funds';
          }

          $("#release-funds").click(function (event) {
            console.log("release-fund kkkkkk");
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

          // product-status 바꿔주기

          $("[name=product-id]").attr("value", productId); //method-get으로는 name이 넘어감
          $("[name=product-price]").attr("value", productPrice); //method-get으로는 name이 넘어감
        });
      }

      // buy-info.html
      else if (currentFileName.includes("buy-info.html")) {
        let productId = new URLSearchParams(window.location.search).get('product-id');
        let quantity = new URLSearchParams(window.location.search).get('quantity');
        let productPrice = new URLSearchParams(window.location.search).get('product-price');

        console.log(productId);
        console.log(quantity);
        console.log(productPrice);
        this.renderProductDetails(productId);
        $("#product-id").attr("value", productId);
        $("#buy-now-price").attr("value", productPrice);
        $("#buy-now").submit(function (event) {
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
      else if (currentFileName.includes("sell.html")) {
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

    var product_list = document.getElementById('product-list');
    $.ajax({
      url: "http://localhost:3000/products", // pass by URL
      type: 'get',
      contentType: "application/json; charset=utf-8",
      data: {}
    }).done(function (data) {
      // console.log(data); //something to do

      $("#product-list").empty();
      // iterate to get each information in selling-list
      for (var item of data) {
        var innerbox = document.createElement('div');
        innerbox.id = item['blockchainId'];
        innerbox.className = 'item new col-md-4';
        innerbox.innerHTML = `
          <a href="product-detail.html?id=${item['blockchainId']}&price=${String(item['price'])}" style="min-height: 300px;">
            <div class="featured-item">
              <img src="http://ipfs.io/ipfs/${item['ipfsImageHash']}" alt="No image">
              <h4>${item['name']}</h4>
              <h6>Price: ${displayPrice(String(item['price']))}</h6>
            </div>
          </a>
          `;
        innerbox.style.display = "none";
        product_list.appendChild(innerbox);
      }

      var itemlist = document.getElementsByClassName('item');
      if (storeName == "onDisplay") {
        for (var eachItem of itemlist) {
          console.log("hihhihihii");
          var temp = data[eachItem.id - 1];
          if (temp['buyer'] == '0x0000000000000000000000000000000000000000') {
            eachItem.style.display = "";
          }
        }
      } else {
        for (var eachItem of itemlist) {
          var temp = data[eachItem.id-1];
          if (temp['buyer'] == App.account) {
            eachItem.style.display = "";
          }
        }
      }
    });
  },

  renderProductDetails: async function (productId) {
    const {
      escrowInfo
    } = this.instance.methods;

    $.ajax({
      url: "http://localhost:3000/products", // pass by URL
      type: 'get',
      contentType: "application/json; charset=utf-8",
      data: {}
    }).done(async function (data) {
      for (var i = 0; i < data.length; i++) {
        var p = data[i];
        if (Number(p["blockchainId"]) != productId) {
          $(".owl-carousel").trigger('add.owl.carousel', [$("<a href='product-detail.html'>\
                                                              <div class='featured-item'>\
                                                                <img src='http://ipfs.io/ipfs/" + p["ipfsImageHash"] + "' alt='Item 1'>\
                                                                <h4>" + p["name"] + "</h4> \
                                                                <h6>" + displayPrice(String(p["price"])) + "</h6> \
                                                              </div> \
                                                            </a>\
                                                        ")]).trigger('refresh.owl.carousel');
        } else {
          $("#product-id").children("h4").text(p["name"]);
          $("#product-id").children("img").attr("src", "http://ipfs.io/ipfs/" + p["ipfsImageHash"]);
          $("#product-id").children("h6").text(displayPrice(String(p["price"])));
          // $("#product-id").val(p["blockchainId"]);

          //escrow
          if (p["buyer"] == '0x0000000000000000000000000000000000000000') {
            $("#escrow-info").hide();
            $("#product-status").text("상태 : 구매가능");
          } else {
            const i = await escrowInfo(productId).call();
            $("#buyer").html('Buyer : ' + i[0]);
            $("#seller").html('seller : ' + i[1]);
            $("#arbiter").html('arbiter : ' + i[2]);
            $("#release-count").html(i[4]);
            $("#refund-count").html(i[5]);
            $("#deliver_item_btn").hide();
            $("#product-status").text("상태 : 거래중");
          }
        }
      };
    })

  },

  renderSellInfo: async function (productId) {
    $.ajax({
      // url: "http://localhost:3000/products?productId=" + productId,
      url: "http://localhost:3000/products?id=" + productId,
      type: 'get',
      contentType: "application/json; charset=utf-8",
      data: {}
    }).done(function (data) {
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