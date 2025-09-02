export const normalizeArticle = (article) => ({
    ...article,
    title: article.title?.rendered || "Untitled",
    excerpt: article.excerpt?.rendered || "",
    content: article.content?.rendered || "",
    author: article._embedded?.author?.[0]?.name || "Unknown Author",
    image:
      article._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/default.jpg",
    category:
      article._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized",
      categorySlug: article._embedded?.["wp:term"]?.[0]?.[0]?.slug || "uncategorized",
    // timeAgo: new Date(article.date).toLocaleDateString(),
  });