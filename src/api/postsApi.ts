import { apiClient } from "@/api/apiClient";
import type {
  CommentCreatedResponse,
  CommentsResponse,
  LikeResponse,
  PostDetailResponse,
  PostsResponse,
  PostTier,
} from "@/api/types";

type GetPostsParams = {
  limit: number;
  cursor?: string;
  tier?: PostTier;
};

function assertApiOk<T extends { ok: boolean }>(res: T, context: string): T {
  if (!res.ok) {
    throw new Error(`${context}: API returned ok: false`);
  }
  return res;
}

export async function getPosts(params: GetPostsParams): Promise<PostsResponse> {
  const res = await apiClient.get<PostsResponse>("/posts", {
    params: {
      limit: params.limit,
      cursor: params.cursor,
      tier: params.tier,
    },
  });
  return assertApiOk(res.data, "getPosts");
}

export async function getPostById(id: string): Promise<PostDetailResponse> {
  const res = await apiClient.get<PostDetailResponse>(`/posts/${id}`);
  return assertApiOk(res.data, `getPostById(${id})`);
}

export async function getPostComments(params: {
  postId: string;
  limit: number;
  cursor?: string;
}): Promise<CommentsResponse> {
  const res = await apiClient.get<CommentsResponse>(
    `/posts/${params.postId}/comments`,
    {
      params: { limit: params.limit, cursor: params.cursor },
    },
  );
  return assertApiOk(res.data, `getPostComments(${params.postId})`);
}

export async function togglePostLike(id: string): Promise<LikeResponse> {
  const res = await apiClient.post<LikeResponse>(`/posts/${id}/like`);
  return assertApiOk(res.data, `togglePostLike(${id})`);
}

export async function addPostComment(params: {
  postId: string;
  text: string;
}): Promise<CommentCreatedResponse> {
  const res = await apiClient.post<CommentCreatedResponse>(
    `/posts/${params.postId}/comments`,
    { text: params.text },
  );
  return assertApiOk(res.data, `addPostComment(${params.postId})`);
}
