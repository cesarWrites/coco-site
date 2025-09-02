import { useState, useEffect } from 'react';
import { FaBroadcastTower } from 'react-icons/fa'; 
import Navbar from "../components/Navbar";
import NewsCard from "../components/NewsCard";
import AdsBanner from "../components/AdsBanner";
import MainPrograms from "@/components/MainPrograms";
import Footer from "@/components/Footer";
import LiveStreamCard from "@/components/LiveStreamCard";
import LiveVideoStream from "@/components/LiveVideoChannel";
import Link from 'next/link';
import MainNewsCard from "@/components/MainNewsCard";
import { normalizeArticle } from "@/utils/normalizeArticles";


export default function Home({ articles }) {
  const [showLive, setShowLive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const normalizedArticles = articles.map(normalizeArticle);

  const main = normalizedArticles[0];
  const sideArticles = normalizedArticles.slice(1, 5);
  const moreArticles = normalizedArticles.slice(1,12);
  const latestArticles = normalizedArticles.slice(5, 15);
  const trendingArticles = normalizedArticles.slice(5, 15);
  const editorsPicks = normalizedArticles.slice(1, 20);
  const businessArticles = normalizedArticles.slice(5,20);
  const healthArticles = normalizedArticles.slice(5, 15);
  const educationArticles = normalizedArticles.slice(1, 30);
  const entertainmentArticles = normalizedArticles.slice(5, 25);
  const sportsArticles = normalizedArticles.slice(5, 30);
  const categorySlug = normalizedArticles.categorySlug;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 


  return (
    <div className="page-wrapper">
      <div className="h-[10vh]">
        <Navbar />
      </div>
      <main className="main-content">
        <div className="home-container">
          <MainPrograms />
          <LiveVideoStream/>

          {/* Top Stories */}
          <section className="top-stories">
            <h2>
              <a href="/news">Top Stories</a>
            </h2>
            <hr />
            <div className="top-section">
              <div className="main-article">
                <MainNewsCard article={main} isMain />
              </div>
              <div className="side-articles">
                {sideArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </section>

          {/* More Articles */}
          <div className="more-articles">
            {moreArticles.map((article) => (
              <NewsCard key={article.id} article={article} compact />
            ))}
          </div>

          {/* Editor's Corner */}
          <section className="editors-corner">
            <h2 className="section-title">Editor's Corner</h2>
            <div className="editors-grid">
              <div className="editors-col">
                <h4>Latest</h4>
                <hr />
                {latestArticles.map((article) => (
                  <Link href={`/${categorySlug}/${article.id}/${article.slug}`} className="article-link">
                  <div key={article.id} className="snippet-text">
                    <h5 dangerouslySetInnerHTML={{ __html: article.title }} />
                    <small>
                      {article.authorName} &bull; {article.timeAgo}
                    </small>
                    <hr />
                  </div>
                  </Link>
                ))}
              </div>
              <div className="editors-col">
                <h4>Now Trending</h4>
                {trendingArticles.map((article) => (
                  <Link href={`/${article.categorySlug}/${article.id}/${article.slug}`}>
                  <div key={article.id} className="snippet-horizontal">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="snippet-img-left"
                    />
                    <div>
                      <h5 dangerouslySetInnerHTML={{ __html: article.title }} />
                      <small>
                        {article.authorName} &bull; {article.timeAgo}
                      </small>
                    </div>
                    <hr />
                  </div>
                  </Link>
                ))}
              </div>
              <div className="editors-col">
                <h4>Editor's Picks</h4>
                {editorsPicks.map((article) => (
                  <Link href={`/${article.categorySlug}/${article.id}/${article.slug}`}>
                  <div key={article.id} className="snippet-horizontal">
                    <div>
                      <h5 dangerouslySetInnerHTML={{ __html: article.title }} />
                      <small>
                        {article.authorName} &bull; {article.timeAgo}
                      </small>
                    </div>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="snippet-img-right"
                    />
                    <hr />
                  </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="category-section">
            <div className="category-header">
              <h2 className="section-title">
                <a href="/business">Business</a>
              </h2>
            </div>
            <hr />
            <div className="category-grid">
              {businessArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
          <section className="health-section">
  <div className="section-header">
    <h2 className="section-title">
    <a href="/health">Health & Wellness</a></h2>
  </div>
  <hr/>

  <div className="health-grid">
    {/* Left Column - 2 stacked articles */}
    <div className="health-col left-col">
      {healthArticles.slice(0, 2).map(article => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>

    {/* Middle Column - Featured article */}
    <div className="health-col middle-col">
      <NewsCard article={healthArticles[2]} large />
    </div>

    {/* Right Column - 4 title/category/author/time entries */}
    <div className="health-col right-col">
      {healthArticles.slice(3, 7).map(article => (
        <Link href={`/${article.categorySlug}/${article.id}/${article.slug}`}>
        <div key={article.id} className="article-snippet">
          <h4 className="snippet-title">{article.title}</h4>
          <p className="snippet-meta">
            <span className="category">{article.category}</span> •{" "}
            <span className="author">{article.author}</span> •{" "}
            <span className="time">{article.timeAgo}</span>
          </p>
          <hr />
        </div>
        </Link>
      ))}
    </div>
  </div>
</section>
<section className="entertainment-section">
  <h2 className="section-title"><a href="/entertainment">Entertainment & Style</a></h2>
  <hr/>

  {/* Row 1: Single wide featured article */}
  <div className="ent-row row-1">
    <NewsCard article={entertainmentArticles[0]} large />
  </div>

  {/* Row 2: Two side-by-side */}
  <div className="ent-row row-2">
    {entertainmentArticles.slice(1, 3).map((article) => (
      <NewsCard key={article.id} article={article} />
    ))}
  </div>

  {/* Row 3: Four horizontally aligned */}
  <div className="ent-row row-3">
    {entertainmentArticles.slice(3, 7).map((article) => (
      <NewsCard key={article.id} article={article} compact />
    ))}
  </div>
</section>
<section className="sports-section">
  <h2 className="section-title"><a href="/sports">Sports</a></h2>
  <hr/>

  <div className="sports-grid">
    {/* Column 1 */}
    <div className="sports-col">
      {sportsArticles.slice(0, 2).map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>

    {/* Column 2 */}
    <div className="sports-col">
      {sportsArticles.slice(2, 5).map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>

    {/* Column 3 */}
    <div className="sports-col">
      {sportsArticles.slice(5, 9).map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  </div>
</section>

        </div>
      </main>
      <Footer />
      {(isMobile && !showLive) &&(
        <div
          className="floating-live-icon"
          onClick={() => setShowLive(prev => !prev)}
          aria-label="Toggle Live Stream"
        >
          <FaBroadcastTower className="live-icon" />
        </div>
      )}

     
      {(showLive || !isMobile) && (
        <div className="live-stream-card-wrapper">
          <LiveStreamCard />
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const res = await fetch(
      `https://cocomedia.co.ke/wp-json/wp/v2/posts?_embed=1&per_page=50&orderby=date&order=desc`,
      { next: { revalidate: 1800 } }
    );

    if (!res.ok) {
      console.error(`Failed to fetch articles: ${res.status}`);
      return { props: { articles: [] }, revalidate: 1800 };
    }

    let articlesRaw = [];
    try {
      articlesRaw = await res.json();
      if (!Array.isArray(articlesRaw)) {
        console.error("API did not return an array for articles.");
        return { props: { articles: [] }, revalidate: 1800 };
      }
    } catch (parseErr) {
      console.error("Error parsing articles JSON:", parseErr);
      return { props: { articles: [] }, revalidate: 1800 };
    }

    const articles = articlesRaw.map(article => {
      try {
        let authorName = "Unknown Author";

        if (article.author && typeof article.author === "string") {
          authorName = article.author;
        } else if (article._embedded?.author?.[0]?.name) {
          authorName = article._embedded.author[0].name;
        } else if (article.yoast_head_json?.schema?.["@graph"]) {
          const authorObj = article.yoast_head_json.schema["@graph"]
            .find(item => item["@type"] === "Person" && item.name);
          if (authorObj) {
            authorName = authorObj.name;
          }
        }

        return { ...article, authorName };
      } catch (err) {
        console.error(`Error processing article ID ${article?.id}:`, err);
        return { ...article, authorName: "Unknown Author" };
      }
    });

    return {
      props: { articles },
      revalidate: 1800,
    };

  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      props: { articles: [] },
      revalidate: 1800,
    };
  }
}

