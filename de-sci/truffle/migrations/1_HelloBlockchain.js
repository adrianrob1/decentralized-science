const DeSciContract = artifacts.require("DeSciContract");

module.exports = function (deployer) {
  deployer.deploy(DeSciContract, "Hello Blockchain");
};