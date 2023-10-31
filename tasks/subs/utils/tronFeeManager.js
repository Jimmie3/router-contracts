const { BigNumber } = require("ethers");
let { readFromFile, writeToFile } = require("../../../utils/create.js");
let { deploy_contract, getTronWeb } = require("../../../utils/tronUtil.js");

exports.deployFeeManager = async function (artifacts, network) {
    let tronWeb = await getTronWeb(network);
    console.log("deployer :", tronWeb.defaultAddress);

    let deployer = tronWeb.defaultAddress.hex.replace(/^(41)/, "0x");

    let feeManager = await deploy_contract(artifacts, "FeeManager", [deployer], tronWeb);
    console.log("FeeManager address :", feeManager);
    let deploy = await readFromFile(network);
    deploy[network]["FeeManager"] = feeManager;
    await writeToFile(deploy);
    return feeManager;
};

exports.initialFeeStruct = async function (artifacts, network, receiver, tokenFeeRate, fixedNative, share) {
    let tronWeb = await getTronWeb(network);
    let deployer = "0x" + tronWeb.defaultAddress.hex.substring(2);
    console.log("deployer :", tronWeb.address.fromHex(deployer));
    let deploy = await readFromFile(network);
    if (!deploy[network]["FeeManager"]) {
        throw "FeeManager not deploy";
    }
    let FeeManager = await artifacts.readArtifact("FeeManager");
    let address = deploy[network]["FeeManager"];
    if (address.startsWith("0x")) {
        address = tronWeb.address.fromHex(address);
    }
    let feeManager = await tronWeb.contract(FeeManager.abi, address);
    let fee = [receiver, tokenFeeRate, fixedNative, share];
    let result = await feeManager.initialFeeStruct(fee).send();
    console.log(result);
};

exports.setIntegratorFees = async function (
    artifacts,
    network,
    integrator,
    openliqReceiver,
    fixedNative,
    tokenFeeRate,
    share
) {
    let tronWeb = await getTronWeb(network);
    let deployer = "0x" + tronWeb.defaultAddress.hex.substring(2);
    console.log("deployer :", tronWeb.address.fromHex(deployer));
    let deploy = await readFromFile(network);
    if (!deploy[network]["FeeManager"]) {
        throw "FeeManager not deploy";
    }
    let FeeManager = await artifacts.readArtifact("FeeManager");
    let address = deploy[network]["FeeManager"];
    if (address.startsWith("0x")) {
        address = tronWeb.address.fromHex(address);
    }
    let feeManager = await tronWeb.contract(FeeManager.abi, address);
    let fee = [openliqReceiver, fixedNative, tokenFeeRate, share];
    let result = await feeManager.setIntegratorFees(integrator, fee).send();
    console.log(result);
};
