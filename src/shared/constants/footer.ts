import { ISMS_URL } from "./common.ts";

export const FooterData = {
  pc: {
    pageTop: {
      src: "/footer/image_page_top.webp",
      width: 220,
      height: 50,
      alt: "page top",
    },
    commonLinks: [
      {
        path: "/guide/freelance-start-guide/",
        text: "フリーランススタートガイド",
        dataClickLabel: "フッター_フリーランススタートガイド",
      },
      {
        path: "/achievement/interview/list/",
        text: "ご利用者インタビュー",
        dataClickLabel: "フッター_ご利用者インタビュー",
      },
      {
        path: "/word/",
        text: "おすすめキーワード",
        dataClickLabel: "フッター_おすすめキーワード",
      },
      {
        path: "/project/search/",
        text: "案件一覧",
        dataClickLabel: "フッター_案件一覧",
      },
      {
        path: "/",
        text: "フリーランスエンジニアの求人・案件",
        dataClickLabel: "フッター_フリーランスエンジニアの求人・案件",
      },
      {
        path: "/service/pickup/",
        text: "企業紹介ファイル",
        dataClickLabel: "フッター_企業紹介ファイル",
      },
      {
        path: "https://levtech.co.jp/aboutus/company/",
        text: "運営会社",
        target: "_blank",
        isBrand: false,
        dataClickLabel: "フッター_運営会社",
      },
      {
        path: "/legal/",
        text: "利用規約",
        target: "_blank",
        isBrand: true,
        dataClickLabel: "フッター_利用規約",
      },
      {
        path: "/help/",
        text: "ヘルプ",
        dataClickLabel: "フッター_ヘルプ",
      },
      {
        path: "/sitemap/",
        text: "サイトマップ",
        dataClickLabel: "フッター_サイトマップ",
      },
      {
        path: "/contact/recruit/freelance?sip=o06600_187",
        text: "フリーランスをお探しの企業様へ",
        target: "_blank",
        isBrand: true,
        dataClickLabel: "PC_フリーランス_ToB導線_フッター_フリーランスをお探しの企業様へ",
      },
      {
        path: "/contact/documents/servicefreelance?sip=o06600_187",
        text: "法人向けの資料請求",
        target: "_blank",
        isBrand: true,
        dataClickLabel: "PC_フリーランス_ToB導線_フッター_法人向けの資料請求",
      },
      {
        path: "/contact/business?sip=o06600_187",
        text: "法人向けのお問い合わせ",
        target: "_blank",
        isBrand: true,
        dataClickLabel: "PC_フリーランス_ToB導線_フッター_法人向けのお問い合わせ",
      },
      {
        path: "/contact/private",
        text: "個人様のお問い合わせ",
        target: "_blank",
        isBrand: true,
        dataClickLabel: "フッター_個人様のお問い合わせ",
      },
      {
        path: "/service/platform/",
        text: "登録者限定機能について",
        dataClickLabel: "フッター_登録者限定機能について",
      },
      {
        path: "/friend/",
        text: "ご友人紹介",
        target: "_blank",
        dataClickLabel: "フッター_ご友人紹介",
      },
      {
        path: "https://leverages.jp/privacypolicy/",
        text: "レバレジーズグループ・プライバシーポリシー",
        target: "_blank",
        dataClickLabel: "フッター_レバレジーズグループ・プライバシーポリシー",
      },
    ],
    projectLinksTitle: "おすすめの求人・案件一覧",
    projectLinks: [
      {
        path: "/project/skill-3/",
        text: "Javaの求人・案件",
        dataClickLabel: "フッター案件一覧_Javaの求人・案件",
      },
      {
        path: "/project/skill-5/",
        text: "PHPの求人・案件",
        dataClickLabel: "フッター案件一覧_PHPの求人・案件",
      },
      {
        path: "/project/skill-7/",
        text: "Pythonの求人・案件",
        dataClickLabel: "フッター案件一覧_Pythonの求人・案件",
      },
      {
        path: "/project/skill-8/",
        text: "Rubyの求人・案件",
        dataClickLabel: "フッター案件一覧_Rubyの求人・案件",
      },
      {
        path: "/project/cld-1/",
        text: "AWSの求人・案件",
        dataClickLabel: "フッター案件一覧_AWSの求人・案件",
      },
      {
        path: "/project/skill-22/",
        text: "COBOLの求人・案件",
        dataClickLabel: "フッター案件一覧_COBOLの求人・案件",
      },
      {
        path: "/project/skill-37/",
        text: "VBAの求人・案件",
        dataClickLabel: "フッター案件一覧_VBAの求人・案件",
      },
      {
        path: "/project/skill-11/",
        text: "C#の求人・案件",
        dataClickLabel: "フッター案件一覧_C#の求人・案件",
      },
      {
        path: "/project/skill-4/",
        text: "JavaScriptの求人・案件",
        dataClickLabel: "フッター案件一覧_JavaScriptの求人・案件",
      },
      {
        path: "/project/skill-49/",
        text: "Swiftの求人・案件",
        dataClickLabel: "フッター案件一覧_Swiftの求人・案件",
      },
      {
        path: "/project/skill-1/",
        text: "C++の求人・案件",
        dataClickLabel: "フッター案件一覧_C++の求人・案件",
      },
      {
        path: "/project/fw-4/",
        text: "Railsの求人・案件",
        dataClickLabel: "フッター案件一覧_Railsの求人・案件",
      },
    ],
    ismsLogoUrl: ISMS_URL,
    ismsLogo: {
      src: "/certification/isms_logo.webp",
      width: 127,
      height: 75,
      alt: "ISMS認証マーク",
    },
    footerLogo: {
      path: "/",
      rel: "nofollow",
      target: "_blank",
      logo: {
        src: "/common/logo_lt.svg",
        width: 160,
        height: 32,
        alt: "Levtech",
      },
    },
  },
  sp: {
    projectLinkTitle: "案件検索",
    projectLinkInfos: [
      {
        title: "スキル",
        projectLinks: [
          {
            path: "/project/skill-3/",
            text: "Java",
            dataClickLabel: "フッター案件検索_Java",
          },
          {
            path: "/project/skill-5/",
            text: "PHP",
            dataClickLabel: "フッター案件検索_PHP",
          },
          {
            path: "/project/skill-7/",
            text: "Python",
            dataClickLabel: "フッター案件検索_Python",
          },
          {
            path: "/project/skill-4/",
            text: "JavaScript",
            dataClickLabel: "フッター案件検索_JavaScript",
          },
          {
            path: "/project/skill-8/",
            text: "Ruby",
            dataClickLabel: "フッター案件検索_Ruby",
          },
          {
            path: "/project/skill-11/",
            text: "C#",
            dataClickLabel: "フッター案件検索_C#",
          },
          {
            path: "/project/skill-10/",
            text: "Go",
            dataClickLabel: "フッター案件検索_Go",
          },
        ],
      },
      {
        title: "職種・ポジション",
        projectLinks: [
          {
            path: "/project/pos-3/",
            text: "プログラマー(PG)",
            dataClickLabel: "フッター案件検索_プログラマー(PG)",
          },
          {
            path: "/project/occ-43/",
            text: "プロジェクトマネージャー(PM)",
            dataClickLabel: "フッター案件検索_プロジェクトマネージャー(PM)",
          },
          {
            path: "/project/occ-6/",
            text: "フロントエンドエンジニア",
            dataClickLabel: "フッター案件検索_フロントエンドエンジニア",
          },
          {
            path: "/project/pos-1/",
            text: "SE(システムエンジニア)",
            dataClickLabel: "フッター案件検索_SE(システムエンジニア)",
          },
          {
            path: "/project/occ-4/",
            text: "インフラエンジニア",
            dataClickLabel: "フッター案件検索_インフラエンジニア",
          },
          {
            path: "/project/occ-3/",
            text: "ネットワークエンジニア",
            dataClickLabel: "フッター案件検索_ネットワークエンジニア",
          },
          {
            path: "/project/occ-45/",
            text: "PMO",
            dataClickLabel: "フッター案件検索_PMO",
          },
        ],
      },
      {
        title: "案件特徴",
        projectLinks: [
          {
            path: "/project/search/?order=2&sala=6",
            text: "高単価",
            dataClickLabel: "フッター案件検索_高単価",
          },
          {
            path: "/project/fit-9/",
            text: "短期案件",
            dataClickLabel: "フッター案件検索_短期案件",
          },
          {
            path: "/project/fit-13/",
            text: "実務経験が浅い方OK",
            dataClickLabel: "フッター案件検索_実務経験が浅い方OK",
          },
        ],
      },
      {
        title: "エリア",
        projectLinks: [
          {
            path: "/project/district-1/",
            text: "東京都(23区)",
            dataClickLabel: "フッター案件検索_東京都(23区)",
          },
          {
            path: "/project/district-2/",
            text: "東京都(その他)",
            dataClickLabel: "フッター案件検索_東京都(その他)",
          },
          {
            path: "/project/pref-27/",
            text: "大阪",
            dataClickLabel: "フッター案件検索_大阪",
          },
          {
            path: "/project/pref-40/",
            text: "福岡",
            dataClickLabel: "フッター案件検索_福岡",
          },
          {
            path: "/project/pref-23/",
            text: "愛知",
            dataClickLabel: "フッター案件検索_愛知",
          },
        ],
      },
    ] as const,
    projectLinkMore: {
      path: "/project/search/",
      text: "フリーランス案件一覧を見る",
      dataClickLabel: "フッター案件検索_フリーランス案件一覧を見る",
    },
    ismsLogoUrl: ISMS_URL,
    ismsLogo: {
      src: "/certification/isms_logo.webp",
      width: 127,
      height: 75,
      alt: "ISMS認証マーク",
    },
    bottomLinks: [
      {
        path: "/",
        text: "フリーランスエンジニアの求人・案件",
        dataClickLabel: "フッター_フリーランスエンジニアの求人・案件",
      },
      {
        path: "/word/",
        text: "オススメキーワード",
        dataClickLabel: "フッター_オススメキーワード",
      },
      {
        path: "/sitemap/",
        text: "サイトマップ",
        dataClickLabel: "フッター_サイトマップ",
      },
      {
        path: "/help/",
        text: "ヘルプ",
        dataClickLabel: "フッター_ヘルプ",
      },
      {
        path: "https://levtech.co.jp/aboutus/company/",
        text: "運営会社",
        target: "_blank",
        isBrand: false,
        dataClickLabel: "フッター_運営会社",
      },
      {
        path: "/legal/",
        text: "利用規約",
        target: "_blank",
        isBrand: true,
        dataClickLabel: "フッター_利用規約",
      },
      {
        path: "/contact/private",
        text: "個人様のお問い合わせ",
        target: "_blank",
        isBrand: true,
        dataClickLabel: "フッター_個人様のお問い合わせ",
      },
      {
        path: "https://leverages.jp/privacypolicy/",
        text: "レバレジーズグループ・プライバシーポリシー",
        target: "_blank",
        isBrand: false,
        dataClickLabel: "フッター_レバレジーズグループ・プライバシーポリシー",
      },
    ],
  },
  serviceLinks: {
    title: "レバレジーズグループ関連サイト一覧",
    itemList: [
      {
        urlKey: "LT_URL",
        text: "ITの仕事探しはレバテック",
        dataClickLabel: null,
      },
      {
        urlKey: "LTCR_URL",
        text: "クリエイターの案件探しはレバテッククリエイター",
        dataClickLabel: "フッター関連サービス_WEBクリエイター専門サービス",
      },
      {
        urlKey: "LT_SERVICE_F",
        text: "ITの仕事探しはレバテック（フリーランス向けサービス紹介）",
        dataClickLabel: null,
      },
      {
        urlKey: "LT_SERVICE_C",
        text: "ITの仕事探しはレバテック（正社員転職サービス紹介）",
        dataClickLabel: null,
      },
      {
        urlKey: "LTD_URL",
        text: "IT転職スカウトならレバテックダイレクト",
        dataClickLabel: "フッター関連サービス_スカウト機能付き求人メディア",
      },
      {
        urlKey: "LTC_URL",
        text: "IT転職ならレバテックキャリア",
        dataClickLabel: "フッター関連サービス_エンジニア転職サイト",
      },
      {
        urlKey: "LTR_URL",
        text: "ITエンジニア就活ならレバテックルーキー",
        dataClickLabel: "フッター関連サービス_ITエンジニア向け新卒就活支援サービス",
      },
      {
        urlKey: "LTP_URL",
        text: "フリーランス活動をサポートするレバテックプラットフォーム",
        dataClickLabel: null,
      },
      {
        urlKey: "F_HUB",
        text: "フリーランスの案件探しならフリーランスHub",
        dataClickLabel: null,
      },
      {
        urlKey: "TT_URL",
        text: "プログラミング特化のQAサイトならテラテイル",
        dataClickLabel: "フッター関連サービス_ITエンジニア特化型Q",
      },
      {
        urlKey: "LV_CLI",
        text: "オンライン診療ならレバクリ",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_WELL",
        text: "医療・ヘルスケアの求人・転職サービスならレバウェル",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_WELL_KAIGO",
        text: "介護職の転職・派遣サービスならレバウェル介護",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_WELL_KANGO",
        text: "看護師の転職・派遣サービスならレバウェル看護",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_WELL_HOIKUSHI",
        text: "保育士の転職支援サービスならレバウェル保育士",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_WELL_IRYOGISHI",
        text: "医療技師の転職支援サービスならレバウェル医療技師",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_WELL_REHA",
        text: "リハビリ職の転職支援サービスならレバウェルリハビリ",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_WELL_EIYOUSHI",
        text: "栄養士の転職支援サービスならレバウェル栄養士",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_WELL_ISHI",
        text: "医師の転職支援サービスならレバウェル医師",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_WELL_YAKUZAISHI",
        text: "薬剤師の転職支援サービスならレバウェル薬剤師",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_MEDICARE",
        text: "医療・ヘルスケア業界の課題解決支援ならレバウェル株式会社",
        dataClickLabel: null,
      },
      {
        urlKey: "MIKARU",
        text: "医療看護介護のお仕事探しならmikaru",
        dataClickLabel: null,
      },
      {
        urlKey: "LC_MEX",
        text: "メキシコでのお仕事探しはLeverages Career Mexico",
        dataClickLabel: null,
      },
      {
        urlKey: "LC_US",
        text: "アメリカでのお仕事探しはLeverages Career U.S.",
        dataClickLabel: null,
      },
      {
        urlKey: "KIKOKUGO",
        text: "留学生が日本で仕事を探すなら帰国GO.com",
        dataClickLabel: null,
      },
      {
        urlKey: "CAREER_TICKET",
        text: "就活・転職支援サービスならキャリアチケット",
        dataClickLabel: null,
      },
      {
        urlKey: "CAREER_TICKET_AGENT",
        text: "新卒就活エージェントならキャリアチケット就職",
        dataClickLabel: null,
      },
      {
        urlKey: "CAREER_TICKET_CAFE",
        text: "新卒就活無料コミュニティならキャリアチケットカフェ",
        dataClickLabel: null,
      },
      {
        urlKey: "CAREER_TICKET_SCOUT",
        text: "新卒就活スカウトならキャリアチケット就職スカウト",
        dataClickLabel: null,
      },
      {
        urlKey: "HIGH_CAREER_TICKET_CHANGE",
        text: "若手ハイキャリアの仕事探しはキャリアチケット転職",
        dataClickLabel: null,
      },
      {
        urlKey: "HATARACTIVE",
        text: "フリーター・既卒・未経験の就職・再就職ならハタラクティブ",
        dataClickLabel: null,
      },
      {
        urlKey: "HATARACTIVE_PLUS",
        text: "未経験・若手の仕事探しメディア／ハタラクティブ プラス",
        dataClickLabel: null,
      },
      {
        urlKey: "WORKLEAR",
        text: "障がい者雇用ならワークリア",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_MA",
        text: "M&A支援ならレバレジーズM&Aアドバイザリー",
        dataClickLabel: null,
      },
      {
        urlKey: "ONE_CONNE",
        text: "らくらく入退院支援システムならわんコネ",
        dataClickLabel: null,
      },
      {
        urlKey: "NALYSYS_MOTIVATION",
        text: "AI面接ならNALYSYS",
        dataClickLabel: null,
      },
      {
        urlKey: "NALYSYS_LAB",
        text: "人と組織のお悩み解決ならNALYSYS Lab.",
        dataClickLabel: null,
      },
      {
        urlKey: "AGILE_EFFECT",
        text: "アジャイル開発ならagile effect",
        dataClickLabel: null,
      },
      {
        urlKey: "REMOPIA",
        text: "業務可視化はremopia",
        dataClickLabel: null,
      },
      {
        urlKey: "LIGHTHOUSE",
        text: "アメリカの生活情報＆観光情報はLighthouse",
        dataClickLabel: null,
      },
      {
        urlKey: "MEDERI_PILL",
        text: "オンラインピル診療ならメデリピル",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_GLOBAL",
        text: "外国人採用ならLeverages Global",
        dataClickLabel: null,
      },
      {
        urlKey: "FACT_BOARD",
        text: "企業研究・選考対策ならFactBoard(ファクトボード)",
        dataClickLabel: null,
      },
      {
        urlKey: "FNC",
        text: "外国人派遣ならFNC",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_JOB",
        text: "ドライバー・施工管理技士の転職ならレバジョブ",
        dataClickLabel: null,
      },
      {
        urlKey: "LV_WELL_HOIKUSHI_INFO",
        text: "レバウェル保育士 保育士向けお役立ち情報",
        dataClickLabel: null,
      },
    ],
  },
};
