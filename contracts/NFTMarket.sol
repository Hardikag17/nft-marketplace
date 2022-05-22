// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _nftIds;
    Counters.Counter private _nftsSold;

    address payable owner;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct NftItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => NftItem) private idToNftItem;

    event NftCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // get listing price
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // create new NFT
    function createNftItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _nftIds.increment();
        uint256 itemId = _nftIds.current();

        idToNftItem[itemId] = NftItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit NftCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    // sell owned NFT
    function sellItem(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToNftItem[itemId].price;
        uint256 tokenId = idToNftItem[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        idToNftItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToNftItem[itemId].owner = payable(msg.sender);
        idToNftItem[itemId].sold = true;
        _nftsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    // get all NFTs for sale
    function fetchNftItems() public view returns (NftItem[] memory) {
        uint256 itemCount = _nftIds.current();
        uint256 unsoldItemCount = _nftIds.current() - _nftsSold.current();
        uint256 currentIndex = 0;

        NftItem[] memory items = new NftItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToNftItem[i + 1].owner == address(0)) {
                uint256 currentId = idToNftItem[i + 1].itemId;
                NftItem storage currentItem = idToNftItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // get NFTs owned by user
    function fetchMyNFTs() public view returns (NftItem[] memory) {
        uint256 totalItemCount = _nftIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToNftItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        NftItem[] memory items = new NftItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToNftItem[i + 1].owner == msg.sender) {
                uint256 currentId = idToNftItem[i + 1].itemId;
                NftItem storage currentItem = idToNftItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // get NFTs created by user
    function fetchNftsCreated() public view returns (NftItem[] memory) {
        uint256 totalItemCount = _nftIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToNftItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        NftItem[] memory items = new NftItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToNftItem[i + 1].seller == msg.sender) {
                uint256 currentId = idToNftItem[i + 1].itemId;
                NftItem storage currentItem = idToNftItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
