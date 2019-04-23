const AccessControl = artifacts.require("AccessControl");
const Base = artifacts.require("Base");

var accounts;
var owner;

contract('Base', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

beforeEach(async() => {
    let instance = await Base.deployed();
    await instance.addFarmer(accounts[1], {from: accounts[0]});
    await instance.addBrewer(accounts[2], {from: accounts[0]});
    await instance.addDistributor(accounts[3], {from: accounts[0]});
});


it('can be harvested', async() => {
    let instance = await Base.deployed();
    await instance.harvest(0,'Awesome Farm', {from: accounts[1]});
    let grapeDetail = await instance.checkGrape.call(0);
    // check all the details are correct
    assert.equal(grapeDetail['owner'], accounts[1]);
    assert.equal(grapeDetail['farmer'], accounts[1]);
    assert.equal(grapeDetail['farmerName'], "Awesome Farm");
    assert.equal(grapeDetail['state'], 0);
});

it('can be packed', async() => {
    let instance = await Base.deployed();
    await instance.harvest(1,'Awesome Farm', {from: accounts[1]});
    await instance.pack(1,{from: accounts[1]} );
    let grapeDetail = await instance.checkGrape.call(1);
    // check updated state
    assert.equal(grapeDetail['state'], 1);
});

it('can be bought by brewer', async() => {
    let instance = await Base.deployed();
    await instance.harvest(2,'Awesome Farm', {from: accounts[1]});
    await instance.pack(2,{from: accounts[1]} );
    await instance.buyFromFarmer(2, "Excellent Brewer", {from:accounts[2]});
    let grapeDetail = await instance.checkGrape.call(2);
    // check detail
    assert.equal(grapeDetail['owner'], accounts[2]);
    assert.equal(grapeDetail['brewerName'], "Excellent Brewer");
    assert.equal(grapeDetail['brewer'], accounts[2]);
    assert.equal(grapeDetail['state'], 2);
});

it('can be fermented', async() => {
    let instance = await Base.deployed();
    await instance.harvest(3,'Awesome Farm', {from: accounts[1]});
    await instance.pack(3,{from: accounts[1]} );
    await instance.buyFromFarmer(3, "Excellent Brewer", {from:accounts[2]});
    await instance.ferment(3, {from:accounts[2]});
    let grapeDetail = await instance.checkGrape.call(3);
    // check updated state
    assert.equal(grapeDetail['state'], 3);
});

it('can be bottled', async() => {
    let instance = await Base.deployed();
    await instance.harvest(4,'Awesome Farm', {from: accounts[1]});
    await instance.pack(4,{from: accounts[1]} );
    await instance.buyFromFarmer(4, "Excellent Brewer", {from:accounts[2]});
    await instance.ferment(4, {from:accounts[2]});
    await instance.bottle(4, {from:accounts[2]});
    let grapeDetail = await instance.checkGrape.call(4);
    // check updated state
    assert.equal(grapeDetail['state'], 4);
});

it('can be assigned an Id', async() => {
    let instance = await Base.deployed();
    await instance.harvest(5,'Awesome Farm', {from: accounts[1]});
    await instance.pack(5,{from: accounts[1]} );
    await instance.buyFromFarmer(5, "Excellent Brewer", {from:accounts[2]});
    await instance.ferment(5, {from:accounts[2]});
    await instance.bottle(5, {from:accounts[2]});
    await instance.assignProductionId(5, "123123", {from:accounts[2]});
    let grapeDetail = await instance.checkGrape.call(5);
    // check updated state
    assert.equal(grapeDetail['state'], 5);
});

it('can be bought by distributor', async() => {
    let instance = await Base.deployed();
    await instance.harvest(6,'Awesome Farm', {from: accounts[1]});
    await instance.pack(6,{from: accounts[1]} );
    await instance.buyFromFarmer(6, "Excellent Brewer", {from:accounts[2]});
    await instance.ferment(6, {from:accounts[2]});
    await instance.bottle(6, {from:accounts[2]});
    await instance.assignProductionId(6, "123123", {from:accounts[2]});
    await instance.buyWine(6, {from:accounts[3]});
    let grapeDetail = await instance.checkGrape.call(6);
    // check detail
    assert.equal(grapeDetail['owner'], accounts[3]);
    assert.equal(grapeDetail['distributor'], accounts[3]);
    assert.equal(grapeDetail['state'], 6);
});

it('can be shipped to shop', async() => {
    let instance = await Base.deployed();
    await instance.harvest(7,'Awesome Farm', {from: accounts[1]});
    await instance.pack(7,{from: accounts[1]} );
    await instance.buyFromFarmer(7, "Excellent Brewer", {from:accounts[2]});
    await instance.ferment(7, {from:accounts[2]});
    await instance.bottle(7, {from:accounts[2]});
    await instance.assignProductionId(7, "123123", {from:accounts[2]});
    await instance.buyWine(7, {from:accounts[3]});
    await instance.shipToShop(7, 1, {from:accounts[3]});
    let grapeDetail = await instance.checkGrape.call(7);
    // check detail;
    assert.equal(grapeDetail['state'], 7);
    assert.equal(grapeDetail['price'], 1);
});

it('can be bought by anyone', async() => {
    let instance = await Base.deployed();
    await instance.harvest(8,'Awesome Farm', {from: accounts[1]});
    await instance.pack(8,{from: accounts[1]} );
    await instance.buyFromFarmer(8, "Excellent Brewer", {from:accounts[2]});
    await instance.ferment(8, {from:accounts[2]});
    await instance.bottle(8, {from:accounts[2]});
    await instance.assignProductionId(8, "123123", {from:accounts[2]});
    await instance.buyWine(8, {from:accounts[3]});
    await instance.shipToShop(8, 1, {from:accounts[3]});
    await instance.buyFromShop(8, {from:accounts[4], value:1});
    let grapeDetail = await instance.checkGrape.call(8);
    // check detail;
    assert.equal(grapeDetail['owner'], accounts[4]);
    assert.equal(grapeDetail['state'], 8);
});

it('can be bought only when paid enough', async() => {
    let instance = await Base.deployed();
    await instance.harvest(9, 'Awesome Farm', {from: accounts[1]});
    await instance.pack(9,{from: accounts[1]} );
    await instance.buyFromFarmer(9, "Excellent Brewer", {from:accounts[2]});
    await instance.ferment(9, {from:accounts[2]});
    await instance.bottle(9, {from:accounts[2]});
    await instance.assignProductionId(9, "123123", {from:accounts[2]});
    await instance.buyWine(9, {from:accounts[3]});
    await instance.shipToShop(9, 10, {from:accounts[3]});
    let error = null;
    await instance.buyFromShop(9, {from:accounts[4], value:1}).catch((err) => error = err);
    // if the promise is returning error, that means it works fine
    assert.notEqual(error, null);
});

