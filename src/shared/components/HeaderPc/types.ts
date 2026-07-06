export interface HeaderImage {
  src: string;
  width: number;
  height: number;
  alt?: string;
}

export interface HeaderLink {
  href: string;
  text: string;
  dataClickLabel: string;
}

export interface ProjectDropdownData {
  title: string;
  categories: {
    title: {
      icon: HeaderImage;
      text: string;
    };
    links: HeaderLink[];
  }[];
  searchLinks: {
    refinement: HeaderLink;
    ai: HeaderLink;
  };
}

export interface CommonDropdownLink extends HeaderLink {
  target: string;
  icon: HeaderImage | null;
}

export interface CommonNavData {
  menuKey: "service" | "guide";
  name: string;
  dropdownHeaderName: string;
  path: string;
  dataClickLabel: string;
  links: CommonDropdownLink[];
}

/** Server Component 側で URL 解決済みの HeaderPc 表示データ */
export interface HeaderPcViewData {
  headerInfoLinks: { text: string; href: string }[];
  logo: {
    href: string;
    dataClickLabel: string;
    image: HeaderImage;
  };
  projectNav: {
    name: string;
    path: string;
    dataClickLabel: string;
    dropdown: ProjectDropdownData;
  };
  commonNavs: CommonNavData[];
  recruit: {
    href: string;
    text: string;
    target: string;
  };
  login: {
    href: string;
    text: string;
    icon: HeaderImage;
    dataClickLabel: string;
  };
  register: {
    href: string;
    lineLeft: string;
    lineRight: string;
    prefix: string;
    text: string;
    dataClickLabel: string;
  };
}
