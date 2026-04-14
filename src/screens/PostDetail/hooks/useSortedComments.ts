import { useCallback, useMemo, useState } from "react";

import type { Comment } from "@/api/types";

type CommentsData =
  | {
      pages: Array<{
        data: { comments: Comment[] };
      }>;
    }
  | undefined;

type SortOrder = "new" | "old";

type Result = {
  comments: Comment[];
  sort: SortOrder;
  toggleSort: () => void;
};

export function useSortedComments(data: CommentsData): Result {
  const [sort, setSort] = useState<SortOrder>("new");

  const flat = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.comments) ?? [];
  }, [data]);

  const comments = useMemo(() => {
    if (flat.length <= 1) return flat;
    const next = [...flat].sort((a, b) => {
      const left = +new Date(a.createdAt);
      const right = +new Date(b.createdAt);
      return sort === "new" ? right - left : left - right;
    });
    return next;
  }, [flat, sort]);

  const toggleSort = useCallback(() => {
    setSort((current) => (current === "new" ? "old" : "new"));
  }, []);

  return { comments, sort, toggleSort };
}
