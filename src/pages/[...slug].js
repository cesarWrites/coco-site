import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleView from '@/components/ArticlePage';
import CategoryCard from '@/components/CategoryCard';
import { REVALIDATE, BASE_URL } from '@/utils/config';
import { safeFetchJson } from '@/utils/safeJson';


async function fetchJsonOrNull(url) {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json') || !res.ok) {
      console.error(`Failed fetching JSON from ${url}, status: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error(`Error fetching ${url}:`, e);
    return null;
  }
}

export async function getStaticPaths() {
  const allowedSlugs = ['business', 'technology', 'sports', 'health', 'entertainment', 'politics', 'national-news'];

  // Pre-render only the category paths (so category landing pages are always ready)
  const categoryPaths = allowedSlugs.map(slug => ({
    params: { slug: [slug] },
  }));

  // (Optional) Pre-render just a few recent posts for SEO / homepage speed
  const posts = await fetchJsonOrNull(`${BASE_URL}/posts?per_page=5&_embed=1`) || [];

  const postPaths = posts.map(post => ({
    params: {
      slug: [
        post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized',
        String(post.id),
        post.slug,
      ],
    },
  }));

  return {
    paths: [...categoryPaths, ...postPaths], // ✅ Very limited set
    fallback: 'blocking', // ✅ All others built on-demand
  };
}

export async function getStaticProps({ params }) {
  if (!params?.slug) {
    return { props: { pageType: null, articles: [] }, revalidate: REVALIDATE };
  }

  try {
    // CATEGORY PAGE
    if (params.slug.length === 1) {
      const categorySlug = params.slug[0];

      const categories = await safeFetchJson(`${BASE_URL}/categories?slug=${categorySlug}`, []);
      const category = categories?.[0];

      if (!category) {
        console.warn(`[getStaticProps] No category for slug: ${categorySlug}`);
        return { props: { pageType: 'category', categoryName: categorySlug, articles: [] }, revalidate: REVALIDATE };
      }

      const articles = await safeFetchJson(
        `${BASE_URL}/posts?categories=${category.id}&_embed=1&per_page=20&orderby=date&order=desc`,
        []
      );

      return {
        props: { pageType: 'category', categoryName: category.name, articles },
        revalidate: REVALIDATE,
      };
    }

    // ARTICLE PAGE
    if (params.slug.length === 3) {
      const articleId = params.slug[1];
      const article = await safeFetchJson(`${BASE_URL}/posts/${articleId}?_embed=1`, null);

      if (!article) {
        console.warn(`[getStaticProps] No article found for id: ${articleId}`);
        return { props: { pageType: 'article', article: null }, revalidate: REVALIDATE };
      }

      // Related + latest
      const categoryIds = article.categories || [];
      const relatedArticles = categoryIds.length
        ? (await safeFetchJson(
            `${BASE_URL}/posts?categories=${categoryIds[0]}&per_page=10&_embed=1`,
            []
          )).filter(p => p.id !== article.id).slice(0, 4)
        : [];

      const latestArticles = (await safeFetchJson(`${BASE_URL}/posts?per_page=5&_embed=1`, []))
        .filter(p => p.id !== article.id);

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

    return { props: { pageType: null, articles: [] }, revalidate: REVALIDATE };
  } catch (err) {
    console.error(`[getStaticProps] Fatal error for slug=${params.slug.join('/')}`, err);
    return {
      props: { pageType: null, articles: [] },
      revalidate: REVALIDATE,
    };
  }
}




// export async function getStaticProps({ params }) {
//   if (!params?.slug) return { notFound: true };

//   if (params.slug.length === 1) {
//     // CATEGORY PAGE
//     const categorySlug = params.slug[0];
//     const categories = await fetchJsonOrNull(`${BASE_URL}/categories?slug=${categorySlug}`);
//     if (!categories || categories.length === 0) return { notFound: true };

//     const category = categories[0];
//     const articles = await fetchJsonOrNull(`${BASE_URL}/posts?categories=${category.id}&_embed=1`) || [];

//     return {
//       props: {
//         pageType: 'category',
//         categoryName: category.name,
//         articles,
//       },
//       revalidate: REVALIDATE,
//     };
//   } else if (params.slug.length === 3) {
//     // ARTICLE PAGE
//     const articleId = params.slug[1];
//     const article = await fetchJsonOrNull(`${BASE_URL}/posts/${articleId}?_embed=1`);

  
//     const categoryIds = article._embedded?.['wp:term']?.[0]?.map(cat => cat.id) || [];

//     // Fetch posts in the same category for related articles
//     const relatedRes = await fetch(`${BASE_URL}/posts?categories=${categoryIds[0]}&per_page=10&_embed=1`);
//     const relatedAll = await relatedRes.json();
//     const relatedArticles = relatedAll.filter(p => p.id !== article.id).slice(0, 4); // remove self, limit to 4

//     // Fetch latest articles (exclude current)
//     const latestRes = await fetch(`${BASE_URL}/posts?per_page=5&_embed=1`);
//     const latestAll = await latestRes.json();
//     const latestArticles = latestAll.filter(p => p.id !== article.id);

//     if (!article) return { notFound: true };

//     return {
//       props: { article, pageType: 'article',latestArticles, relatedArticles},
//       revalidate: REVALIDATE,
//     };
//   } else {
//     return { notFound: true };
//   }
// }

export default function SlugPage({
  pageType,
  article,
  articles = [],
  categoryName,
  relatedArticles = [],
  latestArticles = [],
  trendingArticles = [],
}) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        {/* Category page */}
        {pageType === 'category' && (
          <div className="category-container">
            <h1 className="category-title">{categoryName || 'Category'}</h1>
            <div className="articles-grid">
              {articles.length > 0 ? (
                articles.map((art) => (
                  <CategoryCard key={art.id} article={art} />
                ))
              ) : (
                <p>No articles found.</p>
              )}
            </div>
          </div>
        )}

        {/* Article page */}
        {pageType === 'article' && article?.id && (
          <ArticleView
            article={article}
            relatedArticles={relatedArticles}
            latestArticles={latestArticles}
            trendingArticles={trendingArticles}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}