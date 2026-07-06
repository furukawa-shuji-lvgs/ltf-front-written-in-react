import { HeaderData } from "@shared/constants/header.ts";
import { LtServices } from "@shared/constants/ltServices.ts";
import { imageUrl } from "@shared/lib/image.ts";
import { HeaderPcView } from "./HeaderPcView.tsx";
import type { CommonNavData, HeaderPcViewData } from "./types.ts";

export interface HeaderPcProps {
  h1: string;
  isFixed?: boolean;
  isSticky?: boolean;
  size?: "-layout-l" | "";
  isP?: boolean;
}

const headerData = HeaderData.pc;

const buildViewData = (): HeaderPcViewData => {
  const projectNavLink = headerData.navLinks.find((link) => link.menuKey === "project");
  if (!(projectNavLink && "categories" in projectNavLink.dropdown)) {
    throw new Error("HeaderData.pc.navLinks に project メニューが定義されていません");
  }

  const commonNavs: CommonNavData[] = headerData.navLinks
    .filter((link) => link.menuKey !== "project")
    .map((link) => ({
      menuKey: link.menuKey as CommonNavData["menuKey"],
      name: link.name,
      dropdownHeaderName:
        ("dropdownHeaderName" in link ? link.dropdownHeaderName : undefined) ?? link.name,
      path: link.path,
      dataClickLabel: link.dataClickLabel,
      links: ("links" in link.dropdown ? link.dropdown.links : []).map((dropdownLink) => ({
        href: dropdownLink.isBrand
          ? new URL(dropdownLink.path, LtServices.LT_URL).href
          : dropdownLink.path,
        text: dropdownLink.text,
        target: dropdownLink.target,
        dataClickLabel: dropdownLink.dataClickLabel,
        icon: dropdownLink.icon,
      })),
    }));

  return {
    headerInfoLinks: headerData.headerInfoLinks.map((link) => ({
      text: link.text,
      href: new URL(link.isCareer ? LtServices.LTC_URL : LtServices.LTCR_URL).href,
    })),
    logo: {
      href: headerData.logo.link,
      dataClickLabel: headerData.logo.dataClickLabel,
      image: { ...headerData.logo.image, src: imageUrl(headerData.logo.image.src) },
    },
    projectNav: {
      name: projectNavLink.name,
      path: projectNavLink.path,
      dataClickLabel: projectNavLink.dataClickLabel,
      dropdown: {
        title: projectNavLink.dropdown.title,
        categories: projectNavLink.dropdown.categories.map((category) => ({
          title: {
            icon: { ...category.title.icon, src: imageUrl(category.title.icon.src) },
            text: category.title.text,
          },
          links: category.links.map((link) => ({
            href: link.path,
            text: link.text,
            dataClickLabel: link.dataClickLabel,
          })),
        })),
        searchLinks: {
          refinement: {
            href: projectNavLink.dropdown.searchLinks.refinement.path,
            text: projectNavLink.dropdown.searchLinks.refinement.text,
            dataClickLabel: projectNavLink.dropdown.searchLinks.refinement.dataClickLabel,
          },
          ai: {
            href: projectNavLink.dropdown.searchLinks.ai.path,
            text: projectNavLink.dropdown.searchLinks.ai.text,
            dataClickLabel: projectNavLink.dropdown.searchLinks.ai.dataClickLabel,
          },
        },
      },
    },
    commonNavs,
    recruit: {
      href: new URL(headerData.recruitButton.path, LtServices.LT_URL).href,
      text: headerData.recruitTextButton.text,
      target: headerData.recruitButton.target,
    },
    login: {
      href: `${new URL(headerData.login.link, LtServices.LTP_URL).href}?inflowMedia=ltf`,
      text: headerData.login.text,
      icon: { ...headerData.login.icon, src: imageUrl(headerData.login.icon.src) },
      dataClickLabel: headerData.login.dataClickLabel,
    },
    register: {
      href: headerData.registerButton.path,
      lineLeft: headerData.registerButton.lineLeft,
      lineRight: headerData.registerButton.lineRight,
      prefix: headerData.registerButton.prefix,
      text: headerData.registerButton.text,
      dataClickLabel: headerData.registerButton.dataClickLabel.common,
    },
  };
};

const headerPcViewData = buildViewData();

export const HeaderPc = ({
  h1,
  isFixed = false,
  isSticky = false,
  size = "",
  isP = false,
}: HeaderPcProps) => (
  <HeaderPcView
    h1={h1}
    isFixed={isFixed}
    isSticky={isSticky}
    isLayoutL={size === "-layout-l"}
    isP={isP}
    data={headerPcViewData}
  />
);
