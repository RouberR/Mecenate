import { Image as ExpoImage, type ImageProps } from "expo-image";
import React from "react";

type Props = ImageProps & {
  blurred?: boolean;
  blurRadius?: number;
};

export function AppImage({ blurred, blurRadius = 80, ...rest }: Props) {
  return <ExpoImage blurRadius={blurred ? blurRadius : 0} {...rest} />;
}
