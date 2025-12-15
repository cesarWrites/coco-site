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
import { safeFetchJson } from '@/utils/safeJson';
import { useArticleStore } from '@/store/articles';
import SearchBar from '@/components/SearchBar';

export default function Home({ articles }) {
  const [showLive, setShowLive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);



  const normalizedArticles = articles.map(normalizeArticle);
  const setManyArticles = useArticleStore((s) => s.setManyArticles);

  // ✅ Preload into store so SlugPage has instant access
  useEffect(() => {
    if (articles?.length) {
      setManyArticles(articles);
    }
  }, [articles, setManyArticles]);

  const main = normalizedArticles[0];
  const sideArticles = normalizedArticles.slice(1, 5);
  const moreArticles = normalizedArticles.slice(1, 12);
  const latestArticles = normalizedArticles.slice(5, 15);
  const trendingArticles = normalizedArticles.slice(5, 15);
  const editorsPicks = normalizedArticles.slice(1, 20);
  const businessArticles = normalizedArticles.slice(5, 20);
  const healthArticles = normalizedArticles.slice(5, 15);
  const entertainmentArticles = normalizedArticles.slice(5, 25);
  const sportsArticles = normalizedArticles.slice(5, 30);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div>
      <div className="page-wrapper">
        <div className="h-[10vh]">
          <Navbar />
        </div>
        <main className="main-content">
          <div className="home-container">
            {/* <MainPrograms /> */}
        <div className="main-programs-wrapper">

      <MainPrograms />
</div>
            <LiveVideoStream />

            {/* Top Stories */}
            <section className="top-stories">
              <h2><a href="/news">Top Stories</a></h2>
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
                    <Link
                      key={article.id}
                      href={`/${article.categorySlug}/${article.id}/${article.slug}`}
                      className="article-link"
                    >
                      <div className="snippet-text">
                        <h5 dangerouslySetInnerHTML={{ __html: article.title }} />
                        <small>{article.authorName} • {article.timeAgo}</small>
                        <hr />
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="editors-col">
                  <h4>Now Trending</h4>
                  {trendingArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/${article.categorySlug}/${article.id}/${article.slug}`}
                    >
                      <div className="snippet-horizontal">
                        <img src={article.image} alt={article.title} className="snippet-img-left" />
                        <div>
                          <h5 dangerouslySetInnerHTML={{ __html: article.title }} />
                          <small>{article.authorName} • {article.timeAgo}</small>
                        </div>
                        <hr />
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="editors-col">
                  <h4>Editor's Picks</h4>
                  {editorsPicks.map((article) => (
                    <Link
                      key={article.id}
                      href={`/${article.categorySlug}/${article.id}/${article.slug}`}
                    >
                      <div className="snippet-horizontal">
                        <div>
                          <h5 dangerouslySetInnerHTML={{ __html: article.title }} />
                          <small>{article.authorName} • {article.timeAgo}</small>
                        </div>
                        <img src={article.image} alt={article.title} className="snippet-img-right" />
                        <hr />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Business */}
            <section className="category-section">
              <h2 className="section-title"><a href="/business">Business</a></h2>
              <hr />
              <div className="category-grid">
                {businessArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            {/* Health */}
            <section className="health-section">
              <h2 className="section-title"><a href="/health">Health & Wellness</a></h2>
              <hr />
              <div className="health-grid">
                <div className="health-col left-col">
                  {healthArticles.slice(0, 2).map((a) => <NewsCard key={a.id} article={a} />)}
                </div>
                <div className="health-col middle-col">
                  <NewsCard article={healthArticles[2]} large />
                </div>
                <div className="health-col right-col">
                  {healthArticles.slice(3, 7).map((a) => (
                    <Link key={a.id} href={`/${a.categorySlug}/${a.id}/${a.slug}`}>
                      <div className="article-snippet">
                        <h4 className="snippet-title">{a.title}</h4>
                        <p className="snippet-meta">
                          <span className="category">{a.category}</span> •
                          <span className="author">{a.author}</span> •
                          <span className="time">{a.timeAgo}</span>
                        </p>
                        <hr />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Entertainment */}
            <section className="entertainment-section">
              <h2 className="section-title"><a href="/entertainment">Entertainment & Style</a></h2>
              <hr />
              <div className="ent-row row-1">
                <NewsCard article={entertainmentArticles[0]} large />
              </div>
              <div className="ent-row row-2">
                {entertainmentArticles.slice(1, 3).map((a) => <NewsCard key={a.id} article={a} />)}
              </div>
              <div className="ent-row row-3">
                {entertainmentArticles.slice(3, 7).map((a) => <NewsCard key={a.id} article={a} compact />)}
              </div>
            </section>

            {/* Sports */}
            <section className="sports-section">
              <h2 className="section-title"><a href="/sports">Sports</a></h2>
              <hr />
              <div className="sports-grid">
                <div className="sports-col">{sportsArticles.slice(0, 2).map((a) => <NewsCard key={a.id} article={a} />)}</div>
                <div className="sports-col">{sportsArticles.slice(2, 5).map((a) => <NewsCard key={a.id} article={a} />)}</div>
                <div className="sports-col">{sportsArticles.slice(5, 9).map((a) => <NewsCard key={a.id} article={a} />)}</div>
              </div>
            </section>
          </div>
        </main>

        {isMobile && !showLive && (
          <div className="floating-live-icon" onClick={() => setShowLive((p) => !p)}>
            <FaBroadcastTower className="live-icon" />
          </div>
        )}
        {(showLive || !isMobile) && <LiveStreamCard />}
      </div>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const articlesRaw = await safeFetchJson(
    `https://backend.cocomedia.co.ke/wp-json/wp/v2/posts?_embed=1&per_page=100&orderby=date&order=desc`,
    []
  );

  const articles = Array.isArray(articlesRaw)
    ? articlesRaw.map((article) => {
        let authorName = "Unknown Author";
        try {
          if (typeof article.author === "string") {
            authorName = article.author;
          } else if (article._embedded?.author?.[0]?.name) {
            authorName = article._embedded.author[0].name;
          }
        } catch {}
        return { ...article, authorName };
      })
    : [];

  return { props: { articles }, revalidate: 1800 };
}
