import { formatArticleDate } from "@/utils/dateHelper";
import { normalizeArticle } from "@/utils/normalizeArticles";
import TrendingCard from "./TrendingCard";
import { useArticleStore } from "@/store/articles";

import {
    FaFacebookF,
    FaXTwitter,
    FaLinkedinIn,
    FaWhatsapp,
    FaEnvelope,
    FaLink
  } from "react-icons/fa6";
  
  export default function ArticleView({ article, relatedArticles, latestArticles, trendingArticles}) {
    if (!article?.id) return <div>Loading content...</div>;
    // const normalizedArticles = articles.map(normalizeArticle);
    const normalizedLatest = latestArticles.map(normalizeArticle);
    const normalizedRelated = relatedArticles.map(normalizeArticle);
    const normalizedTrending = trendingArticles.map(normalizeArticle);

    const title = article.title?.rendered;
    const excerpt = article.excerpt?.rendered;
    const content = article.content?.rendered;
    const image =
      article._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/default.jpg';
    // const author = article._embedded?.author?.[0]?.name || 'Unknown Author';
    const author = article.authorName;
    const category =
      article._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
    const tags = article._embedded?.['wp:term']?.[1]?.map((tag) => tag.name) || [];

  
    return (
      <div className="article-wrapper">
        {/* Main Article Section */}
        <article className="main-article">
          <h1 className="article-title" dangerouslySetInnerHTML={{ __html: title }} />
  
          <div className="article-meta">
            <span>{category}</span>
            <span>{article.authorName}</span>
            <span>{formatArticleDate(article.date)}</span>
          </div>
  
          <img src={image} alt={title} className="featured-image" />
  
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
  
          {tags.length > 0 && (
            <div className="article-tags">
              <strong>Tags:</strong> {tags.join(', ')}
            </div>
          )}
  
          <div className="social-share-container">
            <p className='social-share-text'>Share with friends.</p>
            <div className="social-share">
              <a
                href={`https://twitter.com/share?url=https://cocomedia.co.ke/article/${article.slug}&text=${title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="icon twitter"
                aria-label="Share on Twitter"
              >
                <FaXTwitter />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://cocomedia.co.ke/article/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="icon facebook"
                aria-label="Share on Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=https://cocomedia.co.ke/article/${article.slug}&title=${title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="icon linkedin"
                aria-label="Share on LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${title} https://cocomedia.co.ke/article/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="icon whatsapp"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href={`mailto:?subject=${title}&body=Check this out: https://cocomedia.co.ke/article/${article.slug}`}
                className="icon email"
                aria-label="Share via Email"
              >
                <FaEnvelope />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://cocomedia.co.ke/article/${article.slug}`);
                  alert('Link copied!');
                }}
                className="icon copy"
                aria-label="Copy article link"
              >
                <FaLink />
              </button>
            </div>
          </div>
        </article>
  
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-box">
            <h3>Related Articles</h3>
            <hr/>
            <div className="news-grid">
      {normalizedRelated.map((art) => (
        <TrendingCard key={art.id} article={art} />
      ))}
    </div>
          </div>
  
          <div className="sidebar-box">
            <h3>Latest Posts</h3>
            <hr/>
            <div className="news-grid">
      {normalizedLatest.map((art) => (
        <TrendingCard key={art.id} article={art} />
      ))}
    </div>
          </div>
        </aside>
      </div>
    );
  }
  