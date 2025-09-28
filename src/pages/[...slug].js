import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleView from '@/components/ArticlePage';
import CategoryCard from '@/components/CategoryCard';
import { REVALIDATE, BASE_URL } from '@/utils/config';
import { useArticleStore } from '@/store/articles';

// Safe fetch wrapper
async function tryFetch(url, fallback) {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  if (!params?.slug) {
    return { props: { pageType: null }, revalidate: REVALIDATE };
  }

  try {
    if (params.slug.length === 1) {
      // Category page
      const categorySlug = params.slug[0];
      const categories = await tryFetch(`${BASE_URL}/categories?slug=${categorySlug}`, []);
      const category = categories?.[0];

      if (!category) {
        return { props: { pageType: 'category', categoryName: categorySlug, articles: [] }, revalidate: REVALIDATE };
      }

      const articles = await tryFetch(
        `${BASE_URL}/posts?categories=${category.id}&_embed=1&per_page=20&orderby=date&order=desc`,
        []
      );

      return { props: { pageType: 'category', categoryName: category.name, articles }, revalidate: REVALIDATE };
    }

    if (params.slug.length === 3) {
      // Article page
      const articleId = params.slug[1];
      const article = await tryFetch(`${BASE_URL}/posts/${articleId}?_embed=1`, null);

      if (!article) {
        return { props: { pageType: 'article', article: null }, revalidate: REVALIDATE };
      }

      const categoryIds = article.categories || [];
      const relatedArticles = categoryIds.length
        ? (await tryFetch(`${BASE_URL}/posts?categories=${categoryIds[0]}&per_page=5&_embed=1`, []))
            .filter((p) => p.id !== article.id)
        : [];

      const latestArticles = (await tryFetch(`${BASE_URL}/posts?per_page=5&_embed=1`, []))
        .filter((p) => p.id !== article.id);

      return {
        props: { pageType: 'article', article, relatedArticles, latestArticles },
        revalidate: REVALIDATE,
      };
    }

    return { props: { pageType: null }, revalidate: REVALIDATE };
  } catch {
    return { props: { pageType: null }, revalidate: REVALIDATE };
  }
}

export default function SlugPage({
  pageType,
  article,
  articles = [],
  categoryName,
  relatedArticles = [],
  latestArticles = [],
}) {
  const router = useRouter();
  const { getArticleById, setArticle } = useArticleStore();

  // Article state
  const [articleState, setArticleState] = useState(article);

  // Category state
  const [categoryArticles, setCategoryArticles] = useState(articles);

  // Hydrate + background refetch for article
  useEffect(() => {
    if (pageType === 'article' && article?.id) {
      // 1. Try store first (instant render if available)
      const cached = getArticleById(article.id);
      if (cached) {
        setArticleState(cached);
      } else {
        setArticle(article.id, article);
        setArticleState(article);
      }

      // 2. Background refresh
      (async () => {
        const fresh = await tryFetch(`${BASE_URL}/posts/${article.id}?_embed=1`, null);
        if (fresh?.id) {
          setArticle(fresh.id, fresh);
          setArticleState(fresh);
        }
      })();
    }
  }, [pageType, article, getArticleById, setArticle]);

  if (router.isFallback) return <div>Loading…</div>;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        {/* Category page */}
        {pageType === 'category' && (
          <div className="category-container">
            <h1 className="category-title">{categoryName || 'Category'}</h1>
            <div className="articles-grid">
              {categoryArticles.length > 0 ? (
                categoryArticles.map((art) => <CategoryCard key={art.id} article={art} />)
              ) : (
                <p>No articles found in {categoryName}.</p>
              )}
            </div>
          </div>
        )}

        {/* Article page */}
        {pageType === 'article' && articleState?.id && (
          <ArticleView
            article={articleState}
            relatedArticles={relatedArticles}
            latestArticles={latestArticles}
            trendingArticles={[]}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
