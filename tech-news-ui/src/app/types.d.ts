export interface Comment {
    id: number;
    by: string;
    text: string;
    time: number;
    parent?: number;
    kids?: number[];
    comments?: Comment[];
    type: string;
}


interface CommentItemProps {
    comment: Comment;
    level: number;
}

export interface NewsItem {
    id: number;
    title: string;
    url?: string;
    score: number;
    text: string;
    by: string;
    time: number;
    descendants?: number;
    kids?: number[];
    comments?: Comment[];
  }