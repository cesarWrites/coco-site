import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleView from '@/components/ArticlePage';
import CategoryCard from '@/components/CategoryCard';
import { REVALIDATE, BASE_URL } from '@/utils/config';
import { useArticleStore } from '@/store/articles';

// ---------- Safe Fetch with Timeout ----------
async function fetchWithTimeout(url, { timeout = 5000, fallback = null } = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  } finally {
    clearTimeout(id);
  }
}

// ---------- Static Paths ----------
export async function getStaticPaths() {
  // 🚀 Do not prebuild any paths at compile time
  return {
    paths: [],
    fallback: 'blocking',
  };
}

// ---------- Static Props ----------
export async function getStaticProps({ params }) {
  if (!params?.slug) {
    return { props: { pageType: null }, revalidate: REVALIDATE };
  }

  try {
    // Category page
    if (params.slug.length === 1) {
      const categorySlug = params.slug[0];
      const categories = await fetchWithTimeout(
        `${BASE_URL}/categories?slug=${categorySlug}`,
        { fallback: [] }
      );
      const category = categories?.[0];

      if (!category) {
        return {
          props: { pageType: 'category', categoryName: categorySlug, articles: [] },
          revalidate: REVALIDATE,
        };
      }

      const articles = await fetchWithTimeout(
        `${BASE_URL}/posts?categories=${category.id}&_embed=1&per_page=20&orderby=date&order=desc`,
        { fallback: [] }
      );

      return {
        props: { pageType: 'category', categoryName: category.name, articles },
        revalidate: REVALIDATE,
      };
    }

    // Article page
    if (params.slug.length === 3) {
      const articleId = params.slug[1];
      const article = await fetchWithTimeout(
        `${BASE_URL}/posts/${articleId}?_embed=1`,
        { fallback: null }
      );

      if (!article) {
        return { props: { pageType: 'article', article: null }, revalidate: REVALIDATE };
      }

      const categoryIds = article.categories || [];
      const relatedArticles = categoryIds.length
        ? (await fetchWithTimeout(
            `${BASE_URL}/posts?categories=${categoryIds[0]}&per_page=5&_embed=1`,
            { fallback: [] }
          ))?.filter((p) => p.id !== article.id) || []
        : [];

      const latestArticles =
        (await fetchWithTimeout(`${BASE_URL}/posts?per_page=5&_embed=1`, {
          fallback: [],
        }))?.filter((p) => p.id !== article.id) || [];

      return {
        props: {
          pageType: 'article',
          article,
          relatedArticles,
          latestArticles,
        },
        revalidate: REVALIDATE,
      };
    }

    return { props: { pageType: null }, revalidate: REVALIDATE };
  } catch {
    return { props: { pageType: null }, revalidate: REVALIDATE };
  }
}

// ---------- Component ----------
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
  const [categoryLabel, setCategoryLabel] = useState(categoryName);

  // Hydrate + background refetch for article
  useEffect(() => {
    if (pageType === 'article' && article?.id) {
      const cached = getArticleById(article.id);
      if (cached) {
        setArticleState(cached); // show cached immediately
      } else {
        setArticle(article.id, article);
      }

      // background refresh
      (async () => {
        const fresh = await fetchWithTimeout(
          `${BASE_URL}/posts/${article.id}?_embed=1`,
          { fallback: null }
        );
        if (fresh?.id) {
          setArticle(fresh.id, fresh);
          setArticleState(fresh);
        }
      })();
    }
  }, [pageType, article, getArticleById, setArticle]);

  // Background refetch for category
  useEffect(() => {
    if (pageType === 'category' && categoryName) {
      (async () => {
        const cats = await fetchWithTimeout(
          `${BASE_URL}/categories?slug=${categoryName.toLowerCase()}`,
          { fallback: [] }
        );
        const category = cats?.[0];
        if (category?.id) {
          const fresh = await fetchWithTimeout(
            `${BASE_URL}/posts?categories=${category.id}&_embed=1&per_page=20&orderby=date&order=desc`,
            { fallback: [] }
          );
          if (fresh?.length) {
            setCategoryArticles(fresh);
            setCategoryLabel(category.name);
          }
        }
      })();
    }
  }, [pageType, categoryName]);

  if (router.isFallback) return <div>Loading…</div>;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        {/* Category page */}
        {pageType === 'category' && (
          <div className="category-container">
            <h1 className="category-title">{categoryLabel || 'Category'}</h1>
            <div className="articles-grid">
              {categoryArticles.length > 0 ? (
                categoryArticles.map((art) => (
                  <CategoryCard key={art.id} article={art} />
                ))
              ) : (
                <p>No articles found in {categoryLabel}.</p>
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

        {/* Fallback */}
        {pageType === null && <p>Content not available.</p>}
      </main>
      <Footer />
    </div>
  );
}
