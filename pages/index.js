import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { nftaddress, nftmarketaddress } from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import Image from 'next/image';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    if (!window.ethereum) alert('wallet not found');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState('loaded');
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }

  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className='px-20 py-10 text-3xl'>No items in marketplace</h1>;

  return (
    <div className='w-full flex flex-col justify-center items-center px-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {nfts.map((nft, i) => (
          <div key={i} className='rounded-xl flex flex-col justify-between'>
            <Image
              src={nft.image}
              alt={nft.name}
              layout='intrinsic'
              width={500}
              height={500}
              className='rounded-t-xl'
            />
            <div className='p-4'>
              <p style={{ height: '64px' }} className='text-2xl font-semibold'>
                {nft.name}
              </p>
              <div className='h-8 text-ellipsis'>
                <p className='text-gray-400'>{nft.description}</p>
              </div>
            </div>
            <div className='p-4 bg-black rounded-b-xl'>
              <p className='text-2xl mb-4 font-bold text-white'>
                {nft.price} Matic
              </p>
              <button
                className='w-full bg-blue-500 text-white font-bold py-2 px-12 rounded'
                onClick={() => buyNft(nft)}>
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
