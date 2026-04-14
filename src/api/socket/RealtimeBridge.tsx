import { queryClient } from "@/api/queryClient";
import {
  parseRealtimeEvent,
  type CommentAddedEvent,
  type LikeUpdatedEvent,
} from "@/api/socket/realtimeEvents";
import { useRealtimeEvents } from "@/api/socket/useRealtimeEvents";

export function RealtimeBridge() {
  useRealtimeEvents({
    onEvent: (raw) => {
      const e = parseRealtimeEvent(raw);
      if (!e) return;

      if (e.type === "ping") return;

      if (e.type === "like_updated") {
        const ev = e as LikeUpdatedEvent;
        void queryClient.invalidateQueries({
          queryKey: ["post", { id: ev.postId }],
        });
        void queryClient.invalidateQueries({ queryKey: ["feed"] });
        return;
      }

      if (e.type === "comment_added") {
        const ev = e as CommentAddedEvent;
        void queryClient.invalidateQueries({ queryKey: ["comments"] });
        void queryClient.invalidateQueries({
          queryKey: ["post", { id: ev.postId }],
        });
        void queryClient.invalidateQueries({
          queryKey: ["feed"],
        });
      }
    },
  });

  return null;
}
