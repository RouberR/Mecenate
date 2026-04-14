export type Author = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  subscribersCount?: number;
  isVerified?: boolean;
};

export type PostTier = "free" | "paid";

export type Post = {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
};

export type PostsResponse = {
  ok: boolean;
  data: {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
  };
};

export type PostDetailResponse = {
  ok: boolean;
  data: {
    post: Post;
  };
};

export type LikeResponse = {
  ok: boolean;
  data: {
    isLiked: boolean;
    likesCount: number;
  };
};

export type Comment = {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
};

export type CommentsResponse = {
  ok: boolean;
  data: {
    comments: Comment[];
    nextCursor: string | null;
    hasMore: boolean;
  };
};

export type CommentCreatedResponse = {
  ok: boolean;
  data: {
    comment: Comment;
  };
};
