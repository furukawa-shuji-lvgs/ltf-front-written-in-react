import styles from "@features/legacyVrt/components/LegacyVrtShell.module.scss";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

export const MaintenanceLegacyBody = (_props: { match: PageRouteMatch }) => (
  <main className={styles.maintenanceMain}>
    <h1>メンテナンス中です</h1>
    <p>
      大変申し訳ございませんが、サービスメンテナンス中のため、現在サービスをご利用になれません。
    </p>
    <strong>メンテナンス時間</strong>
    <span>2024/10/24 07:00 〜 2024/10/24 09:00</span>
  </main>
);
