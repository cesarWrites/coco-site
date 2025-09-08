// import { useRouter } from 'next/router';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import ArticleView from '@/components/ArticlePage';
// import CategoryCard from '@/components/CategoryCard';
// import { REVALIDATE, BASE_URL } from '@/utils/config';
// import { safeFetchJson } from '@/utils/safeJson';
// import { useArticleStore } from '@/store/articles';

// // Helper fetch with safe null
// async function fetchJsonOrNull(url) {
//   try {
//     const res = await fetch(url);
//     const contentType = res.headers.get('content-type') || '';
//     if (!contentType.includes('application/json') || !res.ok) {
//       console.error(`Failed fetching JSON from ${url}, status: ${res.status}`);
//       return null;
//     }
//     return await res.json();
//   } catch (e) {
//     console.error(`Error fetching ${url}:`, e);
//     return null;
//   }
// }

// export async function getStaticPaths() {
//   const allowedSlugs = [
//     'business',
//     'technology',
//     'sports',
//     'health',
//     'entertainment',
//     'politics',
//     'national-news',
//   ];

//   let categoryPaths = [];

//   try {
//     const res = await fetch(`${BASE_URL}/categories?per_page=100`);
//     if (res.ok) {
//       const categories = await res.json();
//       categoryPaths = categories
//         .filter((cat) => allowedSlugs.includes(cat.slug))
//         .map((cat) => ({ params: { slug: [cat.slug] } }));
//     } else {
//       console.warn(`[getStaticPaths] Failed categories fetch, status ${res.status}`);
//     }
//   } catch (err) {
//     console.error(`[getStaticPaths] Error fetching categories:`, err);
//   }

//   return {
//     paths: categoryPaths,
//     fallback: 'blocking',
//   };
// }

// export async function getStaticProps({ params }) {
//   if (!params?.slug) {
//     return { props: { pageType: null, articles: [] }, revalidate: REVALIDATE };
//   }

//   try {
//     // CATEGORY PAGE
//     if (params.slug.length === 1) {
//       const categorySlug = params.slug[0];

//       const categories = await safeFetchJson(
//         `${BASE_URL}/categories?slug=${categorySlug}`,
//         []
//       );
//       const category = categories?.[0];

//       if (!category) {
//         return {
//           props: { pageType: 'category', categoryName: categorySlug, articles: [] },
//           revalidate: REVALIDATE,
//         };
//       }

//       const articles = await safeFetchJson(
//         `${BASE_URL}/posts?categories=${category.id}&_embed=1&per_page=20&orderby=date&order=desc`,
//         []
//       );

//       return {
//         props: { pageType: 'category', categoryName: category.name, articles },
//         revalidate: REVALIDATE,
//       };
//     }

//     // ARTICLE PAGE
//     if (params.slug.length === 3) {
//       const articleId = params.slug[1];
//       const article = await safeFetchJson(
//         `${BASE_URL}/posts/${articleId}?_embed=1`,
//         null
//       );

//       if (!article) {
//         return { props: { pageType: 'article', article: null }, revalidate: REVALIDATE };
//       }

//       // Related + latest
//       const categoryIds = article.categories || [];
//       const relatedArticles = categoryIds.length
//         ? (await safeFetchJson(
//             `${BASE_URL}/posts?categories=${categoryIds[0]}&per_page=10&_embed=1`,
//             []
//           )).filter((p) => p.id !== article.id).slice(0, 4)
//         : [];

//       const latestArticles = (await safeFetchJson(
//         `${BASE_URL}/posts?per_page=5&_embed=1`,
//         []
//       )).filter((p) => p.id !== article.id);

//       return {
//         props: {
//           pageType: 'article',
//           article,
//           relatedArticles,
//           latestArticles,
//         },
//         revalidate: REVALIDATE,
//       };
//     }

//     return { props: { pageType: null, articles: [] }, revalidate: REVALIDATE };
//   } catch (err) {
//     console.error(`[getStaticProps] Fatal error for slug=${params.slug.join('/')}`, err);
//     return {
//       props: { pageType: null, articles: [] },
//       revalidate: REVALIDATE,
//     };
//   }
// }

// export default function SlugPage({
//   pageType,
//   article,
//   articles = [],
//   categoryName,
//   relatedArticles = [],
//   latestArticles = [],
//   trendingArticles = [],
// }) {
//   const router = useRouter();
//   const getArticleById = useArticleStore((s) => s.getArticleById);
//   const setArticle = useArticleStore((s) => s.setArticle);

//   if (router.isFallback) {
//     return <div>Loading...</div>;
//   }

//   // ✅ Article caching logic
//   let articleToRender = article;
//   if (pageType === 'article' && article?.id) {
//     const cached = getArticleById(article.id);
//     if (cached) {
//       articleToRender = cached; // show immediately
//       if (!article.content?.rendered) {
//         // background refresh
//         safeFetchJson(`${BASE_URL}/posts/${article.id}?_embed=1`, null).then(
//           (fresh) => {
//             if (fresh) setArticle(fresh.id, fresh);
//           }
//         );
//       }
//     } else {
//       setArticle(article.id, article);
//     }
//   }

