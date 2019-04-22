pragma solidity ^0.5.0;

import "../../app/node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../../app/node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";


contract AccessControl is Ownable {

    // Default is to make sure that role starts at 1, since mapping default is 0
    enum RoleChoices {Default, Farmer, Brewer, Distributor, Consumer}
    mapping(address => RoleChoices) members;

    function addFarmer(address _address) public onlyOwner {
        members[_address] = RoleChoices.Farmer;
    }

    function isFarmer(address _address) public view returns (bool) {
        return members[_address] == RoleChoices.Farmer;
    }

    modifier onlyFarmer() {
        require(isFarmer(msg.sender), "Farmer Only");
        _;
    }

    function addBrewer(address _address) public onlyOwner {
        members[_address] = RoleChoices.Brewer;
    }

    function isBrewer(address _address) public view returns (bool) {
        return members[_address] == RoleChoices.Brewer;
    }

    modifier onlyBrewer() {
        require(isBrewer(msg.sender), "Brewer Only");
        _;
    }

    function addDistributor(address _address) public onlyOwner {
        members[_address] = RoleChoices.Distributor;
    }

    function isDistributor(address _address) public view returns (bool) {
        return members[_address] == RoleChoices.Distributor;
    }

    modifier onlyDistributor() {
        require(isDistributor(msg.sender), "Distributor Only");
        _;
    }

}