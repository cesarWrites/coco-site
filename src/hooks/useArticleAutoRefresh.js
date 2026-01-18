import { useEffect } from 'react';
import { useArticleStore } from '../store/articles';

const REFRESH_INTERVAL = 30 * 60 * 1000; 
const WP_ENDPOINT = "https://backend.cocomedia.co.ke/wp-json/wp/v2/posts?_embed=1&per_page=100&orderby=date&order=desc";

export function useArticleAutoRefresh() {
    const setManyArticles = useArticleStore((state) => state.setManyArticles);
  
    useEffect(() => {
      let timerId;
  
      const fetchLatest = async () => {
        try {
          const response = await fetch(WP_ENDPOINT);
  
          // 🛡️ Defensive check
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn('WP did not return JSON');
            return;
          }
  
          const freshArticles = await response.json();
          setManyArticles(freshArticles);

          console.log(freshArticles)
        } catch (error) {
          console.warn('[Article refresh failed]', error);
        }
      };
  
      // Run once on mount
      fetchLatest();
  
      // Refresh every 30 minutes
      timerId = setInterval(fetchLatest, REFRESH_INTERVAL);
  
      return () => clearInterval(timerId);
    }, [setManyArticles]);
  }