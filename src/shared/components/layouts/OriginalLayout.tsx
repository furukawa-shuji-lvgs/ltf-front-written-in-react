import type { ReactNode } from "react";

export interface OriginalLayoutProps {
  children: ReactNode;
}

// 移行元: app/layouts/original.vue
// 移行メモ: 移行元にあった params.id の整数チェック（404）は App Router では
// 各ルートの page.tsx / generateMetadata 側で notFound() を呼んで行う
export const OriginalLayout = ({ children }: OriginalLayoutProps) => <div>{children}</div>;
