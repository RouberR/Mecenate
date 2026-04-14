import { useCallback, useEffect, useState } from "react";

import type { Comment } from "@/api/types";

type LikeState = { count: number; isLiked: boolean };

type Result = {
  likeStateById: Record<string, LikeState>;
  getLikeState: (comment: Comment) => LikeState;
  toggleLike: (comment: Comment) => void;
};

export function useCommentLikes(resetKey?: string): Result {
  const [likeStateById, setLikeStateById] = useState<
    Record<string, LikeState>
  >({});

  useEffect(() => {
    if (resetKey == null) return;
    setLikeStateById({});
  }, [resetKey]);

  const getLikeState = useCallback(
    (comment: Comment): LikeState => {
      return (
        likeStateById[comment.id] ?? {
          count: comment.likesCount ?? 0,
          isLiked: comment.isLiked ?? false,
        }
      );
    },
    [likeStateById],
  );

  const toggleLike = useCallback((comment: Comment) => {
    setLikeStateById((prev) => {
      const current =
        prev[comment.id] ??
        ({
          count: comment.likesCount ?? 0,
          isLiked: comment.isLiked ?? false,
        } as LikeState);
      const nextLiked = !current.isLiked;
      const nextCount = Math.max(0, current.count + (nextLiked ? 1 : -1));
      return {
        ...prev,
        [comment.id]: { count: nextCount, isLiked: nextLiked },
      };
    });
  }, []);

  return { likeStateById, getLikeState, toggleLike };
}
