// src/store/articles.js
import { create } from "zustand";

export const useArticleStore = create((set, get) => ({
  articles: {},
  setArticles: (articlesArray) => {
    const articlesMap = {};
    articlesArray.forEach((art) => {
      articlesMap[art.id] = art;
    });
    set((state) => ({ articles: { ...state.articles, ...articlesMap } }));
  },
  getArticle: (id) => get().articles[id] || null,
}));
