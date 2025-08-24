
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Clock, Dot, ExternalLink, Bookmark, MoreHorizontal, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsItem, NewsComment } from '@/types/news';

interface NewsCardProps {
  news: NewsItem;
  onLike?: (newsId: string) => void;
  onComment?: (newsId: string) => void;
  onShare?: (newsId: string) => void;
  onBookmark?: (newsId: string) => void;
}

const NewsCard = ({ news, onLike, onComment, onShare, onBookmark }: NewsCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(news.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<NewsComment[]>([]);

  const getBiasColor = (bias: string) => {
    const colors = {
      'left': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'center': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      'right': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[bias as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Política': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Economía': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Tecnología': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Sociedad': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Internacional': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Deportes': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(news.id);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(news.id);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment: NewsComment = {
        id: `comment-${Date.now()}`,
        author: 'Usuario',
        content: commentText.trim(),
        timestamp: new Date().toISOString(),
        likes: 0
      };
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      onComment?.(news.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.excerpt,
        url: news.url
      });
    } else {
      navigator.clipboard.writeText(news.url);
    }
    onShare?.(news.id);
  };

  const openNewsUrl = () => {
    window.open(news.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
            {news.sourceLogo ? (
              <img 
                src={news.sourceLogo} 
                alt={news.source}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-primary">
                {news.source.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
              {news.source}
            </h4>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatTimeAgo(news.timestamp)}</span>
              {news.readTime && (
                <>
                  <Dot className="w-3 h-3" />
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {news.readTime} min
                  </span>
                </>
              )}
              <Dot className="w-3 h-3" />
              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getCategoryColor(news.category))}>
                {news.category}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getBiasColor(news.bias))}>
            {news.bias === 'left' ? 'Izquierda' : news.bias === 'center' ? 'Centro' : 'Derecha'}
          </span>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h2 
          className="text-xl font-bold text-foreground line-clamp-2 hover:text-primary transition-colors cursor-pointer"
          onClick={openNewsUrl}
        >
          {news.title}
        </h2>
        
        <p className="text-muted-foreground line-clamp-3">
          {news.excerpt}
        </p>
        
        {news.image && (
          <div className="w-full h-64 bg-muted rounded-lg overflow-hidden cursor-pointer group">
            <img 
              src={news.image} 
              alt={news.imageAlt || news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onClick={openNewsUrl}
            />
          </div>
        )}

        {/* Tags */}
        {news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {news.tags.slice(0, 5).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <button 
            className={cn(
              "flex items-center space-x-2 transition-colors group",
              isLiked 
                ? "text-red-500" 
                : "text-muted-foreground hover:text-red-500"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("w-4 h-4 group-hover:scale-110 transition-transform", isLiked && "fill-current")} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          
          <button 
            className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 transition-colors group"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{news.comments + comments.length}</span>
          </button>
          
          <button 
            className="flex items-center space-x-2 text-muted-foreground hover:text-green-500 transition-colors group"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{news.shares}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className={cn(
              "p-2 rounded-full transition-colors",
              isBookmarked 
                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10" 
                : "text-muted-foreground hover:bg-muted"
            )}
            onClick={handleBookmark}
          >
            <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
          </button>
          <button 
            className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors px-3 py-2 hover:bg-primary/10 rounded-lg"
            onClick={openNewsUrl}
          >
            <span>Leer más</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="space-y-3">
            {/* Add Comment */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Escribe un comentario..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Comentar
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {comment.author.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCard;
