import { useEffect } from 'react';
import { useArticleStore } from '../store/articles';

const REFRESH_INTERVAL = 30 * 60 * 1000; 

export function useArticleAutoRefresh() {
  const setManyArticles = useArticleStore((state) => state.setManyArticles);

  useEffect(() => {
    let timerId = null;

    const fetchLatest = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) return;

        const freshArticles = await response.json();
        setManyArticles(freshArticles);
      } catch (error) {
        console.warn('[Article refresh failed]', error);
      }
    };

    // Run once after hydration
    fetchLatest();

    // Background refresh every 30 minutes
    timerId = setInterval(fetchLatest, REFRESH_INTERVAL);

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [setManyArticles]);
}
