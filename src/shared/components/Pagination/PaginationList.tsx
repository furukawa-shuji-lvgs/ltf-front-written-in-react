import type { Device } from "@shared/lib/device.ts";
import styles from "./PaginationList.module.scss";
import type { PaginationConstData, PaginationMeta } from "./pagination.ts";
import { createPaginationPath, createPaginationRange } from "./pagination.ts";

export interface PaginationListProps {
  paginationMeta: PaginationMeta;
  paginationConstData: PaginationConstData;
  device: Device;
}

// 移行元: app/components/Molecules/Pagination/PaginationList.vue
export const PaginationList = ({
  paginationMeta,
  paginationConstData,
  device,
}: PaginationListProps) => {
  const makePath = (page: number) => createPaginationPath(paginationConstData, page);

  return (
    <div className={styles.paginationWrapper}>
      {paginationMeta.currentPage !== 1 && (
        <a
          className={`${styles.operateButton} ${styles.first}`}
          rel="first"
          href={paginationConstData.indexLink}
          aria-label="最初のページ"
        >
          <span className={styles.visuallyHidden}>最初のページ</span>
        </a>
      )}
      <a
        className={`${styles.operateButton} ${styles.prev} ${paginationMeta.currentPage === 1 ? styles.disabled : ""}`}
        href={makePath(paginationMeta.currentPage - 1)}
        rel="prev"
        aria-label="前のページ"
      >
        {device !== "sp" && "Prev"}
      </a>
      <ul className={styles.paginationList}>
        {createPaginationRange(paginationMeta, device).map((page) => (
          <li
            key={page}
            className={styles.item}
          >
            {paginationMeta.currentPage === page ? (
              <span className={`${styles.operateButton} ${styles.current}`}>{page}</span>
            ) : (
              <a
                href={makePath(page)}
                className={styles.operateButton}
              >
                {page}
              </a>
            )}
          </li>
        ))}
      </ul>
      <a
        className={`${styles.operateButton} ${styles.next} ${paginationMeta.currentPage === paginationMeta.totalPages ? styles.disabled : ""}`}
        href={makePath(paginationMeta.currentPage + 1)}
        rel="next"
        aria-label="次のページ"
      >
        {device !== "sp" && "Next"}
      </a>
      {paginationMeta.currentPage !== paginationMeta.totalPages && (
        <a
          className={`${styles.operateButton} ${styles.last}`}
          href={makePath(paginationMeta.totalPages)}
          rel="last"
          aria-label="最後のページ"
        >
          <span className={styles.visuallyHidden}>最後のページ</span>
        </a>
      )}
    </div>
  );
};
