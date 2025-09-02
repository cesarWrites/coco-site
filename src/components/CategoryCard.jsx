import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';

export default function CategoryCard({ article }) {
  const title = article.title?.rendered;
  const image = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/default.jpg';
  const category = article._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
  const publishedDate = new Date(article.date);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
      if (article.date) {
        const publishedDate = new Date(article.date);
        setTimeAgo(formatDistanceToNowStrict(publishedDate, { addSuffix: true }));
      }
    }, [article.date]);
  

  return (
    <div className="category-card">
      <Link href={`/${article._embedded?.['wp:term']?.[0]?.[0]?.slug}/${article.id}/${article.slug}`}>
          <img src={image} alt={title} className="card-img" />
          <h2 dangerouslySetInnerHTML={{ __html: title }} />
          <p>{category} • {article.authorName} • {timeAgo}</p>
      </Link>
    </div>
  );
}
