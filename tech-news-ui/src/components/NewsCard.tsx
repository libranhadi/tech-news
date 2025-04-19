import { Link } from 'react-router-dom';
import { NewsItem } from '../app/types';

export default function NewsCard({ item }: { item: NewsItem }) {
  const domain = item.url ? new URL(item.url).hostname.replace('www.', '') : '';
  
  const now = Date.now() / 1000;
  const secondsAgo = now - item.time;
  
  let timeAgo: string;
  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    timeAgo = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    timeAgo = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else {
    const days = Math.floor(secondsAgo / 86400);
    timeAgo = `${days} ${days === 1 ? 'day' : 'days'}`;
  }

  return (
    <table className="w-full border-collapse border-b border-gray-200 dark:border-gray-700">
      <thead>
        <tr>
          <th className='w-full text-left'>
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
              <Link 
                to={`/item/${item.id}`}
                className="text-lg font-medium text-gray-900 dark:text-white hover:underline"
              >
                {item.title} sadsad
              </Link>
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
          <td className="py-2 pr-2 text-left text-gray-500 dark:text-gray-400 w-[60px] text-sm ">
            <div className='flex'>
            <div>
              {item.score} {item.score === 1 ? 'point' : 'points'}
            </div>
            <div className="ml-2">
              by {item.by} • {timeAgo} ago | 
              <Link 
                to={`/item/${item.id}`} 
                className="ml-2 hover:underline"
              >
                {item.descendants || 0} {(item.descendants === 1) ? 'comment' : 'comments'}
              </Link>
            </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}