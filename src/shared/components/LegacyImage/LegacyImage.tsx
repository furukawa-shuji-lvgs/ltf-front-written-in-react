import Image, { type ImageProps } from "next/image";

export interface LegacyImageProps
  extends Omit<ImageProps, "src" | "alt" | "width" | "height" | "unoptimized"> {
  src: string;
  width: number;
  height: number;
  alt?: string | undefined;
}

const shouldBypassOptimization = (src: string) => src.startsWith("data:") || src.endsWith(".svg");

export const LegacyImage = ({ alt = "", src, ...props }: LegacyImageProps) => {
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
