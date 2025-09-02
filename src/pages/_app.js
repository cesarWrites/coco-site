import '../styles/global.css';
import "../styles/custom.css";
import "../styles/category.css";
import "../styles/MainPrograms.module.css";
import "../styles/Navbar.css";
import "../styles/article.css";
import "../styles/CategoryCard.module.css";
import "../styles/LiveVideo.css";

import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
    <link rel="icon" href="/favicon.svg" /> 
    <title>COCO FM</title>
  </Head>
  <Component {...pageProps} />
  </>
  )
}

export default MyApp
