import { useInfiniteQuery } from "@tanstack/react-query";

import { getPosts } from "@/api/postsApi";

type FeedParams = {
  limit?: number;
};

export function useFeedPosts({ limit = 10 }: FeedParams = {}) {
  return useInfiniteQuery({
    queryKey: ["feed", { limit }],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      return await getPosts({ limit, cursor: pageParam });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.hasMore) return undefined;
      return lastPage.data.nextCursor ?? undefined;
    },
  });
}
