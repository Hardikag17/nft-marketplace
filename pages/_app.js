import '../styles/globals.css';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  return (
    <div className=' font-primary'>
      <nav className='border-b p-6'>
        <p className=' bg-blue-500 hover:brightness-125 border-lightblue rounded-lg p-3 text-blue font-bold text-2xl text-center'>
          NFT Marketplace
        </p>
        <div className='flex mt-4 justify-between'>
          <div>
            <Link href='/'>
              <a className='mr-6 text-blue-500'>Home</a>
            </Link>
            <Link href='/my-assets'>
              <a className='mr-6 text-blue-500'>Owned NFTs</a>
            </Link>
            <Link href='/creator-dashboard'>
              <a className='mr-6 text-blue-500'>Created NFTs</a>
            </Link>
          </div>
          <div>
            <Link href='/create-item'>
              <a className='p-3 text-white text-lg rounded-xl m-1 bg-blue-500 hover:bg-blue-600'>
                New NFT
              </a>
            </Link>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
