import { format } from 'date-fns';

export function formatArticleDate(dateString) {
  const date = new Date(dateString);
  return format(date, 'MMMM d, yyyy'); 
}
