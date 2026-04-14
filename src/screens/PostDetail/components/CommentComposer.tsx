import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { Icon } from "@/components/Icon";
import { TextInput } from "@/components/Inputs/TextInput";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  text: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  disabled: boolean;
  sendDisabled: boolean;
};

export function CommentComposer({
  text,
  onChangeText,
  onSend,
  disabled,
  sendDisabled,
}: Props) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const outlineBorder = isDark ? "#3C424C" : "#D5DAE2";

  return (
    <View style={styles.composer}>
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Ваш комментарий"
          value={text}
          onChangeText={onChangeText}
          editable={!disabled}
          maxLength={500}
          multiline
          outlineBorderColor={outlineBorder}
          backgroundColor={theme.backgroundElement}
          style={{ minHeight: 40 }}
        />
      </View>
      <Pressable
        onPress={onSend}
        disabled={sendDisabled}
        accessibilityRole="button"
        accessibilityLabel="Отправить комментарий"
        style={({ pressed }) => [
          styles.sendButton,
          pressed && !sendDisabled && styles.pressed,
        ]}
      >
        <View style={{ opacity: sendDisabled ? 0.38 : 1 }}>
          <Icon name="chat-message" size={30} color={theme.chatMessage} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    flexDirection: "row",
    // gap: 8,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 10 : 14,
    alignItems: "flex-end",
    paddingHorizontal: 16,
    backgroundColor: "white",
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
