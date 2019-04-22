pragma solidity ^0.5.0;

import "../AccessControl/AccessControl.sol";

contract Base is AccessControl {

    // state of grape
    enum State {
        Harvested,
        Packed,
        BoughtByBrewer,
        Aged,
        Bottled,
        BoughtByDistributor,
        ForSale,
        Purchased
    }

    struct grape {
        address owner;
        string farmerName;
        address farmerAddress;
        string brewerName;
        address brewerAddress;
        address distributorAddress;
        State state;
        uint price; // final price to consumer
    }

    // store the grape batchId
    mapping(uint => grape) grapes;

    // store last batchId
    uint lastBatchId;

    constructor() public {
        lastBatchId = 0;
    }

    function checkGrape(uint _batchId) public view returns (address owner,address farmer,address brewer,address distributor,uint state) {
        grape memory grapeBatch = grapes[_batchId];
        owner = grapeBatch.owner;
        farmer = grapeBatch.farmerAddress;
        brewer = grapeBatch.brewerAddress;
        distributor = grapeBatch.distributorAddress;
        state = uint(grapeBatch.state);
        //return (grapeBatch.owner, grapeBatch.farmerAddress, grapeBatch.brewerAddress, grapeBatch.distributorAddress, uint(grapeBatch.state));
    }

    function harvest(string memory _farmerName) public onlyFarmer {
        uint batchId = lastBatchId;
        // increment the last batchId for future use
        lastBatchId += 1;

        grape memory currentGrape;
        currentGrape.owner = msg.sender;
        currentGrape.farmerName = _farmerName;
        currentGrape.farmerAddress = msg.sender;
        currentGrape.state = State.Harvested;
        grapes[batchId] = currentGrape;
    }

    function pack(uint _batchId) public onlyFarmer {
        grape memory currentGrape = grapes[_batchId];

        require(currentGrape.state == State.Harvested, "Grape has not been harvested");
        // make sure the original farmer is the one who can modify
        require(currentGrape.owner == msg.sender, "This grape does not belong to you");

        currentGrape.state = State.Packed;
    }

    function buyFromFarmer(uint _batchId, string memory _brewerName) public onlyBrewer {
        grape memory currentGrape = grapes[_batchId];
        require(currentGrape.state == State.Packed, "Grape has not been packed");

        currentGrape.owner = msg.sender;
        currentGrape.brewerName = _brewerName;
        currentGrape.brewerAddress = msg.sender;
        currentGrape.state = State.BoughtByBrewer;
    }

    function ferment(uint _batchId) public onlyBrewer {
        grape memory currentGrape = grapes[_batchId];

        require(currentGrape.state == State.BoughtByBrewer, "Grape has not been bought");
        // make sure the original brewer is the one who can modify
        require(currentGrape.owner == msg.sender, "This grape does not belong to you");

        currentGrape.state = State.Aged;
    }

    function bottle(uint _batchId) public onlyBrewer {
        grape memory currentGrape = grapes[_batchId];

        require(currentGrape.state == State.Aged, "Grape has not been aged");
        // make sure the original brewer is the one who can modify
        require(currentGrape.owner == msg.sender, "This grape does not belong to you");

        currentGrape.state = State.Bottled;
    }

    function buyWine(uint _batchId) public onlyDistributor {
        grape memory currentGrape = grapes[_batchId];

        require(currentGrape.state == State.Bottled, "Grape has not been bottled");

        currentGrape.owner = msg.sender;
        currentGrape.distributorAddress = msg.sender;
        currentGrape.state = State.BoughtByDistributor;
    }

    function shipToShop(uint _batchId, uint _price) public onlyDistributor {
        grape memory currentGrape = grapes[_batchId];

        require(currentGrape.state == State.Bottled, "Grape has not been bottled");
        require(currentGrape.owner == msg.sender, "This grape does not belong to you");

        currentGrape.state = State.ForSale;
        currentGrape.price = _price;
    }

    function buyFromShop(uint _batchId) public payable {
        grape memory currentGrape = grapes[_batchId];

        require(currentGrape.state == State.ForSale, "Grape is not for sale");
        require(msg.value >= currentGrape.price, "Insufficient amount");

        currentGrape.owner = msg.sender;
        currentGrape.state = State.ForSale;

        uint _price = currentGrape.price;
        uint amountToReturn = msg.value - _price;
        msg.sender.transfer(amountToReturn);
    }
}


