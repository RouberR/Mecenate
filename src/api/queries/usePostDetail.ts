import { useQuery } from "@tanstack/react-query";

import { getPostById } from "@/api/postsApi";

export function usePostDetail(id: string) {
  return useQuery({
    queryKey: ["post", { id }],
    queryFn: async () => await getPostById(id),
    enabled: Boolean(id),
  });
}

