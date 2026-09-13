export interface HeaderImage {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt?: string;
}

export interface HeaderLink {
  readonly href: string;
  readonly text: string;
  readonly dataClickLabel: string;
}

export interface ProjectDropdownData {
  readonly title: string;
  readonly categories: readonly {
    readonly title: {
      readonly icon: HeaderImage;
      readonly text: string;
    };
    readonly links: readonly HeaderLink[];
  }[];
  readonly searchLinks: {
    readonly refinement: HeaderLink;
    readonly ai: HeaderLink;
  };
}

export interface CommonDropdownLink extends HeaderLink {
  readonly target: string;
  readonly icon: HeaderImage | null;
}

export interface CommonNavData {
  readonly menuKey: "service" | "guide";
  readonly name: string;
  readonly dropdownHeaderName: string;
  readonly path: string;
  readonly dataClickLabel: string;
  readonly links: readonly CommonDropdownLink[];
}

/** Server Component 側で URL 解決済みの HeaderPc 表示データ */
export interface HeaderPcViewData {
  readonly headerInfoLinks: readonly { readonly text: string; readonly href: string }[];
  readonly logo: {
    readonly href: string;
    readonly dataClickLabel: string;
    readonly image: HeaderImage;
  };
  readonly projectNav: {
    readonly name: string;
    readonly path: string;
    readonly dataClickLabel: string;
    readonly dropdown: ProjectDropdownData;
  };
  readonly commonNavs: readonly CommonNavData[];
  readonly recruit: {
    readonly href: string;
    readonly text: string;
    readonly target: string;
  };
  readonly login: {
    readonly href: string;
    readonly text: string;
    readonly icon: HeaderImage;
    readonly dataClickLabel: string;
  };
  readonly register: {
    readonly href: string;
    readonly lineLeft: string;
    readonly lineRight: string;
    readonly prefix: string;
    readonly text: string;
    readonly dataClickLabel: string;
  };
}
