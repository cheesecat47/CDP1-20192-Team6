import Web3 from "web3";
// import "./app.css";
import ecommerceStoreArtifact from "../../build/contracts/EcommerceStore.json";

var ipfsClient = require('ipfs-http-client')
var ipfs = ipfsClient({
  host: 'localhost',
  port: '5001',
  protocol: 'http'
});
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
        // this.renderProducts("onDisplay");
        this.renderIndexProducts();
      }
      // buy.html
      else if (currentFileName.includes("buy.html")) {
        this.renderProducts();
      }
      // product-detail.html
      else if (currentFileName.includes("product-detail.html")) {
        let productId = new URLSearchParams(window.location.search).get('id');
        console.log(productId);
        this.renderProductDetails(productId);
        $("[name=product-id]").attr("value", productId); //method-get으로는 name이 넘어감
      }

      // buy-info.html
      else if (currentFileName.includes("buy-info.html")) {
        let productId = new URLSearchParams(window.location.search).get('product-id');

        $.ajax({
          url: "http://localhost:3000/products?id=" + productId, // pass by URL
          type: 'get',
          contentType: "application/json; charset=utf-8",
          data: {}
        }).done(function (data) {
          let thisData = data[0];
          $("#product-id").attr("value", productId);
          $("#buy-now").submit(function (event) {
            console.log(thisData);
            $("#msg").hide();
            var sendAmount = Number(thisData["price"]);
            App.instance.methods.buy(productId).send({ // contract code
              value: sendAmount,
              from: App.account
            }).then(function () {
              $.ajax({
                url: "http://localhost:3000/products/buy?id="+ thisData["blockchainId"]+"&destination="+event.target[0].value+"&phoneNumber="+event.target[1].value, // pass by URL
                type: 'get',
                contentType: "application/json; charset=utf-8",
                data: {}
              });
              window.location.href = 'http://localhost:8081/product-detail.html?id=' + String(thisData['blockchainId']);
              alert("판매자에게 구매 요청을 보냈습니다.\n 상품 수령후 수령확인 버튼을 눌러주셔야 판매자에게 이더가 지급됩니다.");
            });
            event.preventDefault();
          });
        });


      }

      // sell.html
      else if (currentFileName.includes("sell.html")) {
        // insert selling items list
        var div_selling_list = document.getElementById('selling-list');
        var div_request_list = document.getElementById('request-list');
        var sellerId = App.account;

        $.ajax({
          url: "http://localhost:3000/products?seller=" + sellerId, // pass by URL
          type: 'get',
          contentType: "application/json; charset=utf-8",
          data: {}
        }).done(function (data) {
          // console.log(data); //something to do

          // iterate to get each information in selling-list
          for (var item of data) {
            if (item["seller"] == sellerId && item["buyer"] == "0x0000000000000000000000000000000000000000") {
              var innerbox = document.createElement('div');
              innerbox.id = item['blockchainId'];
              innerbox.className = 'item new col-md-4';
              innerbox.innerHTML = `
              <a href="sell-info.html?blockchainId=${item['blockchainId']}" style="min-height: 300px;">
                <div class="featured-item">
                  <img src="http://localhost:8080/ipfs/${item['ipfsImageHash']}" alt="No image">
                  <h4>${item['name']}</h4>
                  <h6>Price: ${displayPrice(String(item['price']))}</h6>
                </div>
              </a>
              `;
              div_selling_list.appendChild(innerbox);
            }
          }

          // iterate to get each information in request-list
          for (var item of data) {
            if (item["seller"] == sellerId && item["buyer"] != "0x0000000000000000000000000000000000000000") {

              var innerbox = document.createElement('div');
              innerbox.id = item['blockchainId'];
              innerbox.className = 'item new col-md-4';
              innerbox.innerHTML = `
                <a href="sell-info.html?blockchainId=${item['blockchainId']}" style="min-height: 300px;">
                  <div class="featured-item">
                    <img src="http://localhost:8080/ipfs/${item['ipfsImageHash']}" alt="No image">
                    <h4>${item['name']}</h4>
                    <h6>Price: ${displayPrice(String(item['price']))}</h6>
                  </div>
                </a>
                `;
              div_request_list.appendChild(innerbox);
            }
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
        $("#msg").html("환불이 신청되어 블록체인이 업데이트 되었습니다. 구매 검증후 이더가 환불됩니다.");
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
    addProductToStore(product["product-name"], "phone" /*category*/ , imageId,
      descId, Date.parse(product["product-start-time"]) / 1000,
      this.web3.utils.toWei(product["product-price"], 'ether'), product["product-condition"]).send({
      from: this.account,
      gas: 4700000
    }).then(function () {
      window.location.href = 'http://localhost:8081/sell.html'
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

  renderProducts: async function () {
    var div_product_list = document.getElementById('product-list');
    var div_purchased_list = document.getElementById('purchased-list');
    var buyerId = App.account;

    $.ajax({
      url: "http://localhost:3000/products", // pass by URL
      type: 'get',
      contentType: "application/json; charset=utf-8",
      data: {}
    }).done(function (data) {
      for (var item of data) {
        if (item["buyer"] == "0x0000000000000000000000000000000000000000") {
          var innerbox = document.createElement('div');
          innerbox.id = item['blockchainId'];
          innerbox.className = 'item new col-md-4';
          innerbox.innerHTML = `
          <a href="product-detail.html?id=${item['blockchainId']}" style="min-height: 300px;">
            <div class="featured-item">
              <img src="http://localhost:8080/ipfs/${item['ipfsImageHash']}" alt="No image">
              <h4>${item['name']}</h4>
              <h6>Price: ${displayPrice(String(item['price']))}</h6>
            </div>
          </a>
          `;
          div_product_list.appendChild(innerbox);
        }
      }

      // iterate to get each information in request-list
      for (var item of data) {
        if (item["buyer"] == buyerId) {

          var innerbox = document.createElement('div');
          innerbox.id = item['blockchainId'];
          innerbox.className = 'item new col-md-4';
          innerbox.innerHTML = `
            <a href="product-detail.html?id=${item['blockchainId']}" style="min-height: 300px;">
              <div class="featured-item">
                <img src="http://localhost:8080/ipfs/${item['ipfsImageHash']}" alt="No image">
                <h4>${item['name']}</h4>
                <h6>Price: ${displayPrice(String(item['price']))}</h6>
              </div>
            </a>
            `;
          div_purchased_list.appendChild(innerbox);
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
      console.log(data);
      for (var p of data) {
        if (Number(p["blockchainId"]) != productId) {
          $(".owl-carousel").trigger('add.owl.carousel', [$("<a href='product-detail.html?id="+ p["blockchainId"]+"'>\
          <div class='featured-item'>\
          <img src='http://localhost:8080/ipfs/" + p["ipfsImageHash"] + "' alt='Item 1'>\
          <h4>" + p["name"] + "</h4> \
          <h6>" + displayPrice(String(p["price"])) + "</h6> \
          </div> \
          </a>\
          ")]).trigger('refresh.owl.carousel');
        } else {
          $("#product-id").children("img").attr("src", "http://localhost:8080/ipfs/" + p["ipfsImageHash"]);
          $("#product-name").html(`<h4>${p['name']}</h4>`);
          $("#product-price").html('<h6>' + displayPrice(String(p['price'])) + '</h6>')
          ipfs.cat(String(p['ipfsDescHash'])).then(function (file) {
            var desc = file.toString();
            $("#product-desc").text(desc);
          });
          try {
            const i = await escrowInfo(productId).call();
            console.log('status : 구매된 상태')
            $('#btn-product-detail').val("수령 확인");
            $('#btn-product-detail').prop('type', 'button');

            $("#btn-product-detail").hide();
            var btn_product_detail = document.getElementById('btn-product-detail');
            btn_product_detail.id = 'release-funds';
            $("#buyer").html('Buyer : ' + i[0]);
            $("#seller").html('seller : ' + i[1]);
            $("#arbiter").html('arbiter : ' + i[2]);
            $("#release-count").html(i[4]);
            $("#refund-count").html(i[5]);
            $("#product-status").text("상태 : 배송 준비 중");

            if (i[4] == 1) {
              $("#product-status").text("배송중");
              $("#release-funds").show();
            }
            if (i[4] >= 2) {
              $("#product-status").text("거래완료");
            }
          } catch (err) {
            $("#product-status").text("상태 : 구매가능");
            console.log('status: 구매되지 않은 상태');
          }
          $("#release-funds").click(function (event) {
            const {
              releaseAmountToSeller
            } = App.instance.methods;
            let productId = new URLSearchParams(window.location.search).get('id');
            releaseAmountToSeller(productId).send({
              from: App.account,
              gas: 4700000
            }).then(function () {
              window.location.reload();
              alert("상품수령이 확인되었습니다. 판매자에게 이더를 지급합니다.");
            });
            $("#product-status").text("상태 : 구매가능");
          }); //release-funds
        } // else
      } //for
    }); //query callback



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
      console.log(thisData['destination']);
      $("#product-name").text(thisData['name']);
      $("#product-image").attr("src", "http://localhost:8080/ipfs/" + thisData['ipfsImageHash']);
      $("#product-price").html('Price: ' + displayPrice(String(thisData['price'])));
      $("#buyer-address").text(thisData['destination']);
      $("#buyer-phone").text(thisData['phoneNumber']);
    });
    const {
      escrowInfo
    } = this.instance.methods;

    const i = await escrowInfo(productId).call();
    if (i[4] == 1) {
      $("#product-status").text("배송 중");
      $("#release-funds").hide();
    }
    if (i[4] >= 2) {
      $("#product-status").text("거래완료");
    }

    $("#release-funds").click(function (event) {
      const {
        releaseAmountToSeller
      } = App.instance.methods;

      let productId = new URLSearchParams(window.location.search).get('blockchainId');
      releaseAmountToSeller(productId).send({
        from: App.account,
        gas: 4700000
      }).then(function () {
        $("#msg").html("발송완료가 확인 되어서 블록체인에 업데이트 되었습니다. 구매자 확인후 이더가 지급됩니다.");
        $("#msg").show();
        window.location.reload();
      });
    });

  },

  renderIndexProducts: async function () {
    // 내가 구매한 상품 리스트
    $.ajax({
      url: "http://localhost:3000/products?buyer=" + App.account,
      type: 'get',
      contentType: "application/json; charset=utf-8",
      data: {}
    }).done(function (data) {
      for (var p of data) {
        console.log(p);
        $("#index_buy_list").trigger('add.owl.carousel',
          [$("<a href='product-detail.html?id="+p["blockchainId"]+"'>\
                    <div class='featured-item'>\
                      <img src='http://localhost:8080/ipfs/" + p["ipfsImageHash"] + "' alt='Item 1'>\
                      <h4>" + p["name"] + "</h4> \
                      <h6>" + displayPrice(String(p["price"])) + "</h6> \
                    </div> \
                  </a>\
              ")]).trigger('refresh.owl.carousel');
      }
    });

    // 내가 판매중인 상품 리스트
    $.ajax({
      url: "http://localhost:3000/products?seller=" + App.account,
      type: 'get',
      contentType: "application/json; charset=utf-8",
      data: {}
    }).done(function (data) {
      for (var p of data) {
        console.log(p);
        $("#index_sell_list").trigger('add.owl.carousel',
          [$("<a href='product-detail.html?id="+p["blockchainId"]+"'>\
                    <div class='featured-item'>\
                      <img src='http://localhost:8080/ipfs/" + p["ipfsImageHash"] + "' alt='Item 1'>\
                      <h4>" + p["name"] + "</h4> \
                      <h6>" + displayPrice(String(p["price"])) + "</h6> \
                    </div> \
                  </a>\
              ")]).trigger('refresh.owl.carousel');
      }
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