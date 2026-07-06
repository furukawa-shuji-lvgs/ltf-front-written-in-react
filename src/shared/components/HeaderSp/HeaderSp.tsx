import { HeaderData } from "@shared/constants/header.ts";
import { LtServices } from "@shared/constants/ltServices.ts";
import { imageUrl } from "@shared/lib/image.ts";
import { HeaderSpView } from "./HeaderSpView.tsx";
import type { HeaderSpNavButton, HeaderSpViewData } from "./types.ts";

export interface HeaderSpProps {
  isStatic?: boolean;
}

const headerData = HeaderData.sp;

type SourceNavButton =
  | (typeof headerData.globalNavLeftButtons)[number]
  | (typeof headerData.globalNavLRightButtons)[number];

const buildNavButton = (button: SourceNavButton): HeaderSpNavButton => ({
  icon: { ...button.icon, src: imageUrl(button.icon.src) },
  href: button.isBrand ? new URL(button.path ?? "", LtServices.LT_URL).href : button.path,
  target: button.target,
  rel: button.rel,
  text: button.text,
  isCta: button.variant === "-cta",
  isMenu: button.isMenu,
  dataClickLabel: button.dataClickLabel,
});

const buildViewData = (): HeaderSpViewData => {
  const globalNav = headerData.globalNav;
  const headButtons = headerData.globalNavLHeadButtons;

  const buildCommonMenu = (menu: typeof globalNav.serviceMenu) => ({
    title: menu.title,
    links: menu.links.map((link) => ({
      href: link.isBrand ? new URL(link.path, LtServices.LT_URL).href : link.path,
      text: link.text,
      target: link.target,
      dataClickLabel: link.dataClickLabel,
      logo: link.logo ? { ...link.logo, src: imageUrl(link.logo.src) } : null,
    })),
  });

  return {
    logo: {
      href: headerData.logo.link,
      dataClickLabel: headerData.logo.dataClickLabel,
      image: { ...headerData.logo.image, src: imageUrl(headerData.logo.image.src) },
    },
    leftButtons: headerData.globalNavLeftButtons.map(buildNavButton),
    rightButtons: headerData.globalNavLRightButtons.map(buildNavButton),
    navHead: {
      logo: {
        href: globalNav.head.logo.path,
        dataClickLabel: globalNav.head.logo.dataClickLabel,
        image: { ...globalNav.head.logo.image, src: imageUrl(globalNav.head.logo.image.src) },
      },
      register: {
        href: headButtons.register.href,
        text: headButtons.register.text,
        dataClickLabel: headButtons.register.dataClickLabel,
      },
      close: {
        text: headButtons.close.text,
        dataClickLabel: headButtons.close.dataClickLabel,
      },
    },
    projectMenu: {
      title: globalNav.projectMenu.title,
      category: {
        title: globalNav.projectMenu.category.title,
        links: globalNav.projectMenu.category.links.map((link) => ({
          href: link.path,
          text: link.text,
          dataClickLabel: link.dataClickLabel,
        })),
        cta: {
          href: globalNav.projectMenu.category.cta.path,
          text: globalNav.projectMenu.category.cta.text,
          dataClickLabel: globalNav.projectMenu.category.cta.dataClickLabel,
        },
      },
      link: {
        href: globalNav.projectMenu.link.path,
        text: globalNav.projectMenu.link.text,
        dataClickLabel: globalNav.projectMenu.link.dataClickLabel,
      },
    },
    serviceMenu: buildCommonMenu(globalNav.serviceMenu),
    usefulMenu: buildCommonMenu(globalNav.usefulMenu),
    companyLink: {
      href: new URL(globalNav.companyLink.path, LtServices.LT_URL).href,
      text: globalNav.companyLink.text,
      logo: { ...globalNav.companyLink.logo, src: imageUrl(globalNav.companyLink.logo.src) },
      dataClickLabel: globalNav.companyLink.dataClickLabel,
    },
    login: {
      href: `${new URL(globalNav.login.link, LtServices.LTP_URL).href}?inflowMedia=ltf`,
      text: globalNav.login.text,
      dataClickLabel: globalNav.login.dataClickLabel,
    },
  };
};

const headerSpViewData = buildViewData();

export const HeaderSp = ({ isStatic = false }: HeaderSpProps) => (
  <HeaderSpView
    isStatic={isStatic}
    data={headerSpViewData}
  />
);
