import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function TrendingCard({ article, isMain = false, compact = false }) {
  const categorySlug = article._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized';
  const [timeAgo, setTimeAgo] = useState('');
  useEffect(() => {
      if (article.date) {
        const publishedDate = new Date(article.date);
        setTimeAgo(formatDistanceToNowStrict(publishedDate, { addSuffix: true }));
      }
    }, [article.date]);


  return (
    <div className="trd-card">
     <Link href={`/${categorySlug}/${article.id}/${article.slug}`}>
          {article.title?.rendered} 
      <h3 className="trd-card-title">{article.title}</h3>
      </Link>
        <div className='trd-card-meta'>
        <span>{article.category}</span>
          <span>{timeAgo}</span>
        </div>
        <hr/>
    </div>
  );
}




