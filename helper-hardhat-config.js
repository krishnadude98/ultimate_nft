const networkConfig = {
  11155111: {
    name: "sepolia",
    ethUsdPrice: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    mintFee: "10000000000000000",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    subsriptionId: "3839",
    callBackGasLimit: 500000,
    interval: "30",
  },
  5: {
    name: "gorelli",
    ethUsdPrice: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    mintFee: "10000000000000000",
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subsriptionId: "10485",
    callBackGasLimit: 500000,
    interval: "30",
  },
  80001: {
    name: "polygon",
    ethUsdPrice: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676",
    vrfCoordinatorV2: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
    mintFee: "10000000000000000",
    gasLane:
      "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
    subsriptionId: "0",
    callBackGasLimit: 500000,
    interval: "30",
  },
  31337: {
    name: "hardhat",
    mintFee: "10000000000000000",
    gasLane:
      "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
    callBackGasLimit: 500000,
    interval: "30",
  },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
};
