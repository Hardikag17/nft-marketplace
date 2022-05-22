import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='true'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap'
            rel='stylesheet'
          />
          <Script
            src='https://kit.fontawesome.com/7412c21e0d.js'
            crossOrigin='anonymous'></Script>
        </Head>
        <body
          style={{
            backgroundColor: '#F2F2F2',
            margin: '0%',
            padding: '0%',
            height: '100vh',
          }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
