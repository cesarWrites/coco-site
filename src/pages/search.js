import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);

    fetch(`https://backend.cocomedia.co.ke/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&_embed`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q]);

  return (
    <main className="search-results-container">
      <h1>Search results for: "{q}"</h1>
      {loading && <p>Loading...</p>}
      {!loading && results.length === 0 && <p>No results found.</p>}

      <div className="results-grid">
        {results.map((article) => (
          <div key={article.id} className="result-card">
            <Link
              href={`/${article._embedded?.["wp:term"]?.[0]?.[0]?.slug}/${article.id}/${article.slug}`}
            >
              <img
                src={
                  article._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                  "/default.jpg"
                }
                alt={article.title.rendered}
              />
              <h2 dangerouslySetInnerHTML={{ __html: article.title.rendered }} />
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
