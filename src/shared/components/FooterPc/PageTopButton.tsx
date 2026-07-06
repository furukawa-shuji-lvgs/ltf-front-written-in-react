"use client";

import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";
import styles from "./FooterPc.module.scss";

interface PageTopButtonProps {
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
}

export const PageTopButton = ({ image }: PageTopButtonProps) => (
  <button
    type="button"
    className={styles.pageTop}
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  >
    <LegacyImage
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt}
    />
  </button>
);
