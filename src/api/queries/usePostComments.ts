import { useInfiniteQuery } from "@tanstack/react-query";

import { getPostComments } from "@/api/postsApi";

export function usePostComments(params: { postId: string; limit?: number }) {
  const limit = params.limit ?? 20;
  return useInfiniteQuery({
    queryKey: ["comments", { postId: params.postId, limit }],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      return await getPostComments({
        postId: params.postId,
        limit,
        cursor: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.hasMore) return undefined;
      return lastPage.data.nextCursor ?? undefined;
    },
    enabled: Boolean(params.postId),
  });
}

