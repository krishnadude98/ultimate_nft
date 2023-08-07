//SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";

error tokenURI__InvalidToken(uint256 tokenId);

contract DynamicNft is ERC721 {
    uint256 private s_tokenCounter;
    string private i_lowImageUri;
    string private i_highImageUri;
    string private constant base64EncodedPrefix = "data:image/svg+xml;base64,";
    AggregatorV3Interface internal immutable i_priceFeed;
    mapping(uint256 => int256) tokeninToHighValue;

    event CreatedNft(uint256 indexed tokenId, int256 highValue);

    constructor(
        address priceFeed,
        string memory lowSvg,
        string memory highSvg
    ) ERC721("DYNAMICNFT Nft", "DSN") {
        i_priceFeed = AggregatorV3Interface(priceFeed);
        s_tokenCounter = 0;
        i_lowImageUri = svgToImageUri(lowSvg);
        i_highImageUri = svgToImageUri(highSvg);
    }

    function svgToImageUri(string memory svg) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(base64EncodedPrefix, svgBase64Encoded));
    }

    function mintNft(int256 highValue) public {
        uint256 currentIndex = s_tokenCounter;
        s_tokenCounter++;
        tokeninToHighValue[currentIndex] = highValue;
        _safeMint(msg.sender, currentIndex);
        emit CreatedNft(currentIndex, highValue);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert tokenURI__InvalidToken(tokenId);
        }
        string memory ImgUri = i_lowImageUri;
        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        if (price >= tokeninToHighValue[tokenId]) {
            ImgUri = i_highImageUri;
        }
        return (
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(),
                                '", "description":"nft changes with price of ETH",',
                                '"attributes":[{"trait_type":"cuteness","value":100}],"image":"',
                                ImgUri,
                                '"}'
                            )
                        )
                    )
                )
            )
        );
    }


    function getLowSVG() public view returns (string memory) {
        return i_lowImageUri;
    }

    function getHighSVG() public view returns (string memory) {
        return i_highImageUri;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
