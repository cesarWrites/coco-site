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

/* /store/articleStore.js

SSR-safe Zustand store with IndexedDB persistence (idb-keyval) AND
a cache-size limiter (keep latest 20 articles). Drop into your project.

Requirements: `npm install idb-keyval zustand` (or yarn/pnpm)
*/

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---- Configuration ----
const STORAGE_KEY = 'article-cache-v1';
const MAX_CACHE_SIZE = 20; // keep latest N articles
const IDB_DB_NAME = 'article-db';
const IDB_STORE_NAME = 'article-store';

// ---- SSR-safe async IndexedDB adapter (uses dynamic import) ----
// Methods are async and will no-op on server.
const indexedDBStorage = {
  getItem: async (name) => {
    if (typeof window === 'undefined') return null;
    try {
      const { get, createStore } = await import('idb-keyval');
      const store = createStore(IDB_DB_NAME, IDB_STORE_NAME);
      const value = await get(name, store);
      return value ?? null;
    } catch (err) {
      // log but don't throw — keep builds / runtime safe
      // eslint-disable-next-line no-console
      console.warn('[indexedDBStorage] getItem error:', err);
      return null;
    }
  },
  setItem: async (name, value) => {
    if (typeof window === 'undefined') return;
    try {
      const { set, createStore } = await import('idb-keyval');
      const store = createStore(IDB_DB_NAME, IDB_STORE_NAME);
      await set(name, value, store);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[indexedDBStorage] setItem error:', err);
    }
  },
  removeItem: async (name) => {
    if (typeof window === 'undefined') return;
    try {
      const { del, createStore } = await import('idb-keyval');
      const store = createStore(IDB_DB_NAME, IDB_STORE_NAME);
      await del(name, store);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[indexedDBStorage] removeItem error:', err);
    }
  },
};

// ---- Helper: trim cache to MAX_CACHE_SIZE ----
function pruneMap(map, order) {
  // `order` is an array of ids in insertion order (oldest first)
  if (!Array.isArray(order)) return { map, order };
  const evictCount = Math.max(0, order.length - MAX_CACHE_SIZE);
  if (evictCount === 0) return { map, order };

  const newOrder = order.slice(evictCount);
  const toRemove = order.slice(0, evictCount);
  const newMap = { ...map };
  for (const k of toRemove) delete newMap[k];
  return { map: newMap, order: newOrder };
}

// ---- Zustand store ----
export const useArticleStore = create(
  persist(
    (set, get) => ({
      // articlesById: { [id]: article }
      articlesById: {},
      // order: array of ids in insertion order (oldest first)
      order: [],

      // set a single article (keeps insertion order, prunes if needed)
      setArticle: (id, article) =>
        set((state) => {
          const sid = String(id);
          const newMap = { ...state.articlesById, [sid]: article };

          // maintain order: remove existing id if present, then push to end
          const filtered = (state.order || []).filter((x) => x !== sid);
          const newOrder = [...filtered, sid];

          // prune oldest if exceeds limit
          const { map: prunedMap, order: prunedOrder } = pruneMap(newMap, newOrder);

          return { articlesById: prunedMap, order: prunedOrder };
        }),

      // bulk set many articles (array)
      setManyArticles: (articles = []) =>
        set((state) => {
          let map = { ...state.articlesById };
          let order = Array.isArray(state.order) ? [...state.order] : [];

          for (const a of articles) {
            if (a && a.id != null) {
              const sid = String(a.id);
              map[sid] = a;
              order = order.filter((x) => x !== sid);
              order.push(sid);
            }
          }

          const { map: prunedMap, order: prunedOrder } = pruneMap(map, order);
          return { articlesById: prunedMap, order: prunedOrder };
        }),

      // read by id
      getArticleById: (id) => get().articlesById?.[String(id)] ?? null,

      // clear cache entirely
      clear: () => set({ articlesById: {}, order: [] }),
    }),
    {
      name: STORAGE_KEY,
      // Use our async indexedDB adapter — persist will call these methods.
      // On server these are no-ops / return null, so SSR/builds are safe.
      storage: indexedDBStorage,
      partialize: (state) => ({ articlesById: state.articlesById, order: state.order }),
      // Optionally skip hydration on server — persist handles async hydration in browser
    }
  )
);

// ---- Optional helper: prime cache from outside React ----
export const primeArticleCache = (article) => {
  if (article?.id) {
    useArticleStore.getState().setArticle(article.id, article);
  }
};



