import { apiClient } from "@/api/apiClient";
import type { PostsResponse } from "@/api/types";

type GetPostsParams = {
  limit: number;
  cursor?: string;
};

export async function getPosts(params: GetPostsParams): Promise<PostsResponse> {
  const res = await apiClient.get<PostsResponse>("/posts", {
    params: {
      limit: params.limit,
      cursor: params.cursor,
    },
  });
  return res.data;
}
