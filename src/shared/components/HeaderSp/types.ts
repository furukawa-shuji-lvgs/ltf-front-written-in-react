export interface HeaderSpImage {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt?: string;
}

export interface HeaderSpNavButton {
  readonly icon: HeaderSpImage;
  readonly href: string | null;
  readonly target: string;
  readonly rel: string;
  readonly text: string;
  readonly isCta: boolean;
  readonly isMenu: boolean;
  readonly dataClickLabel: string;
}

export interface HeaderSpMenuLink {
  readonly href: string;
  readonly text: string;
  readonly target: string;
  readonly dataClickLabel: string;
  readonly logo: HeaderSpImage | null;
}

export interface HeaderSpCommonMenu {
  readonly title: string;
  readonly links: readonly HeaderSpMenuLink[];
}

/** Server Component 側で URL 解決済みの HeaderSp 表示データ */
export interface HeaderSpViewData {
  readonly logo: {
    readonly href: string;
    readonly dataClickLabel: string;
    readonly image: HeaderSpImage;
  };
  readonly leftButtons: readonly HeaderSpNavButton[];
  readonly rightButtons: readonly HeaderSpNavButton[];
  readonly navHead: {
    readonly logo: {
      readonly href: string;
      readonly dataClickLabel: string;
      readonly image: HeaderSpImage;
    };
    readonly register: {
      readonly href: string;
      readonly text: string;
      readonly dataClickLabel: string;
    };
    readonly close: {
      readonly text: string;
      readonly dataClickLabel: string;
    };
  };
  readonly projectMenu: {
    readonly title: string;
    readonly category: {
      readonly title: string;
      readonly links: readonly {
        readonly href: string;
        readonly text: string;
        readonly dataClickLabel: string;
      }[];
      readonly cta: {
        readonly href: string;
        readonly text: string;
        readonly dataClickLabel: string;
      };
    };
    readonly link: {
      readonly href: string;
      readonly text: string;
      readonly dataClickLabel: string;
    };
  };
  readonly serviceMenu: HeaderSpCommonMenu;
  readonly usefulMenu: HeaderSpCommonMenu;
  readonly companyLink: {
    readonly href: string;
    readonly text: string;
    readonly logo: HeaderSpImage;
    readonly dataClickLabel: string;
  };
  readonly login: {
    readonly href: string;
    readonly text: string;
    readonly dataClickLabel: string;
  };
}
