import React from "react";
import { Image as ExpoImage, type ImageProps } from "expo-image";

type Props = ImageProps & {
  blurred?: boolean;
  blurRadius?: number;
};

export function AppImage({ blurred, blurRadius = 18, ...rest }: Props) {
  return <ExpoImage blurRadius={blurred ? blurRadius : 0} {...rest} />;
}

