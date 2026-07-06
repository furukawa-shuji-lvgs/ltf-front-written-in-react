export interface HeaderSpImage {
  src: string;
  width: number;
  height: number;
  alt?: string;
}

export interface HeaderSpNavButton {
  icon: HeaderSpImage;
  href: string | null;
  target: string;
  rel: string;
  text: string;
  isCta: boolean;
  isMenu: boolean;
  dataClickLabel: string;
}

export interface HeaderSpMenuLink {
  href: string;
  text: string;
  target: string;
  dataClickLabel: string;
  logo: HeaderSpImage | null;
}

export interface HeaderSpCommonMenu {
  title: string;
  links: HeaderSpMenuLink[];
}

/** Server Component 側で URL 解決済みの HeaderSp 表示データ */
export interface HeaderSpViewData {
  logo: {
    href: string;
    dataClickLabel: string;
    image: HeaderSpImage;
  };
  leftButtons: HeaderSpNavButton[];
  rightButtons: HeaderSpNavButton[];
  navHead: {
    logo: {
      href: string;
      dataClickLabel: string;
      image: HeaderSpImage;
    };
    register: {
      href: string;
      text: string;
      dataClickLabel: string;
    };
    close: {
      text: string;
      dataClickLabel: string;
    };
  };
  projectMenu: {
    title: string;
    category: {
      title: string;
      links: { href: string; text: string; dataClickLabel: string }[];
      cta: { href: string; text: string; dataClickLabel: string };
    };
    link: { href: string; text: string; dataClickLabel: string };
  };
  serviceMenu: HeaderSpCommonMenu;
  usefulMenu: HeaderSpCommonMenu;
  companyLink: {
    href: string;
    text: string;
    logo: HeaderSpImage;
    dataClickLabel: string;
  };
  login: {
    href: string;
    text: string;
    dataClickLabel: string;
  };
}
