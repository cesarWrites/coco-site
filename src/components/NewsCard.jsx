import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { primeArticleCache } from '@/store/articles';

export default function NewsCard({ article, isMain = false, compact = false }) {
  if (!article) return null;
  const categorySlug = article._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized';
  const image =  article._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/default.jpg';

  const [timeAgo, setTimeAgo] = useState('');
  useEffect(() => {
      if (article.date) {
        const publishedDate = new Date(article.date);
        setTimeAgo(formatDistanceToNowStrict(publishedDate, { addSuffix: true }));
      }
    }, [article.date]);


  return (
    <div className={`news-card ${isMain ? "main-card" : ""} ${compact ? "compact-card" : ""}`}>
     <Link href={`/${categorySlug}/${article.id}/${article.slug}`} 
     onMouseEnter={() => primeArticleCache(article)}  // pre-warm on hover
     onClick={() => primeArticleCache(article)}>
          {article.title?.rendered} 
      <img
        // src={article.image}
        src={image}
        alt={article.title}
        className={`news-card-image ${compact ? "compact-image" : ""}`}
      />
      <h3 className="news-card-title">{article.title}</h3>
      </Link>
      <div className="news-card-body">
        <div className="news-card-meta">
        <span>{article.category}</span>
          {/* <span>{article.author}</span> */}
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}




