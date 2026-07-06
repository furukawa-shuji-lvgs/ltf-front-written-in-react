import type { Device } from "@shared/lib/device.ts";
import styles from "./PaginationListEllipsis.module.scss";
import type { PaginationConstData, PaginationMeta } from "./pagination.ts";
import { createEllipsisPagination, createPaginationPath } from "./pagination.ts";

export interface PaginationListEllipsisProps {
  paginationMeta: PaginationMeta;
  paginationConstData: PaginationConstData;
  device: Device;
  variant?: "-narrow" | "";
  maxCount?: number;
}

const ChevronLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
  </svg>
);

const PageItem = ({
  page,
  currentPage,
  href,
}: {
  page: number;
  currentPage: number;
  href: string;
}) => (
  <li className={`${styles.paginationItem} ${page === currentPage ? styles.isCurrent : ""}`}>
    {page === currentPage ? (
      <span className={styles.here}>{page}</span>
    ) : (
      <a
        href={href}
        className={styles.link}
      >
        {page}
      </a>
    )}
  </li>
);

// 移行元: app/components/Molecules/Pagination/PaginationListEllipsis.vue
export const PaginationListEllipsis = ({
  paginationMeta,
  paginationConstData,
  device,
  variant = "",
  maxCount = 17,
}: PaginationListEllipsisProps) => {
  const makePath = (page: number) => createPaginationPath(paginationConstData, page);
  // 両端の常に表示される数値を除いて表示される list アイテム数の最大値
  const resolvedMaxCount = device === "sp" ? 6 : maxCount;
  const listClass = `${styles.paginationList} ${variant === "-narrow" ? styles.narrow : ""}`;

  return (
    <div className={styles.paginationWrapper}>
      <a
        href={makePath(paginationMeta.currentPage - 1)}
        className={`${styles.operateButton} ${paginationMeta.currentPage === 1 ? styles.isUnavailable : ""}`}
        aria-label="前のページ"
      >
        <span className={styles.leftIcon}>
          <ChevronLeftIcon />
        </span>
      </a>
      {paginationMeta.totalPages <= resolvedMaxCount ? (
        <ul className={listClass}>
          {[...Array(paginationMeta.totalPages)].map((_, i) => (
            <PageItem
              // biome-ignore lint/suspicious/noArrayIndexKey: ページ番号そのもののため
              key={i + 1}
              page={i + 1}
              currentPage={paginationMeta.currentPage}
              href={makePath(i + 1)}
            />
          ))}
        </ul>
      ) : (
        (() => {
          const { insidePages, showLeadingEllipsis, showTrailingEllipsis } =
            createEllipsisPagination(paginationMeta, resolvedMaxCount);
          return (
            <ul className={listClass}>
              <PageItem
                page={1}
                currentPage={paginationMeta.currentPage}
                href={makePath(1)}
              />
              {showLeadingEllipsis && (
                <li className={`${styles.paginationItem} ${styles.ellipsis}`}>…</li>
              )}
              {insidePages.map((page) => (
                <PageItem
                  key={page}
                  page={page}
                  currentPage={paginationMeta.currentPage}
                  href={makePath(page)}
                />
              ))}
              {showTrailingEllipsis && (
                <li className={`${styles.paginationItem} ${styles.ellipsis}`}>…</li>
              )}
              <PageItem
                page={paginationMeta.totalPages}
                currentPage={paginationMeta.currentPage}
                href={makePath(paginationMeta.totalPages)}
              />
            </ul>
          );
        })()
      )}
      <a
        href={makePath(paginationMeta.currentPage + 1)}
        className={`${styles.operateButton} ${paginationMeta.currentPage === paginationMeta.totalPages ? styles.isUnavailable : ""}`}
        aria-label="次のページ"
      >
        <span className={styles.rightIcon}>
          <ChevronRightIcon />
        </span>
      </a>
    </div>
  );
};
