import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentItem from '../components/CommentItem';
import { getNewsItem } from '../api/news';
import { NewsItem } from '../app/types';

export default function ItemDetail() {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<NewsItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchItem = async () => {
        setIsLoading(true);
        try {
          if (id) {
            const response = await getNewsItem(parseInt(id));
            setItem(response.data);
          }
        } catch (error) {
          console.error('Error fetching item:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchItem();
    }, [id]);
  
    const formatTimeAgo = (timestamp: number): string => {
      const now = Date.now() / 1000;
      const secondsAgo = now - timestamp;
      
      if (secondsAgo < 3600) {
        const minutes = Math.floor(secondsAgo / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
      } else if (secondsAgo < 86400) {
        const hours = Math.floor(secondsAgo / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      } else {
        const days = Math.floor(secondsAgo / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'}`;
      }
    };
  
    if (isLoading) {
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  
    if (!item) {
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="text-center text-red-500">Item not found</div>
        </div>
      );
    }
  
    const domain = item.url ? new URL(item.url).hostname.replace('www.', '') : '';
    const timeAgo = formatTimeAgo(item.time);
  
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <table className="w-full border-collapse border-b border-gray-200 dark:border-gray-700">
            <thead>
              <tr>
                <th className="w-full text-left">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-gray-900 dark:text-white hover:underline"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </span>
                  )}
                  {item.url && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({domain})
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-2 text-left text-gray-500 dark:text-gray-400 text-sm">
                  <div className="flex">
                    <div>
                      {item.score} {item.score === 1 ? 'point' : 'points'}
                    </div>
                    <div className="ml-2">
                      by {item.by} • {timeAgo} ago
                    </div>
                  </div>
                </td>
              </tr>
              {item.text && (
                <tr>
                  <td 
                    className="py-4 text-gray-800 dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        <div className="mt-6">
          
          <div className="space-y-4">
            {item.comments && item.comments.length > 0 ? (
              item.comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} level={0} />
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No comments</div>
            )}
          </div>
        </div>
      </div>
    );
  }