import React, { useCallback, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { useAddComment } from "@/api/queries/usePostMutations";
import { AppPressable } from "@/components/AppPressable";
import { Icon } from "@/components/Icon";
import { TextInput } from "@/components/Inputs/TextInput";
import { spacing } from "@/constants/tokens";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  postId: string;
};

export function CommentComposer({ postId }: Props) {
  const theme = useTheme();
  const [text, setText] = useState("");
  const addComment = useAddComment();

  const canSend = text.trim().length > 0 && postId.length > 0;
  const isSending = addComment.isPending;
  const sendDisabled = !canSend || isSending;

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || !postId) return;
    addComment.mutate(
      { postId, text: trimmed },
      {
        onSuccess: () => setText(""),
      },
    );
  }, [addComment, postId, text]);

  return (
    <View style={[styles.composer]}>
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Ваш комментарий"
          value={text}
          onChangeText={setText}
          editable={!isSending && postId.length > 0}
          maxLength={500}
          multiline
          backgroundColor={theme.backgroundElement}
        />
      </View>
      <AppPressable
        onPress={handleSend}
        disabled={sendDisabled}
        accessibilityRole="button"
        accessibilityLabel="Отправить комментарий"
        style={({ pressed }) => [
          styles.sendButton,
          pressed && !sendDisabled && styles.pressed,
        ]}
      >
        <View style={{ opacity: sendDisabled ? 0.5 : 1 }}>
          <Icon name="chat-message" size={30} color={theme.chatMessage} />
        </View>
      </AppPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    flexDirection: "row",
    // gap: 8,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === "ios" ? 10 : 14,
    alignItems: "flex-end",
    paddingHorizontal: spacing.md,
    backgroundColor: "#FFFFFF",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.65,
  },
});
