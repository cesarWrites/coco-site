// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';

// export const useArticleStore = create(
//   persist(
//     (set, get) => ({
//       articlesById: {},

//       // ✅ set a single article
//       setArticle: (id, article) =>
//         set((state) => ({
//           articlesById: { ...state.articlesById, [id]: article },
//         })),

//       // ✅ set many at once (bulk pre-warm)
//       setArticles: (articlesArray = []) =>
//         set((state) => {
//           const newArticles = { ...state.articlesById };
//           articlesArray.forEach((a) => {
//             if (a?.id) newArticles[a.id] = a;
//           });
//           return { articlesById: newArticles };
//         }),

//       // ✅ read by id
//       getArticleById: (id) => get().articlesById?.[id],

//       // ✅ clear all cached articles
//       clear: () => set({ articlesById: {} }),
//     }),
//     {
//       name: 'article-cache-v1',
//       storage: createJSONStorage(() =>
//         typeof window !== 'undefined' ? localStorage : undefined
//       ),
//       partialize: (state) => ({ articlesById: state.articlesById }),
//       skipHydration: true,
//     }
//   )
// );

// // ✅ Handy helper to prime cache outside React (e.g. in event handlers, prefetching)
// export const primeArticleCache = (article) => {
//   if (article?.id) {
//     useArticleStore.getState().setArticle(article.id, article);
//   }
// };

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// safe storage for SSR: returns localStorage in browser, a no-op storage on server
const safeStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }
  return localStorage;
};

export const useArticleStore = create(
  persist(
    (set, get) => ({
      articlesById: {},

      // set a single article by id
      setArticle: (id, article) =>
        set((state) => ({
          articlesById: { ...state.articlesById, [String(id)]: article },
        })),

      // bulk set many articles (array of article objects)
      setManyArticles: (articles = []) =>
        set((state) => {
          const map = { ...state.articlesById };
          for (const a of articles) {
            if (a && a.id != null) map[String(a.id)] = a;
          }
          return { articlesById: map };
        }),

      // read by id (returns null if not present)
      getArticleById: (id) => get().articlesById?.[String(id)] ?? null,

      // clear cache
      clear: () => set({ articlesById: {} }),
    }),
    {
      name: 'article-cache-v1',
      storage: createJSONStorage(safeStorage),
      partialize: (state) => ({ articlesById: state.articlesById }),
    }
  )
);

// helper to prime cache from non-React code
export const primeArticleCache = (article) => {
  if (article?.id) {
    useArticleStore.getState().setArticle(article.id, article);
  }
};
