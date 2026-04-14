import React, { useCallback, useRef } from "react";
import { GestureResponderEvent, Pressable, PressableProps } from "react-native";

type AppPressableProps = PressableProps & {
  onPress?: (event: GestureResponderEvent) => void;
  debounceDelay?: number;
};

export const AppPressable: React.FC<AppPressableProps> = ({
  onPress,
  debounceDelay = 400,
  disabled,
  children,
  ...rest
}) => {
  const lastPressTime = useRef(0);
  const isBlocked = useRef(false);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;

      const now = Date.now();

      if (isBlocked.current && now - lastPressTime.current < debounceDelay) {
        return;
      }

      isBlocked.current = true;
      lastPressTime.current = now;

      onPress?.(event);

      setTimeout(() => {
        isBlocked.current = false;
      }, debounceDelay);
    },
    [onPress, debounceDelay, disabled],
  );

  return (
    <Pressable {...rest} onPress={handlePress} disabled={disabled}>
      {children}
    </Pressable>
  );
};
