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
    await instance.harvest('Awesome Farm', {from: accounts[1]});
    let grapeDetail = await instance.checkGrape.call(0);
    assert.equal(grapeDetail['owner'], accounts[1]);
    assert.equal(grapeDetail['farmer'], accounts[1]);
});

it('can be packed', async() => {
    let instance = await Base.deployed();
    await instance.harvest('Awesome Farm', {from: accounts[1]});
    let grapeDetail = await instance.checkGrape.call(0);
    assert.equal(grapeDetail['owner'], accounts[1]);
    assert.equal(grapeDetail['farmer'], accounts[1]);
    assert.equal(grapeDetail['farmerName'], "Awesome Farm");
});
