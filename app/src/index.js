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
                deployedNetwork.address,
            );

            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
        }
        catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    addRole: async function () {
        const {addFarmer, addBrewer, addDistributor} = this.meta.methods;
        const address = document.getElementById("addRoleAddress").value;
        const role = document.getElementById("addRoleSelect").value;
        let error = null;
        console.log(role);
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
            document.getElementById("addRoleStatus").innerHTML = "Unable to process transaction - are you allowed to access this endpoint?";
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
            document.getElementById("addRoleStatus").innerHTML = "Unable to process transaction - are you allowed to access this endpoint?";
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
            document.getElementById("harvestStatus").innerHTML = "Unable to process transaction - are you allowed to access this endpoint?";
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
            document.getElementById("packStatus").innerHTML = "Unable to process transaction - are you allowed to access this endpoint?";
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
            document.getElementById("buyFromFarmerStatus").innerHTML = "Unable to process transaction - are you allowed to access this endpoint?";
            return;
        }
        document.getElementById("buyFromFarmerStatus").innerHTML = "Grape %i bought".replace("%i", batchId);
    },


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
