import { useState } from 'react';
import { CommentItemProps } from '../app/types';

export default function CommentItem({ comment, level }: CommentItemProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Format time ago
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
  
    const timeAgo = formatTimeAgo(comment.time);
    const hasChildren = comment.comments && comment.comments.length > 0;
  
    return (
      <div 
        className={`border-l-4 pl-4 ${
          level % 5 === 0 ? 'border-gray-300 dark:border-gray-700' :
          level % 5 === 1 ? 'border-gray-400 dark:border-gray-600' :
          level % 5 === 2 ? 'border-gray-500 dark:border-gray-500' :
          level % 5 === 3 ? 'border-gray-600 dark:border-gray-400' :
          'border-gray-700 dark:border-gray-300'
        }`}
      >
        <div className="comment-header flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{comment.by}</span>
          <span>•</span>
          <span>{timeAgo} ago</span>
          {hasChildren && (
            <>
              <span>•</span>
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hover:underline focus:outline-none"
              >
                {isCollapsed ? `[${comment.comments?.length} more]` : '[-]'}
              </button>
            </>
          )}
        </div>
        
        {!isCollapsed && (
          <>
            <div 
              className="comment-body mt-1 text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: comment.text }}
            />
            
            {hasChildren && (
              <div className="mt-4 space-y-4">
                {comment.comments!.map((childComment) => (
                  <CommentItem 
                    key={childComment.id} 
                    comment={childComment} 
                    level={level + 1} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }