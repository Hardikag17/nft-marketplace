import '../styles/globals.css';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  return (
    <div className=' font-primary'>
      <nav className='border-b p-6'>
        <p className=' bg-pink-500 hover:brightness-125 border-lightblue rounded-lg p-3 text-blue font-bold text-2xl text-center'>
          NFT Marketplace
        </p>
        <div className='flex mt-4'>
          <Link href='/'>
            <a className='mr-6 text-pink-500'>Home</a>
          </Link>
          <Link href='/create-item'>
            <a className='mr-6 text-pink-500'>Create Digital Asset</a>
          </Link>
          <Link href='/my-assets'>
            <a className='mr-6 text-pink-500'>My Digital Assets</a>
          </Link>
          <Link href='/creator-dashboard'>
            <a className='mr-6 text-pink-500'>Creator Dashboard</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
