import { useState, useEffect } from 'react';
import { getNews } from '../api/news';
import NewsCard from '../components/NewsCard';
import axios from 'axios';
import { NewsItem } from '../app/types';


interface HomeProps {
  type: string;
}

export default function Home({ type }: HomeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchNews = async () => {
      
      setIsLoading(true);
      try {
        const response = await getNews(type, page, limit,  abortController.signal);
        if (!abortController.signal.aborted) {
          if (page === 1) {
            setNewsItems(response.data);
          } else {
            setNewsItems(limit => [...limit, ...response.data]);
          }
        }
      } catch (error: any) {
        if (axios.isCancel(error)) {
          console.log('Request was canceled');
        } else {
          console.error('Error fetching news:', error);
        }
        if (error.code === 'ECONNABORTED') {
          console.warn('Timeout. Coba retry...');
          setTimeout(() => {
            if (!abortController.signal.aborted) fetchNews();
          }, 2000);
        } else {
          console.error('Error fetching news:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
    return () => {
      abortController.abort(); 
    };
  }, [type, page, limit]);

  useEffect(() => {
    setPage(1);
    setLimit(30);
    setNewsItems([]);
    setIsLoading(true);
  }, [type]);

  const loadMore = () => {
    if (!isLoading) {
      setNewsItems([]);
      setPage(limit + 1);
      setLimit(limit + 30);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-solid"></div>
          <p className="ml-4 text-gray-500">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {isLoading ? (
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      ) : (
        <>
          {/* <div className="space-y-1">
            {newsItems.map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div> */}
        
          {newsItems.map(item => (
            <NewsCard key={item.id} item={item} />
          ))}

         
          {newsItems.length > 0 && (
            <div className="mt-8 text-center">
              <button 
                onClick={loadMore}
                disabled={isLoading}
                className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-orange-300"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}