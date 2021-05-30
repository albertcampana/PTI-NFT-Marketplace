const NftShop = artifacts.require("NftShop");

module.exports = function(deployer) {
  deployer.deploy(NftShop);
};
