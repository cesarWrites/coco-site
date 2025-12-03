import '../styles/global.css';
import "../styles/custom.css";
import "../styles/category.css";
import "../styles/MainPrograms.module.css";
import "../styles/Navbar.css";
import "../styles/article.css";
import "../styles/CategoryCard.module.css";
import "../styles/LiveVideo.css";
import "../styles/advertising.css";
import "../styles/reels.css"; 
import "../styles/about.css"
import "../styles/classifieds.css";
import "../styles/searchbar.css"
import Head from 'next/head';
import SearchBar from '@/components/SearchBar';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
    <link rel="icon" href="/favicon.svg" /> 
    <title>COCO FM 98.9</title>
  </Head>
  <SearchBar/>
  <Component {...pageProps} />
  <Analytics /> 
  <SpeedInsights />    
  
  </>
  )
}

export default MyApp;
