import { ProjectContractType, ProjectPayType } from "./enum.ts";

// 移行メモ: 移行元は @lv-levtech/volt-tokens の LtfPrimaryDefault を import していた。
// ltf-react では shared/styles/volt-tokens.scss の $ltf-primary-default と同じ値をTS側にも明示する。
const LtfPrimaryDefault = "#3C7DA2";

// Google Map
export const GOOGLE_MAP_API = {
  URI: "https://www.google.com/maps/embed/v1/place",
  KEY: "AIzaSyDaPKgia5XIS_BT-oMq2I2VA0WcoKYNA50",
};

export const GoogleMap = {
  tokyo:
    GOOGLE_MAP_API.URI +
    "?q=%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%B8%8B%E8%B0%B7%E5%8C%BA%E6%B8%8B%E8%B0%B72-24-12&key=" +
    GOOGLE_MAP_API.KEY,
  nagoya:
    GOOGLE_MAP_API.URI +
    "?q=%E6%84%9B%E7%9F%A5%E7%9C%8C%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%B8%82%E4%B8%AD%E5%8C%BA%E6%A0%843-3-21+%E3%82%BB%E3%83%B3%E3%83%88%E3%83%A9%E3%82%A4%E3%82%BA%E6%A0%84&key=" +
    GOOGLE_MAP_API.KEY,
  osaka:
    GOOGLE_MAP_API.URI +
    "?q=%E5%A4%A7%E9%98%AA%E5%BA%9C%E5%A4%A7%E9%98%AA%E5%B8%82%E5%8C%97%E5%8C%BA%E5%A0%82%E5%B3%B61-5-30%20%E5%A0%82%E5%B3%B6%E3%83%97%E3%83%A9%E3%82%B6%E3%83%93%E3%83%AB&key=" +
    GOOGLE_MAP_API.KEY,
  fukuoka:
    GOOGLE_MAP_API.URI +
    "?q=%E7%A6%8F%E5%B2%A1%E7%9C%8C%E7%A6%8F%E5%B2%A1%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%A4%A9%E7%A5%9E1-1-1%20%E3%82%A2%E3%82%AF%E3%83%AD%E3%82%B9%E7%A6%8F%E5%B2%A1&key=" +
    GOOGLE_MAP_API.KEY,
};

export const HEAD_DATA = {
  ogp: {
    type: { website: "website", article: "article" },
  },
};

export const ServiceColors = {
  blackDark: "#000000",
  black: "#2d2d2d",
  white: "#ffffff",
  brand: LtfPrimaryDefault,
  gray: "#666666",
  grayLight: "#999999",
};

export const LtfLogo = {
  src: "/common/ltf/logo_ltf.svg",
  alt: "レバテックフリーランス",
};

export const ISMS_URL = "https://isms.jp/lst/ind/CR_IR0266.html";

export const PayTypeText = {
  [ProjectPayType.PAY_TYPE_UNSPECIFIED]: "",
  [ProjectPayType.SETTLEMENT]: "月",
  [ProjectPayType.FIXED]: "月",
  [ProjectPayType.HOURLY_WAGE]: "時",
  [ProjectPayType.NEGOTIATIONS]: "月",
} as { [key: number]: string };

export const ContractTypeText = {
  [ProjectContractType.CONTRACT_TYPE_UNKNOWN]: "",
  [ProjectContractType.SUBCONTRACTOR]: "業務委託",
  [ProjectContractType.TEMPORARY]: "派遣",
  [ProjectContractType.EMPLOYMENT_PLACEMENT_DISPATCHING]: "契約社員",
  [ProjectContractType.DIRECT_EMPLOYMENT]: "正社員",
} as { [key: number]: string };

export const ProjectCardData = {
  link: "/project/detail/",
  nameSuffix: {
    pc: "の求人・案件",
    sp: "のエンジニア求人・案件",
  },
  new: "New",
  remote: "リモートOK",
  longTerm: "長期案件",
  transactionResult: "稼働実績あり",
  payType: PayTypeText,
  contractType: ContractTypeText,
  yen: "円",
};

