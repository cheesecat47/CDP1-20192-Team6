EcommerceStore = artifacts.require("./EcommerceStore.sol");
module.exports = function(callback) {
 current_time = Math.round(new Date() / 1000);
 amt_1 = web3.utils.toWei('1', 'ether');
 amt_2 = web3.utils.toWei('2', 'ether');
 amt_3 = web3.utils.toWei('3', 'ether');
 amt_half = web3.utils.toWei('0.5', 'ether');
 amt_tenth = web3.utils.toWei('0.1', 'ether');

 EcommerceStore.deployed().then(function(i) {i.addProductToStore('아이폰 11', 'phone', 'Qmdh6vza8y6KNWnjtUKWfgAzy3RN52jjey67DKDyu6exyb', 'QmbLRFj5U6UGTy3o9Zt8jEnVDuAw2GKzvrrv3RED9wyGRk', current_time, 2*amt_1, 0).then(function(f) {console.log(f)})});
 EcommerceStore.deployed().then(function(i) {i.addProductToStore('아이폰 11 프로 맥스', 'phone', 'Qmc7tqBJBgQn66pPdyh973qCtnG4wTSS5pZRJPXDU9aqK2', 'QmVw8NchonV1oXpHxDWkNuhq4aepFnGXJSJtJZvcj7h2zH', current_time, amt_2, 0).then(function(f) {console.log(f)})});
 EcommerceStore.deployed().then(function(i) {i.addProductToStore('아이폰 8', 'phone', 'QmQEZ9nwCVaib2b6ZUYMT3MN4ieknbLuSUQ2BmUEwbG7hp', 'QmdhqKBVSF7tSMA4ZU1cfRxbgdfUZ5axpbMCKyszJiLvYG', current_time, amt_tenth, 0).then(function(f) {console.log(f)})});
 EcommerceStore.deployed().then(function(i) {i.addProductToStore("아이폰 XS", 'phone', 'QmU9sMhA375v1QfTpXpaz8yn64kmNismpzhLk7WK235DVE', 'QmSfWh8FHpGSVSuubxXw1d4gZEdf5UHc2qjax8D6FyKi8Z', current_time, amt_half, 0).then(function(f) {console.log(f)})});
 EcommerceStore.deployed().then(function(i) {i.addProductToStore("아이폰 4s", 'phone', 'QmPa5kpAAWYYRPdCKXn6bwYGiW3v8gpEr8eLHBR9XhqxeF', 'QmdowsgFNRaXttG8WDq2FA4yiSwfK9wA9ezPNpkTkikiYK', current_time, amt_2, 0).then(function(f) {console.log(f)})});
 EcommerceStore.deployed().then(function(i) {i.addProductToStore("아이폰 6s", 'phone', 'QmPstpa49aWPWMuJurjLMqNKZQuQgTwQYmP9Fs21m8pjhr', 'QmQKrJYWnJKjLHXzc6bJRNE8ja4RDxMmxJTwuptSLUAogG', current_time, amt_2, 0).then(function(f) {console.log(f)})});
//  EcommerceStore.deployed().then(function(i) {i.addProductToStore("Macbook Pro", 'phone', 'QmWFZ3DBTet3UqptBfif1FPzgvSbaPBRB941cdiyCgsnuy', 'QmRYuTdmJCUqdCTBopXVCggfSPYwNXABT6KvcCGSmmStcj', current_time, amt_2, 0).then(function(f) {console.log(f)})});
//  EcommerceStore.deployed().then(function(i) {i.addProductToStore("Drone", 'phone', 'QmaWR99orw8oE5N64SK7iF1pKQtP33xFdULgmZgq2qQAGZ', 'QmVjm69AhhdC2D8gZFXUjpJhaqewYMdbciGdbXtoJ11KCS', current_time, amt_2, 0).then(function(f) {console.log(f)})});
//  EcommerceStore.deployed().then(function(i) {i.addProductToStore('Nokia', 'phone', 'QmbtNJCeM3wvaxFQeur9PkWLyBYzCjouwsr1ksSixtHetC', 'QmSE98p8LJxxPq7udGgKfKAZUy4qeWvgBZEtGNp94y7gwN', current_time, amt_3, 0).then(function(f) {console.log(f)})});
//  EcommerceStore.deployed().then(function(i) {i.addProductToStore('Cryptonomicon', 'phone', 'QmP7WZxJxE9JrhMf9AgprL6rPXXBNCU6VJFMAyjGbYYGT6', 'QmNWN2heQbW6wxGAZZy53fhbicWczBWbifMi71qBJago4f', current_time, amt_2, 0).then(function(f) {console.log(f)})});
}

// use 'truffle exec ./app/src/sample.js' command in dev directory