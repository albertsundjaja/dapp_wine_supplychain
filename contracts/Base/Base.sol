pragma solidity ^0.5.2;

import "../AccessControl/AccessControl.sol";

contract Base is AccessControl {

    // state of grape
    enum State {
        Harvested,
        Packed,
        BoughtByBrewer,
        Aged,
        Bottled,
        IdAssigned,
        BoughtByDistributor,
        ForSale,
        Purchased
    }

    struct grape {
        address owner;
        string farmerName;
        address farmerAddress;
        string brewerName;
        string productionId; // production ID by brewer
        address brewerAddress;
        address distributorAddress;
        State state;
        uint price; // final price to consumer
    }

    // store the grape batchId
    mapping(uint => grape) grapes;


    function checkGrape(uint _batchId) public view returns (address owner,string memory farmerName, address farmer, string memory brewerName, address brewer,address distributor,State state, uint price) {
        grape memory grapeBatch = grapes[_batchId];
        owner = grapeBatch.owner;
        farmerName = grapeBatch.farmerName;
        farmer = grapeBatch.farmerAddress;
        brewerName = grapeBatch.brewerName;
        brewer = grapeBatch.brewerAddress;
        distributor = grapeBatch.distributorAddress;
        state = grapeBatch.state;
        price = grapeBatch.price;
        //return (grapeBatch.owner, grapeBatch.farmerAddress, grapeBatch.brewerAddress, grapeBatch.distributorAddress, uint(grapeBatch.state));
    }

    function harvest(uint _batchId, string memory _farmerName) public onlyFarmer {
        // ensure batch id is unique
        require(grapes[_batchId].owner == address(0), "batch Id already exist");

        grape memory currentGrape;
        currentGrape.owner = msg.sender;
        currentGrape.farmerName = _farmerName;
        currentGrape.farmerAddress = msg.sender;
        currentGrape.state = State.Harvested;
        grapes[_batchId] = currentGrape;
    }

    function pack(uint _batchId) public onlyFarmer {
        grape storage currentGrape = grapes[_batchId];

        require(currentGrape.state == State.Harvested, "Grape has not been harvested");
        // make sure the original farmer is the one who can modify
        require(currentGrape.owner == msg.sender, "This grape does not belong to you");

        currentGrape.state = State.Packed;
    }

    function buyFromFarmer(uint _batchId, string memory _brewerName) public onlyBrewer {
        grape storage currentGrape = grapes[_batchId];
        require(currentGrape.state == State.Packed, "Grape has not been packed");

        currentGrape.owner = msg.sender;
        currentGrape.brewerName = _brewerName;
        currentGrape.brewerAddress = msg.sender;
        currentGrape.state = State.BoughtByBrewer;
    }

    function ferment(uint _batchId) public onlyBrewer {
        grape storage currentGrape = grapes[_batchId];

        require(currentGrape.state == State.BoughtByBrewer, "Grape has not been bought");
        // make sure the original brewer is the one who can modify
        require(currentGrape.owner == msg.sender, "This grape does not belong to you");

        currentGrape.state = State.Aged;
    }

    function bottle(uint _batchId) public onlyBrewer {
        grape storage currentGrape = grapes[_batchId];

        require(currentGrape.state == State.Aged, "Grape has not been aged");
        // make sure the original brewer is the one who can modify
        require(currentGrape.owner == msg.sender, "This grape does not belong to you");

        currentGrape.state = State.Bottled;
    }

    function assignProductionId(uint _batchId, string memory _productionId) public onlyBrewer {
        grape storage currentGrape = grapes[_batchId];

        require(currentGrape.state == State.Bottled, "Grape has not been bottled");
        // make sure the original brewer is the one who can modify
        require(currentGrape.owner == msg.sender, "This grape does not belong to you");

        currentGrape.productionId = _productionId;
        currentGrape.state = State.IdAssigned;
    }

    function buyWine(uint _batchId) public onlyDistributor {
        grape storage currentGrape = grapes[_batchId];

        require(currentGrape.state == State.IdAssigned, "Grape has not been assigned an ID");

        currentGrape.owner = msg.sender;
        currentGrape.distributorAddress = msg.sender;
        currentGrape.state = State.BoughtByDistributor;
    }

    function shipToShop(uint _batchId, uint _price) public onlyDistributor {
        grape storage currentGrape = grapes[_batchId];

        require(currentGrape.state == State.BoughtByDistributor, "Grape has not been bought");
        require(currentGrape.owner == msg.sender, "This grape does not belong to you");

        currentGrape.state = State.ForSale;
        currentGrape.price = _price;
    }

    function buyFromShop(uint _batchId) public payable {
        grape storage currentGrape = grapes[_batchId];

        require(currentGrape.state == State.ForSale, "Grape is not for sale");
        require(msg.value >= currentGrape.price, "Insufficient amount");

        currentGrape.owner = msg.sender;
        currentGrape.state = State.Purchased;

        uint _price = currentGrape.price;
        uint amountToReturn = msg.value - _price;
        msg.sender.transfer(amountToReturn);
    }
}


