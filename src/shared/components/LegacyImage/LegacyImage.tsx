import type { ImageProps } from "next/image";

import Image from "next/image";

export interface LegacyImageProps extends Omit<
  ImageProps,
  "src" | "alt" | "width" | "height" | "unoptimized"
> {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt?: string | undefined;
}

const shouldBypassOptimization = (src: string) => src.startsWith("data:") || src.endsWith(".svg");

export const LegacyImage = ({ alt = "", src, ...props }: Readonly<LegacyImageProps>) => {
  const unoptimized = shouldBypassOptimization(src);

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={unoptimized}
    />
  );
};
