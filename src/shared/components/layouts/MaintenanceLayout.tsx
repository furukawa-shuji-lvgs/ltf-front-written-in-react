import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";
import { HeaderData } from "@shared/constants/header.ts";
import { imageUrl } from "@shared/lib/image.ts";
import type { ReactNode } from "react";
import styles from "./MaintenanceLayout.module.scss";

export interface MaintenanceLayoutProps {
  children: ReactNode;
}

// 移行元: app/layouts/maintenance.vue
// 移行メモ: 移行元は $device で分岐していたが PC / SP とも同一マークアップのため分岐は不要
export const MaintenanceLayout = ({ children }: MaintenanceLayoutProps) => {
  const logoImage = HeaderData.pc.logo.image;

  return (
    <div>
      <div className={styles.ltfLogo}>
        <LegacyImage
          src={imageUrl(logoImage.src)}
          width={logoImage.width}
          height={logoImage.height}
          alt={logoImage.alt}
        />
      </div>
      {children}
    </div>
  );
};