//   return (
//     <div>
//       <div className="page-wrapper">
//         <Navbar />
//         <main className="main-content">
//           {/* Category page */}
//           {pageType === 'category' && (
//             <div className="category-container">
//               <h1 className="category-title">{categoryName || 'Category'}</h1>
//               <div className="articles-grid">
//                 {articles.length > 0 ? (
//                   articles.map((art) => (
//                     <CategoryCard key={art.id} article={art} />
//                   ))
//                 ) : (
//                   <p>No articles found.</p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Article page */}
//           {pageType === 'article' && articleToRender?.id && (
//             <ArticleView
//               article={articleToRender}
//               relatedArticles={relatedArticles}
//               latestArticles={latestArticles}
//               trendingArticles={trendingArticles}
//             />
//           )}
//         </main>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// src/pages/[...slug].js
// src/pages/[...slug].js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleView from '@/components/ArticlePage';
import CategoryCard from '@/components/CategoryCard';
import { REVALIDATE, BASE_URL } from '@/utils/config';
import { safeFetchJson } from '@/utils/safeJson';
import { useArticleStore } from '@/store/articles';

// ---- Helpers ----
async function fetchJsonOrNull(url) {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json') || !res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ---- Pre-generate important slugs ----
export async function getStaticPaths() {
  const allowedSlugs = [
    'business',
    'technology',
    'sports',
    'health',
    'entertainment',
    'politics',
    'national-news',
  ];

  let categoryPaths = [];
  try {
    const res = await fetch(`${BASE_URL}/categories?per_page=100`);
    if (res.ok) {
      const categories = await res.json();
      categoryPaths = categories
        .filter((cat) => allowedSlugs.includes(cat.slug))
        .map((cat) => ({ params: { slug: [cat.slug] } }));
    }
  } catch (err) {
    console.warn('Error fetching categories in getStaticPaths', err);
  }

  // ✅ Pre-generate homepage articles
  let postPaths = [];
  try {
    const posts = await fetch(`${BASE_URL}/posts?per_page=10&_embed=1`).then((r) =>
      r.json()
    );
    postPaths = posts.map((post) => ({
      params: {
        slug: [
          post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized',
          String(post.id),
          post.slug,
        ],
      },
    }));
  } catch (err) {
    console.warn('Error fetching posts in getStaticPaths', err);
  }

  return {
    paths: [...categoryPaths, ...postPaths],
    fallback: 'blocking', // others generated on-demand
  };
}

// ---- Data for each page ----
export async function getStaticProps({ params }) {
  if (!params?.slug) {
    return { props: { pageType: null, articles: [] }, revalidate: REVALIDATE };
  }

  try {
    // Category page
    if (params.slug.length === 1) {
      const categorySlug = params.slug[0];

      const categories = await safeFetchJson(
        `${BASE_URL}/categories?slug=${categorySlug}`,
        []
      );
      const category = categories?.[0];

      if (!category) {
        return {
          props: { pageType: 'category', categoryName: categorySlug, articles: [] },
          revalidate: REVALIDATE,
        };
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

    // Article page
    if (params.slug.length === 3) {
      const articleId = params.slug[1];
      const article = await safeFetchJson(
        `${BASE_URL}/posts/${articleId}?_embed=1`,
        null
      );

      if (!article) {
        return { props: { pageType: 'article', article: null }, revalidate: REVALIDATE };
      }

      const categoryIds = article.categories || [];
      const relatedArticles = categoryIds.length
        ? (await safeFetchJson(
            `${BASE_URL}/posts?categories=${categoryIds[0]}&per_page=10&_embed=1`,
            []
          )).filter((p) => p.id !== article.id).slice(0, 4)
        : [];

      const latestArticles = (await safeFetchJson(
        `${BASE_URL}/posts?per_page=5&_embed=1`,
        []
      )).filter((p) => p.id !== article.id);

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
    console.error(`[getStaticProps] Fatal error:`, err);
    return {
      props: { pageType: null, articles: [] },
      revalidate: REVALIDATE,
    };
  }
}

// ---- Component ----
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
  const getArticleById = useArticleStore((s) => s.getArticleById);
  const setArticle = useArticleStore((s) => s.setArticle);
  const setManyArticles = useArticleStore((s) => s.setManyArticles);

  // show loading on fallback build
  if (router.isFallback) return <div>Loading...</div>;

  // ✅ Prime cache for category pages
  useEffect(() => {
    if (pageType === 'category' && articles?.length) {
      setManyArticles(articles);
    }
  }, [pageType, articles, setManyArticles]);

  // ✅ Article caching logic
  let articleToRender = article;
  if (pageType === 'article' && article?.id) {
    const cached = getArticleById(article.id);
    if (cached) {
      articleToRender = cached;
      if (!article.content?.rendered) {
        safeFetchJson(`${BASE_URL}/posts/${article.id}?_embed=1`, null).then(
          (fresh) => {
            if (fresh) setArticle(fresh.id, fresh);
          }
        );
      }
    } else {
      setArticle(article.id, article);
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        {pageType === 'category' && (
          <div className="category-container">
            <h1 className="category-title">{categoryName || 'Category'}</h1>
            <div className="articles-grid">
              {articles.length > 0 ? (
                articles.map((art) => <CategoryCard key={art.id} article={art} />)
              ) : (
                <p>No articles found.</p>
              )}
            </div>
          </div>
        )}

        {pageType === 'article' && articleToRender?.id && (
          <ArticleView
            article={articleToRender}
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
