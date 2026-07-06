import { OwndInflowSessionRecorder } from "@shared/components/OwndInflowSessionRecorder/OwndInflowSessionRecorder.tsx";
import { APP_ROOT_TEST_ID, LEGACY_APP_ROOT_ID } from "@shared/constants/appRoot.ts";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { rootFontClassName } from "./fonts.ts";
import "@shared/styles/globals.scss";

const description =
  "【業界認知度No.1】レバテックフリーランスはIT・Web業界のフリーランスエンジニア求人・案件募集情報サイトです。言語や単価など幅広い条件から求人・案件を検索できます。高単価の新規案件を数多くご提供しており、参画後のサポート体制も万全です。案件をお探しの方はレバテックフリーランスにお任せください。";

export const metadata: Metadata = {
  title: "ITフリーランスエンジニアの求人・案件【レバテックフリーランス】",
  description,
  keywords: "ITフリーランス,フリーランスエンジニア,個人事業主,レバテックフリーランス",
  openGraph: {
    title: "フリーエンジニアのIT案件ならレバテックフリーランス",
    description,
    type: "article",
    images: "https://lt-prd-ownd-images.s3.ap-northeast-1.amazonaws.com/common/ltf/ogp_ltf.png",
    url: "https://freelance.levtech.jp/",
    siteName: "レバテックフリーランス",
  },
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    lang="ja"
    className={rootFontClassName}
  >
    <body>
      <div
        id={LEGACY_APP_ROOT_ID}
        data-testid={APP_ROOT_TEST_ID}
        data-next-root="true"
      >
        <OwndInflowSessionRecorder />
        {children}
      </div>
    </body>
  </html>
);

export default RootLayout;
