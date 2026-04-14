import React from "react";
import type { SvgProps } from "react-native-svg";

import ChatMessage from "@/assets/images/icons/button_chat-message.svg";
import CommentSolid from "@/assets/images/icons/comment_soild.svg";
import DonateSolid from "@/assets/images/icons/donate_solid.svg";
import Heart from "@/assets/images/icons/heart.svg";

const icons = {
  heart: Heart,
  "chat-message": ChatMessage,
  "donate-solid": DonateSolid,
  "comment-solid": CommentSolid,
} as const;

export type IconName = keyof typeof icons;

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
} & Omit<SvgProps, "width" | "height">;

export function Icon({ name, size = 24, color, style, ...rest }: IconProps) {
  const Cmp = icons[name];
  return (
    <Cmp
      width={size}
      height={size}
      {...rest}
      {...(color !== undefined ? { color, fill: color } : {})}
      style={style}
    />
  );
}
