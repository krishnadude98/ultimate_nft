const { ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

const BASE_FEE = "250000000000000000"; //base fee
const DECIMALS = 8;
const INITIAL_PRICE = "200000000000000000000";
const GAS_PRICE_LINK = 1e9;
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    console.log(`Local network detected ! Deploying mocks....`);

    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: [BASE_FEE, GAS_PRICE_LINK],
    });

    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });
    console.log("-------------------------------");
    console.log("MOcks Deployed");
  }
};

module.exports.tags = ["all", "mocks"];
