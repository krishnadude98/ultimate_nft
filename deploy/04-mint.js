const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts }) {
  const { deployer } = await getNamedAccounts();

  //   //BasicNft
  //   const basicNft = await ethers.getContract("BasicNft", deployer);
  //   const basicMintTx = await basicNft.mintNft();
  //   await basicMintTx.wait(1);

  //   console.log(
  //     `Basic NFT index 0 with Token Uri ${await basicNft.tokenURI(0)} Minted`
  //   );

  // Random IPFS NFT
  const randomNft = await ethers.getContract("RandomIpfsNft", deployer);
  const mintFee = await randomNft.getMintFee();
  const randomIpfsNftMintTx = await randomNft.requestNft({
    value: mintFee.toString(),
  });
  const randomIpfsNftTxReciept = await randomIpfsNftMintTx.wait(1);

  await new Promise(async (resolve, reject) => {
    setTimeout(resolve, 600000);
    randomNft.once("NftMinted", async function () {
      resolve();
    });

    if (developmentChains.includes(network.name)) {
      const requestId =
        randomIpfsNftTxReciept.logs[1].args.requestId.toString();
      const vrfCoordinatorV2Mock = await ethers.getContract(
        "VRFCoordinatorV2Mock",
        deployer
      );
      await vrfCoordinatorV2Mock.fulfillRandomWords(
        requestId,
        randomNft.getAddress()
      );
    }
  });
  console.log(`Random ipfs NFT token 0 URI : ${await randomNft.tokenURI(0)}`);

  const dynamicNft = await ethers.getContract("DynamicNft", deployer);
  const highVal = ethers.parseEther("200");
  const dynamicNftMintTx = await dynamicNft.mintNft(highVal.toString());
  await dynamicNftMintTx.wait(1);
  console.log(`Dynamic NFT token 0 URI : ${await dynamicNft.tokenURI(0)}`);
};

module.exports.tags = ["all", "mint"];
