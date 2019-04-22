const AccessControl = artifacts.require("./AccessControl.sol");
const Base = artifacts.require("./Base.sol");

module.exports = function(deployer) {
  deployer.deploy(AccessControl);
  deployer.deploy(Base);
};
