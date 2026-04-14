import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addPostComment, togglePostLike } from "@/api/postsApi";

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => await togglePostLike(postId),
    onSuccess: (res, postId) => {
      void res;
      void queryClient.invalidateQueries({ queryKey: ["post", { id: postId }] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { postId: string; text: string }) =>
      await addPostComment(params),
    onSuccess: (_res, vars) => {
      void queryClient.invalidateQueries({ queryKey: ["comments"] });
      void queryClient.invalidateQueries({
        queryKey: ["post", { id: vars.postId }],
      });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
