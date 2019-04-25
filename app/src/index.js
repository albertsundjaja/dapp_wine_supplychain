import Web3 from "web3";
import baseArtifact from "../../build/contracts/Base.json";


const App = {
    web3: null,
    account: null,
    meta: null,

    start: async function () {
        const {web3} = this;

        try {
            // get contract instance
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = baseArtifact.networks[networkId];
            this.meta = new web3.eth.Contract(
                baseArtifact.abi,
                deployedNetwork.address
            );

            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
        }
        catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    // this is for testing purpose as onlyOwner can add role
    // this function allow everyone to add role
    addRoleDebug: async function () {
        const {addRole} = this.meta.methods;
        const address = document.getElementById("addRoleAddress").value;
        const role = document.getElementById("addRoleSelect").value;
        let error = null;
        await addRole(address, role).send({from:this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("addRoleStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("addRoleStatus").innerHTML = "Role added (debug)";
    },

    addRole: async function () {
        const {addFarmer, addBrewer, addDistributor} = this.meta.methods;
        const address = document.getElementById("addRoleAddress").value;
        const role = document.getElementById("addRoleSelect").value;
        let error = null;
        switch (role) {
            case "1":
                await addFarmer(address).send({from: this.account}).catch((err) => error = err);
                break;
            case "2":
                await addBrewer(address).send({from: this.account}).catch((err) => error = err);
                break;
            case "3":
                await addDistributor(address).send({from: this.account}).catch((err) => error = err);
                break;
        }
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("addRoleStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("addRoleStatus").innerHTML = "Role added";
    },


    checkRole: async function () {
        const {isFarmer, isBrewer} = this.meta.methods;
        const address = document.getElementById("addRoleAddress").value;
        const role = document.getElementById("addRoleSelect").value;
        let error = null;
        let checkFarmer = await isBrewer(address).call({from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("addRoleStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        console.log(checkFarmer);
        document.getElementById("addRoleStatus").innerHTML = "Role added";
    },

    harvest: async function () {
        const {harvest} = this.meta.methods;
        const batchId = document.getElementById("harvestId").value;
        const farmName = document.getElementById("harvestFarmName").value;
        let error = null;
        await harvest(batchId, farmName).send({from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("harvestStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("harvestStatus").innerHTML = "Grape %i harvested".replace("%i", batchId);
    },

    pack: async function () {
        const {pack} = this.meta.methods;
        const batchId = document.getElementById("packId").value;
        let error = null;
        await pack(batchId).send({from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("packStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("packStatus").innerHTML = "Grape %i packed".replace("%i", batchId);
    },

    buyFromFarmer: async function () {
        const {buyFromFarmer} = this.meta.methods;
        const batchId = document.getElementById("buyFromFarmerId").value;
        const brewerName = document.getElementById("buyFromFarmerName").value;
        let error = null;
        await buyFromFarmer(batchId, brewerName).send({from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("buyFromFarmerStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("buyFromFarmerStatus").innerHTML = "Grape %i bought".replace("%i", batchId);
    },

    ferment: async function () {
        const {ferment} = this.meta.methods;
        const batchId = document.getElementById("fermentId").value;
        let error = null;
        await ferment(batchId).send({from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("fermentStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("fermentStatus").innerHTML = "Grape %i fermented".replace("%i", batchId);
    },

    bottle: async function () {
        const {bottle} = this.meta.methods;
        const batchId = document.getElementById("bottleId").value;
        let error = null;
        await bottle(batchId).send({from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("bottleStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("bottleStatus").innerHTML = "Grape %i bottled".replace("%i", batchId);
    },

    assignId: async function () {
        const {assignProductionId} = this.meta.methods;
        const batchId = document.getElementById("assignId").value;
        const productionId = document.getElementById("assignProductionId").value;
        console.log(productionId);
        let error = null;
        await assignProductionId(batchId, productionId).send({from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("assignStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("assignStatus").innerHTML = "Grape %i assigned with product id".replace("%i", batchId);
    },

    buyWine: async function () {
        const { buyWine } = this.meta.methods;
        const batchId = document.getElementById("buyWineId").value;
        let error = null;
        await buyWine(batchId).send({from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("buyWineStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("buyWineStatus").innerHTML = "Grape %i (Wine) has been bought".replace("%i", batchId);
    },

    shipToShop: async function () {
        const { shipToShop } = this.meta.methods;
        const batchId = document.getElementById("shipToShopId").value;
        const price = document.getElementById("shipToShopPrice").value;
        let error = null;
        await shipToShop(batchId, price).send({from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("shipToShopStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("shipToShopStatus").innerHTML = "Grape %i (Wine) has been shipped to shop".replace("%i", batchId);
    },

    getPrice: async function (batchId) {
        const { checkGrape } = this.meta.methods;
        const grape = await checkGrape(batchId).call({from:this.account});
        const price = grape['price'];
        return price;
    },

    checkGrape: async function () {
        const { checkGrape } = this.meta.methods;
        const batchId = document.getElementById("checkGrapeId").value;
        let error = null;
        const grape = await checkGrape(batchId).call({from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("checkGrapeStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        console.log(grape);
        // if it is empty then this grape doesnt exist
        if(grape['farmerName'] === "") {
            document.getElementById("checkGrapeStatus").innerHTML = "Grape doesn't exist";
            return;
        }
        let state = "";
        switch (grape['state']) {
            case "0":
                state = "Harvested";
                break;
            case "1":
                state = "Packed";
                break;
            case "2":
                state = "Bought By Brewer";
                break;
            case "3":
                state = "Aged";
                break;
            case "4":
                state = "Bottled";
                break;
            case "5":
                state = "Assigned ID by Brewer";
                break;
            case "6":
                state = "Bought by distributor";
                break;
            case "7":
                state = "For Sale";
                break;
            case "8":
                state = "Purchased by end consumer";
                break;
        }
        let grapeStatus =
            "Owner:" + grape['owner'] + "<br/>" +
                "Farmer name:" + grape['farmerName'] + "<br/>" +
                "Brewer name:" + grape['brewerName'] + "<br/>" +
                "Wine ID:" + grape['productionId'] + "<br/>" +
                "Distributor price:" + grape['price'] + "<br/>" +
                "State:" + state;
        document.getElementById("checkGrapeStatus").innerHTML = grapeStatus;
    },

    buyFromShop: async function () {
        const { buyFromShop } = this.meta.methods;
        const batchId = document.getElementById("buyFromShopId").value;
        const price = await this.getPrice(batchId);
        let error = null;
        await buyFromShop(batchId).send({value:price, from: this.account}).catch((err) => error = err);
        // if there is error, display it
        if (error != null) {
            console.log(error);
            document.getElementById("buyFromShopStatus").innerHTML = "Unable to process transaction - check console message";
            return;
        }
        document.getElementById("buyFromShopStatus").innerHTML = "Grape %i (Wine) has been bought".replace("%i", batchId);
    }
};

window.App = App;

window.addEventListener("load", function () {
    if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable(); // get permission to access accounts
    } else {
        console.warn(
            "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
        );
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(
            new Web3.providers.HttpProvider("http://127.0.0.1:9545"),
        );
    }

    App.start();
});
