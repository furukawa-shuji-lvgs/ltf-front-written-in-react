"use client";

import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";

import styles from "./FooterPc.module.scss";

interface PageTopButtonProps {
  readonly image: {
    readonly src: string;
    readonly width: number;
    readonly height: number;
    readonly alt: string;
  };
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const PageTopButton = ({ image }: PageTopButtonProps) => (
  <button
    type="button"
    className={styles.pageTop}
    onClick={scrollToTop}
  >
    <LegacyImage
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt}
    />
  </button>
);
