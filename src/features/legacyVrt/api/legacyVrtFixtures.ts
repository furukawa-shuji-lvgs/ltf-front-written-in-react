export const legacyTechnologies = [
  "Java",
  "PHP",
  "Python",
  "Ruby",
  "JavaScript",
  "AWS",
  "TypeScript",
  "Go",
];

export const legacyLocations = ["東京都", "リモート", "週3日", "高単価", "上流工程", "長期案件"];

const articleTitles = [
  "フリーランスエンジニアになるには",
  "案件参画までに準備すること",
  "単価を上げるスキルの考え方",
  "契約前に確認したい条件",
  "リモート案件の探し方",
  "確定申告と経費の基礎",
] satisfies [string, ...string[]];

export interface LegacyProjectCardData {
  title: string;
  price: string;
  tags: string[];
}

export const legacyProjectCards = [
  {
    title: "Java/Spring Bootを用いた基幹システム開発案件",
    price: "〜850,000円/月",
    tags: ["Java", "Spring Boot", "リモート可"],
  },
  {
    title: "TypeScript/Reactを用いたSaaSフロントエンド開発案件",
    price: "〜780,000円/月",
    tags: ["TypeScript", "React", "週3日可"],
  },
  {
    title: "AWSを用いたクラウド基盤設計・運用案件",
    price: "〜900,000円/月",
    tags: ["AWS", "Terraform", "上流工程"],
  },
] satisfies [LegacyProjectCardData, ...LegacyProjectCardData[]];

const featureTitles = ["案件数が多い", "単価が高い", "選べる条件が幅広い"] satisfies [
  string,
  ...string[],
];

export const legacyProjectListItems = Array.from({ length: 12 }, (_, index) => ({
  id: `project-card-${index + 1}`,
  project: legacyProjectCards[index % legacyProjectCards.length] ?? legacyProjectCards[0],
}));

export const featureItems = Array.from({ length: 12 }, (_, index) => ({
  id: `feature-${index + 1}`,
  number: index + 1,
  title: featureTitles[index % featureTitles.length] ?? featureTitles[0],
}));

export const legacyArticleItems = Array.from({ length: 12 }, (_, index) => ({
  id: `article-${index + 1}`,
  title: articleTitles[index % articleTitles.length] ?? articleTitles[0],
}));

export const faqItems = Array.from({ length: 10 }, (_, index) => ({
  id: `faq-${index + 1}`,
  open: index < 2,
}));

const footerLinks = [
  "フリーランススタートガイド",
  "ご利用者インタビュー",
  "おすすめキーワード",
  "案件一覧",
  "フリーランスエンジニアの求人・案件",
  "企業紹介ファイル",
  "運営会社",
  "利用規約",
  "ヘルプ",
  "サイトマップ",
  "Javaの求人・案件",
  "PHPの求人・案件",
  "Pythonの求人・案件",
  "Rubyの求人・案件",
  "AWSの求人・案件",
  "ITの仕事探しはレバテック",
  "IT転職ならレバテックキャリア",
  "オンライン診療ならレバクリ",
  "新卒就活エージェントならキャリアチケット",
  "外国人採用ならLeverages Global",
];

const sitemapLinks = [
  ...footerLinks,
  "レバテックフリーランスについて",
  "サービス紹介",
  "レバテックフリーランスとは",
  "ご利用の流れ",
  "企業紹介ファイル",
  "常駐型フリーランスとは",
  "初期費用ゼロの理由",
  "市場分析・案件単価情報について",
  "ご登録後マイページについて",
  "お役立ちコンテンツ",
  "無料個別相談会",
  "フリーエンジニア「お役立ちコンテンツ」",
  "単価診断",
  "案件検索",
  "おすすめキーワード",
  "単価相場一覧",
  "Java案件",
  "TypeScript案件",
  "Python案件",
  "Ruby案件",
  "PHP案件",
  "Go案件",
  "サーバーサイドエンジニア案件",
  "フロントエンドエンジニア案件",
  "プロジェクトマネージャー案件",
  "ネットワークエンジニア案件",
  "リモート案件",
  "週3日案件",
  "高単価案件",
  "東京都23区案件",
  "大阪案件",
  "福岡案件",
  "運営会社について",
  "利用規約",
  "お問い合わせ（個人用）",
  "お問い合わせ（企業用）",
  "レバテックグループ・プライバシーポリシー",
];

export const legacySitemapLinkItems = sitemapLinks.map((label, order) => ({
  id: `sitemap-link-${order + 1}`,
  label,
}));

export const legacyStartGuideSteps = [
  "そもそもフリーランスって？",
  "フリーランスに必要な準備・働き方の手順",
  "案件はどうやって探せばいい？",
  "契約の流れや単価交渉、参画中のヒント",
  "確定申告の準備とチェックポイント",
];

export const legacyStartGuideCards = [
  "エージェントとのご相談の流れ",
  "案件参画後も安心して働けるサポート",
  "登録者の活動を支えるマイページの機能",
];

export const legacyHelpGroups = [
  "登録・変更・削除",
  "案件情報の検索",
  "案件情報の掲載内容",
  "個人情報の取り扱い",
  "推奨環境",
  "その他",
];
