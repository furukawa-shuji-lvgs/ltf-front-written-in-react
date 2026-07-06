import { LegacyImage } from "@shared/components/LegacyImage/LegacyImage.tsx";
import { LoginInflowLink } from "@shared/components/LoginInflowLink/LoginInflowLink.tsx";
import Link from "next/link";
import styles from "./HeaderPc.module.scss";
import { HeaderPcMenuItem, HeaderPcMenuList } from "./HeaderPcMenuItem.tsx";
import { HeaderPcShellClient } from "./HeaderPcShellClient.tsx";
import type { CommonNavData, HeaderPcViewData, ProjectDropdownData } from "./types.ts";

interface HeaderPcViewProps {
  h1: string;
  isFixed: boolean;
  isSticky: boolean;
  isLayoutL: boolean;
  isP: boolean;
  data: HeaderPcViewData;
}

const ChevronRightIcon = ({ className }: { className?: string | undefined }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
  </svg>
);

const ProjectDropdown = ({
  dropdown,
  headerName,
}: {
  dropdown: ProjectDropdownData;
  headerName: string;
}) => (
  <div className={styles.projectDropdown}>
    <div className={styles.panel}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <p className={styles.title}>{headerName}</p>
          <div className={styles.arrowButtonWrapper}>
            <Link
              href="/project/search/"
              data-click-label={`${dropdown.title}_arrow`}
              className={styles.arrowButton}
            >
              <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.mainContent}>
        <p className={styles.title}>{dropdown.title}</p>
        <ul className={styles.categoryList}>
          {dropdown.categories.map((category) => (
            <li
              key={category.title.text}
              className={styles.categoryItem}
            >
              <p className={styles.title}>
                <LegacyImage
                  src={category.title.icon.src}
                  width={category.title.icon.width}
                  height={category.title.icon.height}
                  alt=""
                  className={styles.image}
                />
                <span className={styles.text}>{category.title.text}</span>
              </p>
              <ul className={styles.navLinks}>
                {category.links.map((link) => (
                  <li
                    key={link.text}
                    className={styles.item}
                  >
                    <Link
                      href={link.href}
                      data-click-label={link.dataClickLabel}
                      className={styles.link}
                    >
                      <span className={styles.text}>{link.text}</span>
                      <ChevronRightIcon className={styles.navArrow} />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className={styles.topLink}>
          <div className={styles.topLinkItem}>
            <Link
              href={dropdown.searchLinks.refinement.href}
              data-click-label={dropdown.searchLinks.refinement.dataClickLabel}
              className={styles.searchButton}
            >
              {dropdown.searchLinks.refinement.text}
            </Link>
          </div>
          <div className={styles.topLinkItem}>
            <Link
              href={dropdown.searchLinks.ai.href}
              data-click-label={dropdown.searchLinks.ai.dataClickLabel}
              className={styles.aiSearchButton}
            >
              <span>{dropdown.searchLinks.ai.text}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CommonDropdown = ({ nav }: { nav: CommonNavData }) => (
  <div className={styles.commonDropdown}>
    <div className={styles.panel}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <p className={styles.title}>{nav.dropdownHeaderName}</p>
          <div className={styles.arrowButtonWrapper}>
            <Link
              href={nav.path}
              data-click-label={`${nav.dropdownHeaderName}_arrow`}
              className={styles.arrowButton}
            >
              <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.mainContent}>
        <ul className={styles.navLinks}>
          {nav.links.map((link) => (
            <li
              key={link.text}
              className={styles.item}
            >
              <a
                href={link.href}
                target={link.target || undefined}
                data-click-label={link.dataClickLabel}
                className={styles.link}
              >
                {link.text}
                {link.icon && (
                  <LegacyImage
                    src={link.icon.src}
                    width={link.icon.width}
                    height={link.icon.height}
                    alt=""
                    className={styles.icon}
                  />
                )}
                <ChevronRightIcon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export const HeaderPcView = ({
  h1,
  isFixed,
  isSticky,
  isLayoutL,
  isP,
  data,
}: HeaderPcViewProps) => (
  <HeaderPcShellClient
    isFixed={isFixed}
    isSticky={isSticky}
    isLayoutL={isLayoutL}
    classNames={{
      baseHeader: styles.baseHeader ?? "",
      isFixed: styles.isFixed ?? "",
      isShow: styles.isShow ?? "",
      isSticky: styles.isSticky ?? "",
      layoutL: styles.layoutL ?? "",
    }}
  >
    {!isFixed && (
      <div className={styles.headerInfo}>
        <div className={`${styles.inner} ${isLayoutL ? styles.layoutL : ""}`}>
          {isP ? <p className={styles.title}>{h1}</p> : <h1 className={styles.title}>{h1}</h1>}
          <ul className={styles.linkList}>
            {data.headerInfoLinks.map((link) => (
              <li
                key={link.text}
                className={styles.item}
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
    <nav
      className={`${styles.headerNav} ${isLayoutL ? styles.layoutL : ""}`}
      data-testid={isFixed ? "header-pc-fixed-nav" : "header-pc-global-nav"}
    >
      <div className={styles.icon}>
        <Link
          href={data.logo.href}
          data-click-label={data.logo.dataClickLabel}
        >
          <LegacyImage
            src={data.logo.image.src}
            width={data.logo.image.width}
            height={data.logo.image.height}
            alt={data.logo.image.alt}
          />
        </Link>
      </div>
      <div className={styles.navGroup}>
        <HeaderPcMenuList>
          <HeaderPcMenuItem
            menuKey="project"
            href={data.projectNav.path}
            dataClickLabel={data.projectNav.dataClickLabel}
            label={data.projectNav.name}
            badge={
              <span className={styles.aiLabel}>
                <span className={styles.aiLabelText}>AI検索が新登場！</span>
                <span
                  className={styles.polygon}
                  aria-hidden="true"
                />
              </span>
            }
          >
            <ProjectDropdown
              dropdown={data.projectNav.dropdown}
              headerName={data.projectNav.name}
            />
          </HeaderPcMenuItem>
          {data.commonNavs.map((nav) => (
            <HeaderPcMenuItem
              key={nav.name}
              menuKey={nav.menuKey}
              href={nav.path}
              dataClickLabel={nav.dataClickLabel}
              label={nav.name}
            >
              <CommonDropdown nav={nav} />
            </HeaderPcMenuItem>
          ))}
        </HeaderPcMenuList>
        <span
          className={styles.border}
          aria-hidden="true"
        />
        <div className={styles.navButtons}>
          <a
            href={data.recruit.href}
            target={data.recruit.target || undefined}
            className={styles.anchor}
          >
            {data.recruit.text}
          </a>
          <LoginInflowLink
            href={data.login.href}
            data-click-label={data.login.dataClickLabel}
            className={styles.loginButton}
          >
            <LegacyImage
              src={data.login.icon.src}
              width={data.login.icon.width}
              height={data.login.icon.height}
              alt={data.login.icon.alt}
            />
            <p>{data.login.text}</p>
          </LoginInflowLink>
          <Link
            href={data.register.href}
            data-click-label={data.register.dataClickLabel}
            className={styles.registerButton}
          >
            <span className={styles.top}>
              <span>{data.register.lineLeft}</span>
              <span>{data.register.prefix}</span>
              <span>{data.register.lineRight}</span>
            </span>
            <span className={styles.registerText}>{data.register.text}</span>
          </Link>
        </div>
      </div>
    </nav>
  </HeaderPcShellClient>
);
