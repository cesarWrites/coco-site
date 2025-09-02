import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function MainNewsCard({ article, isMain = false, compact = false }) {
  if (!article) return null;
  const categorySlug = article._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized';
  const [timeAgo, setTimeAgo] = useState('');

  function getFirstSentence(htmlContent) {
    if (!htmlContent) return '';
  
    // Strip HTML tags
    const textContent = htmlContent.replace(/(<([^>]+)>)/gi, '').trim();
  
    // Split at the first period followed by a space
    const firstSentenceMatch = textContent.match(/^.*?[.!?](?:\s|$)/);
    
    return firstSentenceMatch ? firstSentenceMatch[0].trim() : textContent;
  }
  
  const articleContent = article.content; 
  const firstSentence = getFirstSentence(articleContent);

  useEffect(() => {
    if (article.date) {
      const publishedDate = new Date(article.date);
      setTimeAgo(formatDistanceToNowStrict(publishedDate, { addSuffix: true }));
    }
  }, [article.date]);
  
  return (
    <div className={`news-card ${isMain ? "main-card" : ""} ${compact ? "compact-card" : ""}`}>
     <Link href={`/${categorySlug}/${article.id}/${article.slug}`}>
          {article.title?.rendered} 
      <img
        src={article.image}
        alt={article.title}
        className={`news-card-image ${compact ? "compact-image" : ""}`}
      />
      <h3 className="news-card-title">{article.title}</h3>
      </Link>
      <p>{firstSentence}</p>
      <div className="news-card-body">
        <div className="news-card-meta">
        <Link href={`/${categorySlug}/`}>
        <span>{article.category}</span>
        </Link>
          <span>{article.authorName}</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}




