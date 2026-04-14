import type { Comment } from "@/api/types";

export type LikeUpdatedEvent = {
  type: "like_updated";
  postId: string;
  likesCount: number;
};

export type CommentAddedEvent = {
  type: "comment_added";
  postId: string;
  comment: Comment;
};

export type PingEvent = { type: "ping" };

export type RealtimeEvent =
  | LikeUpdatedEvent
  | CommentAddedEvent
  | PingEvent
  | { type: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function parseRealtimeEvent(raw: unknown): RealtimeEvent | null {
  if (!isRecord(raw)) return null;
  const t = raw.type;
  if (typeof t !== "string") return null;

  if (t === "ping") return { type: "ping" };

  if (t === "like_updated") {
    const postId = raw.postId;
    const likesCount = raw.likesCount;
    if (typeof postId !== "string" || typeof likesCount !== "number") {
      return null;
    }
    return { type: "like_updated", postId, likesCount };
  }

  if (t === "comment_added") {
    const postId = raw.postId;
    const comment = raw.comment;
    if (typeof postId !== "string" || !isRecord(comment)) return null;
    const id = comment.id;
    const text = comment.text;
    const createdAt = comment.createdAt;
    const author = comment.author;
    if (
      typeof id !== "string" ||
      typeof text !== "string" ||
      typeof createdAt !== "string" ||
      !isRecord(author)
    ) {
      return null;
    }
    const displayName = author.displayName;
    const avatarUrl = author.avatarUrl;
    if (typeof displayName !== "string" || typeof avatarUrl !== "string") {
      return null;
    }
    const c: Comment = {
      id,
      postId: typeof comment.postId === "string" ? comment.postId : postId,
      text,
      createdAt,
      author: {
        id: typeof author.id === "string" ? author.id : "",
        username: typeof author.username === "string" ? author.username : "",
        displayName,
        avatarUrl,
      },
    };
    if (typeof comment.likesCount === "number") c.likesCount = comment.likesCount;
    if (typeof comment.isLiked === "boolean") c.isLiked = comment.isLiked;
    return { type: "comment_added", postId, comment: c };
  }

  return { type: t };
}
