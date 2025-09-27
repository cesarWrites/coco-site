// // import { create } from 'zustand';
// // import { persist, createJSONStorage } from 'zustand/middleware';

// // export const useArticleStore = create(
// //   persist(
// //     (set, get) => ({
// //       articlesById: {},

// //       // ✅ set a single article
// //       setArticle: (id, article) =>
// //         set((state) => ({
// //           articlesById: { ...state.articlesById, [id]: article },
// //         })),

// //       // ✅ set many at once (bulk pre-warm)
// //       setArticles: (articlesArray = []) =>
// //         set((state) => {
// //           const newArticles = { ...state.articlesById };
// //           articlesArray.forEach((a) => {
// //             if (a?.id) newArticles[a.id] = a;
// //           });
// //           return { articlesById: newArticles };
// //         }),

// //       // ✅ read by id
// //       getArticleById: (id) => get().articlesById?.[id],

// //       // ✅ clear all cached articles
// //       clear: () => set({ articlesById: {} }),
// //     }),
// //     {
// //       name: 'article-cache-v1',
// //       storage: createJSONStorage(() =>
// //         typeof window !== 'undefined' ? localStorage : undefined
// //       ),
// //       partialize: (state) => ({ articlesById: state.articlesById }),
// //       skipHydration: true,
// //     }
// //   )
// // );

// // // ✅ Handy helper to prime cache outside React (e.g. in event handlers, prefetching)
// // export const primeArticleCache = (article) => {
// //   if (article?.id) {
// //     useArticleStore.getState().setArticle(article.id, article);
// //   }
// // };

// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';

// // safe storage for SSR: returns localStorage in browser, a no-op storage on server
// const safeStorage = () => {
//   if (typeof window === 'undefined') {
//     return {
//       getItem: async () => null,
//       setItem: async () => {},
//       removeItem: async () => {},
//     };
//   }
//   return localStorage;
// };

// export const useArticleStore = create(
//   persist(
//     (set, get) => ({
//       articlesById: {},

//       // set a single article by id
//       setArticle: (id, article) =>
//         set((state) => ({
//           articlesById: { ...state.articlesById, [String(id)]: article },
//         })),

//       // bulk set many articles (array of article objects)
//       setManyArticles: (articles = []) =>
//         set((state) => {
//           const map = { ...state.articlesById };
//           for (const a of articles) {
//             if (a && a.id != null) map[String(a.id)] = a;
//           }
//           return { articlesById: map };
//         }),

//       // read by id (returns null if not present)
//       getArticleById: (id) => get().articlesById?.[String(id)] ?? null,

//       // clear cache
//       clear: () => set({ articlesById: {} }),
//     }),
//     {
//       name: 'article-cache-v1',
//       storage: createJSONStorage(safeStorage),
//       partialize: (state) => ({ articlesById: state.articlesById }),
//     }
//   )
// );

// // helper to prime cache from non-React code
// export const primeArticleCache = (article) => {
//   if (article?.id) {
//     useArticleStore.getState().setArticle(article.id, article);
//   }
// };

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { set as idbSet, get as idbGet, del as idbDel, createStore } from 'idb-keyval';

// ---- IndexedDB storage adapter ----
const customStore = createStore('article-db', 'article-store');
const indexedDBStorage = {
  getItem: async (name) => {
    try {
      return await idbGet(name, customStore);
    } catch (err) {
      console.error('[IndexedDBStorage] getItem error:', err);
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await idbSet(name, value, customStore);
    } catch (err) {
      console.error('[IndexedDBStorage] setItem error:', err);
    }
  },
  removeItem: async (name) => {
    try {
      await idbDel(name, customStore);
    } catch (err) {
      console.error('[IndexedDBStorage] removeItem error:', err);
    }
  },
};

// ---- Cache limit ----
const MAX_CACHE_SIZE = 100;

// ---- Zustand store ----
export const useArticleStore = create(
  persist(
    (set, get) => ({
      articlesById: {},

      // set a single article by id
      setArticle: (id, article) =>
        set((state) => {
          const map = { ...state.articlesById, [String(id)]: article };
          const keys = Object.keys(map);

          if (keys.length > MAX_CACHE_SIZE) {
            const oldestKey = keys[0];
            delete map[oldestKey];
          }

          return { articlesById: map };
        }),

      // bulk set many articles
      setManyArticles: (articles = []) =>
        set((state) => {
          let map = { ...state.articlesById };

          for (const a of articles) {
            if (a && a.id != null) map[String(a.id)] = a;
          }

          const keys = Object.keys(map);
          if (keys.length > MAX_CACHE_SIZE) {
            const excess = keys.length - MAX_CACHE_SIZE;
            const keysToRemove = keys.slice(0, excess);
            for (const k of keysToRemove) delete map[k];
          }

          return { articlesById: map };
        }),

      // read by id
      getArticleById: (id) => get().articlesById?.[String(id)] ?? null,

      // clear cache
      clear: () => set({ articlesById: {} }),
    }),
    {
      name: 'article-cache-v1',
      storage: indexedDBStorage,
      partialize: (state) => ({ articlesById: state.articlesById }),
    }
  )
);

// helper to prime cache outside React (e.g. in event handlers)
export const primeArticleCache = (article) => {
  if (article?.id) {
    useArticleStore.getState().setArticle(article.id, article);
  }
};

