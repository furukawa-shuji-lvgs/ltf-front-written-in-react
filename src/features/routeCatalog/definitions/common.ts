import type {
  PageAction,
  PageDefinition,
  PageSection,
  RouteFeature,
  RouteLayout,
} from "../types.ts";

const primaryActions = {
  projectSearch: { label: "案件を探す", href: "/project/search/" },
  register: { label: "無料登録へ進む", href: "/entry/input/1/short/" },
  guide: { label: "ガイドを読む", href: "/guide/" },
  service: { label: "サービスを見る", href: "/service/" },
  word: { label: "用語を調べる", href: "/word/" },
} satisfies Record<string, PageAction>;

const featureSections = {
  achievement: [
    {
      title: "利用者インタビュー",
      body: "フリーランスとして参画した方の経歴、案件選び、参画後の変化を紹介します。",
    },
    {
      title: "参画までの流れ",
      body: "相談、提案、商談、契約後フォローまでの流れを確認できます。",
    },
  ],
  consultation: [
    {
      title: "キャリア相談",
      body: "市場価値や案件選びに関する悩みを、専門担当者へ相談できます。",
    },
    {
      title: "相談テーマ",
      body: "独立準備、単価交渉、稼働条件、スキルの棚卸しなどのテーマを扱います。",
    },
  ],
  entry: [
    {
      title: "入力内容",
      body: "希望条件、連絡先、経験スキルを入力して案件提案に進みます。",
    },
    {
      title: "完了後の案内",
      body: "登録内容をもとに担当者が確認し、希望条件に合う案件の提案を開始します。",
    },
  ],
  friend: [
    {
      title: "紹介キャンペーン",
      body: "知人紹介やキャンペーンの概要、特典、登録後の流れを確認できます。",
    },
    {
      title: "利用条件",
      body: "紹介対象者、適用条件、特典付与までのステップを整理しています。",
    },
  ],
  guide: [
    {
      title: "フリーランスガイド",
      body: "独立準備、税務、契約、キャリア形成などのナレッジをテーマ別に探せます。",
    },
    {
      title: "おすすめ記事",
      body: "よく読まれている記事やタグ別の記事一覧から、必要な情報にすばやく移動できます。",
    },
  ],
  information: [
    {
      title: "サイト情報",
      body: "ヘルプ、サイトマップ、特集ページなどサービス利用時に参照する情報をまとめています。",
    },
    {
      title: "問い合わせ導線",
      body: "よくある質問や関連ページから、目的に合うサポート情報へ移動できます。",
    },
  ],
  maintenance: [
    {
      title: "メンテナンス",
      body: "ただいまサービスの一部機能を調整しています。時間をおいて再度アクセスしてください。",
    },
  ],
  member: [
    {
      title: "会員登録",
      body: "プロフィールや経験情報を登録し、フリーランス案件の提案を受け取れます。",
    },
    {
      title: "登録完了後",
      body: "登録内容をもとに担当者が確認し、希望条件に合う案件をご案内します。",
    },
  ],
  project: [
    {
      title: "案件検索",
      body: "言語、職種、単価、勤務地、稼働条件などからフリーランス案件を探せます。",
    },
    {
      title: "案件詳細",
      body: "業務内容、単価、契約条件、必要スキル、参画メリットを確認できます。",
    },
  ],
  service: [
    {
      title: "サービス紹介",
      body: "案件提案、キャリア相談、参画中フォローなど、提供サービスの特徴を確認できます。",
    },
    {
      title: "診断・支援",
      body: "単価診断、電話相談、はじめてのフリーランス支援など目的別のサービスに進めます。",
    },
  ],
  top: [
    {
      title: "案件検索",
      body: "高単価、リモート、週3日からなど、希望条件に合う案件へすぐ移動できます。",
    },
    {
      title: "サービスの強み",
      body: "IT・Web業界に特化した案件提案と、参画後まで続くサポートを紹介します。",
    },
  ],
  word: [
    {
      title: "IT用語集",
      body: "職種、スキル、開発領域に関するキーワードを一覧で確認できます。",
    },
    {
      title: "関連案件",
      body: "用語に関連する求人・案件一覧へ移動し、具体的な募集内容を確認できます。",
    },
  ],
} satisfies Record<RouteFeature, readonly PageSection[]>;

const actionsByFeature = {
  achievement: [primaryActions.projectSearch, primaryActions.register],
  consultation: [primaryActions.register, primaryActions.guide],
  entry: [primaryActions.projectSearch, primaryActions.service],
  friend: [primaryActions.register, primaryActions.service],
  guide: [primaryActions.projectSearch, primaryActions.word],
  information: [primaryActions.projectSearch, primaryActions.guide],
  maintenance: [primaryActions.guide],
  member: [primaryActions.projectSearch, primaryActions.register],
  project: [primaryActions.register, primaryActions.guide],
  service: [primaryActions.projectSearch, primaryActions.register],
  top: [primaryActions.projectSearch, primaryActions.register],
  word: [primaryActions.projectSearch, primaryActions.guide],
} satisfies Record<RouteFeature, readonly PageAction[]>;

export const definePage = ({
  feature,
  layout = "standard",
  actions = actionsByFeature[feature],
  sections = featureSections[feature],
  ogType = feature === "top" ? "website" : "article",
  ...definition
}: Omit<PageDefinition, "actions" | "layout" | "sections" | "ogType"> & {
  actions?: readonly PageAction[];
  layout?: RouteLayout;
  sections?: readonly PageSection[];
  ogType?: "article" | "website";
}): PageDefinition => ({
  ...definition,
  feature,
  actions,
  layout,
  sections,
  ogType,
});
