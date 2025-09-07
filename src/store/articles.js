// src/store/articles.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useArticleStore = create(
  persist(
    (set, get) => ({
      articlesById: {},

      // ✅ set a single article
      setArticle: (id, article) =>
        set((state) => ({
          articlesById: { ...state.articlesById, [id]: article },
        })),

      // ✅ set many at once (bulk pre-warm)
      setArticles: (articlesArray = []) =>
        set((state) => {
          const newArticles = { ...state.articlesById };
          articlesArray.forEach((a) => {
            if (a?.id) newArticles[a.id] = a;
          });
          return { articlesById: newArticles };
        }),

      // ✅ read by id
      getArticleById: (id) => get().articlesById?.[id],

      // ✅ clear all cached articles
      clear: () => set({ articlesById: {} }),
    }),
    {
      name: 'article-cache-v1',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : undefined
      ),
      partialize: (state) => ({ articlesById: state.articlesById }),
      skipHydration: true,
    }
  )
);

// ✅ Handy helper to prime cache outside React (e.g. in event handlers, prefetching)
export const primeArticleCache = (article) => {
  if (article?.id) {
    useArticleStore.getState().setArticle(article.id, article);
  }
};
