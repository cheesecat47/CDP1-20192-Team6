const EcommerceStore = artifacts.require("EcommerceStore");

module.exports = function(deployer) { 
  deployer.deploy(EcommerceStore, web3.eth.getAccounts().then((accounts) => {return accounts[9];}));
};
// , accounts[9]