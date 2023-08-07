const { network, ethers } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let ethUsdPriceFeedAddress;

  const chainId = network.config.chainId;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPrice;
  }
  const lowSvg = fs.readFileSync("./images/dynamicNft/frown.svg", {
    encoding: "utf8",
  });
  const highSvg = fs.readFileSync("./images/dynamicNft/happy.svg", {
    encoding: "utf8",
  });

  const args = [ethUsdPriceFeedAddress, lowSvg, highSvg];
  const dynamicSvgNft = await deploy("DynamicNft", {
    from: deployer,
    args: args,
    log: true,
    gas: 1e18,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.POLYGON_API_KEY
  ) {
    log("Verifying..........");
    await verify(dynamicSvgNft.address, args);
  }
};

module.exports.tags = ["all", "dynamicnft", "main"];