export const TooltipIcon = {
  src: "/common/icon_question.svg",
  width: 16,
  height: 16,
  alt: "",
};

export const CarouselBanners = {
  sp: [
    {
      img: {
        src: "/common/sp/image_banner_bg_work_style.webp",
        width: "153",
        height: "120",
        alt: "あなたに合う働き方診断",
      },
      href: "/guide/detail/1679",
      dataClickLabel: "バナー_働き方診断_",
    },
    {
      img: {
        src: "/common/sp/image_banner_bg_market_price.webp",
        width: "153",
        height: "120",
        alt: "人気スキルの単価診断",
      },
      href: "/service/assess/",
      dataClickLabel: "バナー_単価診断_",
    },
    {
      img: {
        src: "/common/sp/image_banner_bg_risk.webp",
        width: "153",
        height: "120",
        alt: "フリーランスのリスク回避力診断",
      },
      href: "/guide/detail/1841/",
      dataClickLabel: "バナー_リスク回避力1_",
    },
    {
      img: {
        src: "/common/sp/image_banner_bg_comparison.webp",
        width: "153",
        height: "120",
        alt: "フリーランス×会社員 徹底比較表",
      },
      href: "/guide/detail/1675/",
      dataClickLabel: "バナー_フリー×会社員比較表_",
    },
    {
      img: {
        src: "/common/sp/image_banner_bg_scout.webp",
        width: "153",
        height: "120",
        alt: "フリーランススカウト",
      },
      href: "/service/platform/#scoutUtilization",
      dataClickLabel: "LTPバナー_スカウト_",
    },
    {
      img: {
        src: "/common/sp/image_banner_bg_dashboard.webp",
        width: "153",
        height: "120",
        alt: "市場分析ダッシュボード",
      },
      href: "/service/platform/#analysisDashboard",
      dataClickLabel: "LTPバナー_市場分析ダッシュボード_",
    },
  ],
  pc: [
    {
      img: {
        src: "/common/image_banner_bg_work_style.webp",
        width: "192",
        height: "120",
        alt: "あなたに合う働き方診断",
      },
      href: "/guide/detail/1679",
      dataClickLabel: "バナー_働き方診断_",
    },
    {
      img: {
        src: "/common/image_banner_bg_market_price.webp",
        width: "192",
        height: "120",
        alt: "人気スキルの単価診断",
      },
      href: "/service/assess/",
      dataClickLabel: "バナー_単価診断_",
    },
    {
      img: {
        src: "/common/image_banner_bg_risk.webp",
        width: "192",
        height: "120",
        alt: "フリーランスのリスク回避力診断",
      },
      href: "/guide/detail/1841/",
      dataClickLabel: "バナー_リスク回避力1_",
    },
    {
      img: {
        src: "/common/image_banner_bg_comparison.webp",
        width: "192",
        height: "120",
        alt: "フリーランス×会社員 徹底比較表",
      },
      href: "/guide/detail/1675/",
      dataClickLabel: "バナー_フリー×会社員比較表_",
    },
    {
      img: {
        src: "/common/image_banner_bg_scout.webp",
        width: "192",
        height: "120",
        alt: "フリーランススカウト",
      },
      href: "/service/platform/#scoutUtilization",
      dataClickLabel: "LTPバナー_スカウト_",
    },
    {
      img: {
        src: "/common/image_banner_bg_dashboard.webp",
        width: "192",
        height: "120",
        alt: "市場分析ダッシュボード",
      },
      href: "/service/platform/#analysisDashboard",
      dataClickLabel: "LTPバナー_市場分析ダッシュボード_",
    },
  ],
};

export const CarouselDataClickLabel = {
  top: "top",
  projectDetail: "詳細",
  projectSearch: "一覧",
  firstFreelance: "初フリー",
  prevButton: "カルーセルバナー_戻る",
  nextButton: "カルーセルバナー_進む",
};
