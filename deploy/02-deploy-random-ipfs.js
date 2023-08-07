const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {
  storeImages,
  storeTokenUriMetadata,
} = require("../utils/uploadToPinata");
const FUND_AMOUNT = "1000000000000000000000";
const imageLoacation = "./images/random";
const metadataTemplete = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      triat_type: "Cuteness",
      value: 100,
    },
  ],
};

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Mock;

  let tokenUris = [
    "ipfs://QmeuwrcHYfp78g75bTFyDQ5CXcdy6d8ofVm67rhpaH5uyL",
    "ipfs://QmP51JZmTFt6d3T1hGrRCxCgrqb7VGirKqsZThm5fPv7WD",
    "ipfs://QmRMyxWmArz1zL39TPEtExjf2hBjxaFnBG7YGNB31gMuNH",
  ];
  //get ipfs hashes
  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUpload();
  }

  let vrfCoordinatorV2Address, subsriptionId;
  if (developmentChains.includes(network.name)) {
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = await vrfCoordinatorV2Mock.getAddress();
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReciept = await tx.wait();

    subsriptionId = await txReciept.logs[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subsriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subsriptionId = networkConfig[chainId].subsriptionId;
  }
  log("-------------------------------------------------");
  const args = [
    vrfCoordinatorV2Address,
    subsriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].callBackGasLimit,
    tokenUris,
    networkConfig[chainId].mintFee,
  ];

  const randomIpfsNft = await deploy("RandomIpfsNft", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (developmentChains.includes(network.name)) {
    await vrfCoordinatorV2Mock.addConsumer(
      subsriptionId,
      randomIpfsNft.address
    );
  }

  if (
    !developmentChains.includes(network.name) &&
    (process.env.POLYGON_API_KEY || process.env.ETHERSCAN_API_KEY)
  ) {
    log("Verifying..........");
    await verify(randomIpfsNft.address, args);
  }

  // await storeImages(imageLoacation);
};

async function handleTokenUpload() {
  let tokenUris = [];
  const { reponses: imageUploadReponses, files } = await storeImages(
    imageLoacation
  );

  for (imageUploadResponseIndex in imageUploadReponses) {
    let tokenUriMetadata = { ...metadataTemplete };
    tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "");
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pub`;
    tokenUriMetadata.image = `ipfs://${imageUploadReponses[imageUploadResponseIndex].IpfsHash}`;
    const metadtaUploadResponse = await storeTokenUriMetadata(tokenUriMetadata);
    tokenUris.push(`ipfs://${metadtaUploadResponse.IpfsHash}`);
  }
  console.log("token uris uploaded they are");
  console.log(tokenUris);
  return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];
