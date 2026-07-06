export const HeaderData = {
  pc: {
    headerInfoLinks: [
      {
        text: "IT・Web求人/転職",
        isCareer: true,
      },
      {
        text: "フリーランスクリエイター案件",
        isCareer: false,
      },
    ],
    logo: {
      link: "/",
      dataClickLabel: "ヘッダーロゴ",
      largeImage: {
        src: "/common/ltf/logo_ltf.svg",
        width: 160,
        height: 41,
        alt: "レバテックフリーランス",
      },
      image: {
        src: "/common/ltf/logo_ltf.svg",
        width: 150,
        height: 38,
        alt: "レバテックフリーランス",
      },
      minImage: {
        src: "/common/ltf/logo_ltf.svg",
        width: 120,
        height: 30,
        alt: "レバテックフリーランス",
      },
    },
    navLinks: [
      {
        menuKey: "project" as const,
        name: "案件検索",
        path: "/project/search/",
        dataClickLabel: "ヘッダー_案件検索",
        dropdown: {
          title: "よく検索されるキーワード",
          categories: [
            {
              title: {
                icon: {
                  src: "/header/icon_code.svg",
                  width: 48,
                  height: 48,
                },
                text: "スキル",
              },
              links: [
                {
                  path: "/project/skill-3/",
                  text: "Java",
                  dataClickLabel: "ヘッダー案件検索_スキル_Java",
                },
                {
                  path: "/project/skill-5/",
                  text: "PHP",
                  dataClickLabel: "ヘッダー案件検索_スキル_PHP",
                },
                {
                  path: "/project/skill-7/",
                  text: "Python",
                  dataClickLabel: "ヘッダー案件検索_スキル_Python",
                },
                {
                  path: "/project/skill-4/",
                  text: "JavaScript",
                  dataClickLabel: "ヘッダー案件検索_スキル_JavaScript",
                },
                {
                  path: "/project/skill-8/",
                  text: "Ruby",
                  dataClickLabel: "ヘッダー案件検索_スキル_Ruby",
                },
                {
                  path: "/project/skill-11/",
                  text: "C#",
                  dataClickLabel: "ヘッダー案件検索_スキル_C#",
                },
                {
                  path: "/project/skill-10/",
                  text: "Go",
                  dataClickLabel: "ヘッダー案件検索_スキル_Go",
                },
              ],
            },
            {
              title: {
                icon: {
                  src: "/header/icon_person.svg",
                  width: 48,
                  height: 48,
                },
                text: "職種・ポジション",
              },
              links: [
                {
                  path: "/project/occ-4/",
                  text: "インフラ",
                  dataClickLabel: "ヘッダー案件検索_職種_インフラ",
                },
                {
                  path: "/project/occ-6/",
                  text: "フロントエンド",
                  dataClickLabel: "ヘッダー案件検索_職種_フロントエンド",
                },
                {
                  path: "/project/occ-3/",
                  text: "ネットワーク",
                  dataClickLabel: "ヘッダー案件検索_職種_ネットワーク",
                },
                {
                  path: "/project/pos-1/",
                  text: "SE",
                  dataClickLabel: "ヘッダー案件検索_職種_SE",
                },
                {
                  path: "/project/pos-3/",
                  text: "プログラマー",
                  dataClickLabel: "ヘッダー案件検索_職種_プログラマー",
                },
                {
                  path: "/project/occ-43/",
                  text: "PM",
                  dataClickLabel: "ヘッダー案件検索_職種_PM",
                },
                {
                  path: "/project/occ-45/",
                  text: "PMO",
                  dataClickLabel: "ヘッダー案件検索_職種_PMO",
                },
              ],
            },
            {
              title: {
                icon: {
                  src: "/header/icon_document.svg",
                  width: 48,
                  height: 48,
                },
                text: "案件特徴",
              },
              links: [
                {
                  path: "/project/remote/",
                  text: "在宅・リモート案件",
                  dataClickLabel: "ヘッダー案件検索_特徴_在宅・リモート案件",
                },
                {
                  path: "/project/search/?order=2&sala=6",
                  text: "高単価",
                  dataClickLabel: "ヘッダー案件検索_特徴_高単価",
                },
                {
                  path: "/project/fit-9/",
                  text: "短期案件",
                  dataClickLabel: "ヘッダー案件検索_特徴_短期案件",
                },
                {
                  path: "/project/fit-13/",
                  text: "実務経験浅い方OK",
                  dataClickLabel: "ヘッダー案件検索_特徴_実務経験浅い方OK",
                },
                {
                  path: "/project/sidejob/",
                  text: "副業・複業",
                  dataClickLabel: "ヘッダー案件検索_特徴_副業・複業",
                },
              ],
            },
            {
              title: {
                icon: {
                  src: "/header/icon_location.svg",
                  width: 48,
                  height: 48,
                },
                text: "エリア",
              },
              links: [
                {
                  path: "/project/pref-13/",
                  text: "東京都",
                  dataClickLabel: "ヘッダー案件検索_職種_東京都",
                },
                {
                  path: "/project/pref-27/",
                  text: "大阪",
                  dataClickLabel: "ヘッダー案件検索_職種_大阪",
                },
                {
                  path: "/project/pref-40/",
                  text: "福岡",
                  dataClickLabel: "ヘッダー案件検索_職種_福岡",
                },
                {
                  path: "/project/pref-23/",
                  text: "愛知",
                  dataClickLabel: "ヘッダー案件検索_職種_愛知",
                },
              ],
            },
          ],
          searchLinks: {
            refinement: {
              path: "/project/search/",
              text: "こだわり検索",
              dataClickLabel: "ヘッダー案件検索_こだわり検索",
            },
            ai: {
              path: "/project/search/?ui_tab=ai",
              text: "AI検索（β機能）",
              dataClickLabel: "ヘッダー案件検索_AI検索",
            },
          },
        },
      },
      {
        menuKey: "service" as const,
        name: "サービス紹介",
        dropdownHeaderName: "サービスについて",
        path: "/service/",
        dataClickLabel: "ヘッダー_サービス紹介",
        dropdown: {
          links: [
            {
              path: "/service/#flow",
              text: "ご利用の流れ",
              target: "",
              dataClickLabel: "ヘッダーサービス_ご利用の流れ",
              icon: null,
              isBrand: false,
            },
            {
              path: "/consultation/detail/2/",
              text: "個別相談会",
              target: "",
              dataClickLabel: "ヘッダーサービス_個別相談会",
              icon: null,
              isBrand: false,
            },
            {
              path: "/friend/",
              text: "ご友人紹介",
              target: "",
              dataClickLabel: "ヘッダーサービス_ご友人紹介",
              icon: null,
              isBrand: false,
            },
            {
              path: "/service/platform/",
              text: "登録者限定機能について",
              target: "",
              dataClickLabel: "ヘッダーサービス_登録者限定機能について",
              icon: null,
              isBrand: false,
            },
            {
              path: "/women/",
              text: "フリーランスキャリア応援パッケージ",
              target: "",
              dataClickLabel: "ヘッダーサービス_フリーランスキャリア応援パッケージ",
              icon: null,
              isBrand: false,
            },
          ],
        },
      },
      {
        menuKey: "guide" as const,
        name: "お役立ちコンテンツ",
        path: "/guide/",
        dataClickLabel: "ヘッダー_お役立ちコンテンツ",
        dropdown: {
          links: [
            {
              path: "/achievement/interview/list/",
              text: "ご利用者インタビュー",
              target: "",
              dataClickLabel: "ヘッダーお役立ち_ご利用者インタビュー",
              icon: null,
              isBrand: false,
            },
            {
              path: "/guide/freelance-start-guide/",
              text: "フリーランススタートガイド",
              target: "",
              dataClickLabel: "ヘッダーお役立ち_フリーランススタートガイド",
              icon: null,
              isBrand: false,
            },
          ],
        },
      },
    ],
    login: {
      icon: {
        src: "/top/icon_login.svg",
        width: 18,
        height: 18,
        alt: "icon_login",
      },
      text: "ログイン",
      link: "p/inflow/register/",
      dataClickLabel: "ヘッダー_ログイン_LTP導線",
    },
    recruitButton: {
      path: "/contact/recruit/freelance?sip=o06600_115",
      text: "エンジニアをお探しの\n企業様はこちら",
      target: "_blank",
      dataClickLabel: "エンジニアをお探しの企業様はこちら",
    },
    recruitTextButton: {
      path: "/contact/recruit/freelance?sip=o06600_115",
      text: "採用企業の方へ",
      target: "_blank",
      dataClickLabel: "採用企業の方へ",
    },
    ctaButton: {
      path: "/member/input/chat/",
      text: "無料会員登録",
      rel: "nofollow",
      dataClickLabel: "無料会員登録",
    },
    registerButton: {
      lineLeft: "\\",
      lineRight: "/",
      prefix: "簡単30秒",
      text: "無料登録",
      path: "/member/input/chat/",
      dataClickLabel: {
        top: "ヘッダー_TOP_無料登録",
        common: "ヘッダー_無料登録",
      },
    },
  },
  sp: {
    logo: {
      link: "/",
      dataClickLabel: "ヘッダー_ロゴ",
      image: {
        src: "/common/ltf/logo_ltf.svg",
        width: 110,
        height: 28,
        alt: "レバテックフリーランス",
      },
    },
    globalNavLeftButtons: [
      {
        icon: {
          src: "/header/sp/icon_building.svg",
          width: 24,
          height: 24,
          alt: "企業の方",
        },
        path: "/contact/recruit/freelance?sip=o06600_115",
        isBrand: true,
        target: "_blank",
        rel: "",
        text: "企業の方",
        variant: "",
        isMenu: false,
        dataClickLabel: "ヘッダー_企業の方",
      },
      {
        icon: {
          src: "/header/sp/icon_search.svg",
          width: 24,
          height: 24,
          alt: "案件検索",
        },
        path: "/project/search/",
        isBrand: false,
        target: "",
        rel: "",
        text: "案件検索",
        variant: "",
        isMenu: false,
        dataClickLabel: "ヘッダー_案件検索",
      },
    ],
    globalNavLRightButtons: [
      {
        icon: {
          src: "/header/sp/icon_edit.svg",
          width: 24,
          height: 24,
          alt: "無料登録",
        },
        path: "/member/input/chat/",
        isBrand: false,
        target: "",
        rel: "nofollow",
        text: "無料登録",
        variant: "-cta",
        isMenu: false,
        dataClickLabel: "ヘッダー_無料登録",
      },
      {
        icon: {
          src: "/header/sp/icon_menu.svg",
          width: 24,
          height: 24,
          alt: "メニュー",
        },
        path: null,
        isBrand: false,
        target: "",
        rel: "",
        text: "メニュー",
        variant: "",
        isMenu: true,
        dataClickLabel: "ヘッダー_メニュー",
      },
    ],
    globalNavLHeadButtons: {
      register: {
        href: "/member/input/chat/",
        text: "無料登録",
        variant: "-cta",
        isMenu: true,
        dataClickLabel: "ヘッダー_無料登録",
      },
      close: {
        text: "閉じる",
        isMenu: true,
        dataClickLabel: "ヘッダー_閉じる",
      },
    },
    globalNav: {
      head: {
        logo: {
          path: "/",
          image: {
            src: "/common/ltf/logo_ltf.svg",
            width: 110,
            height: 28,
            alt: "レバテックフリーランス",
          },
          dataClickLabel: "メニュー_ロゴ",
        },
        cta: {
          path: "/member/input/chat/",
          text: "無料会員登録",
          dataClickLabel: "メニュー_無料会員登録",
        },
      },
      projectMenu: {
        title: "案件を探す",
        category: {
          title: "人気の絞り込み条件",
          links: [
            {
              path: "/project/skill-3/",
              text: "Java",
              dataClickLabel: "案件を探す_Java",
            },
            {
              path: "/project/skill-5/",
              text: "PHP",
              dataClickLabel: "案件を探す_PHP",
            },
            {
              path: "/project/skill-7/",
              text: "Python",
              dataClickLabel: "案件を探す_Python",
            },
            {
              path: "/project/skill-8/",
              text: "Ruby",
              dataClickLabel: "案件を探す_Ruby",
            },
            {
              path: "/project/skill-4/",
              text: "JavaScript",
              dataClickLabel: "案件を探す_JavaScript",
            },
            {
              path: "/project/skill-11/",
              text: "C#",
              dataClickLabel: "案件を探す_C#",
            },
            {
              path: "/project/skill-10/",
              text: "Go",
              dataClickLabel: "案件を探す_Go",
            },
            {
              path: "/project/skill-49/",
              text: "Swift",
              dataClickLabel: "案件を探す_Swift",
            },
            {
              path: "/project/pref-13/",
              text: "東京都",
              dataClickLabel: "案件を探す_東京都",
            },
            {
              path: "/project/pref-27/",
              text: "大阪",
              dataClickLabel: "案件を探す_大阪",
            },
            {
              path: "/project/pref-40/",
              text: "福岡",
              dataClickLabel: "案件を探す_福岡",
            },
            {
              path: "/project/pref-23/",
              text: "愛知",
              dataClickLabel: "案件を探す_愛知",
            },
            {
              path: "/project/occ-4/",
              text: "インフラ",
              dataClickLabel: "案件を探す_インフラ",
            },
            {
              path: "/project/pos-1/",
              text: "SE",
              dataClickLabel: "案件を探す_SE",
            },
            {
              path: "/project/occ-6/",
              text: "フロントエンド",
              dataClickLabel: "案件を探す_フロントエンド",
            },
            {
              path: "/project/pos-3/",
              text: "プログラマー",
              dataClickLabel: "案件を探す_プログラマー",
            },
            {
              path: "/project/occ-3/",
              text: "ネットワーク",
              dataClickLabel: "案件を探す_ネットワーク",
            },
            {
              path: "/project/occ-43/",
              text: "PM",
              dataClickLabel: "案件を探す_PM",
            },
            {
              path: "/project/sidejob/",
              text: "副業・複業",
              dataClickLabel: "案件を探す_副業・複業",
            },
          ],
          cta: {
            path: "/project/search",
            text: "条件を指定して探す",
            dataClickLabel: "SPsearch_Menu_Search",
          },
        },
        link: {
          path: "/",
          text: "フリーランス案件を調べる",
          dataClickLabel: "案件を探す_フリーランス案件を調べる",
        },
      },
      serviceMenu: {
        title: "サービスについて",
        links: [
          {
            path: "/service/",
            text: "サービス紹介",
            dataClickLabel: "サービスについて_サービス紹介",
            isBrand: false,
            logo: null,
            target: "",
          },
          {
            path: "/service/#flow",
            text: "ご利用の流れ",
            dataClickLabel: "サービスについて_ご利用の流れ",
            isBrand: false,
            logo: null,
            target: "",
          },
          {
            path: "/consultation/detail/2/",
            text: "個別相談会",
            dataClickLabel: "サービスについて_個別相談会",
            isBrand: false,
            logo: null,
            target: "",
          },
          {
            path: "/friend/",
            text: "ご友人紹介",
            isBrand: false,
            logo: {
              src: "/common/icon_new_tab.svg",
              width: 16,
              height: 16,
            },
            target: "_blank",
            dataClickLabel: "サービスについて_ご友人紹介",
          },
          {
            path: "/service/platform/",
            text: "登録者限定機能について",
            dataClickLabel: "サービスについて_登録者限定機能について",
            isBrand: false,
            logo: null,
            target: "",
          },
          {
            path: "/women/",
            text: "フリーランスキャリア応援パッケージ",
            dataClickLabel: "サービスについて_フリーランスキャリア応援パッケージ",
            isBrand: false,
            logo: null,
            target: "",
          },
        ],
      },
      usefulMenu: {
        title: "お役立ちコンテンツ",
        links: [
          {
            path: "/guide/",
            text: "お役立ちコンテンツ一覧",
            dataClickLabel: "お役立ちコンテンツ_お役立ちコンテンツ一覧",
            isBrand: false,
            logo: null,
            target: "",
          },
          {
            path: "/guide/freelance-start-guide/",
            text: "フリーランススタートガイド",
            dataClickLabel: "お役立ちコンテンツ_フリーランススタートガイド",
            isBrand: false,
            logo: null,
            target: "",
          },
          {
            path: "/achievement/interview/list/",
            text: "ご利用者インタビュー",
            dataClickLabel: "お役立ちコンテンツ_ご利用者インタビュー",
            isBrand: false,
            logo: null,
            target: "",
          },
        ],
      },
      companyLink: {
        path: "/contact/recruit/freelance?sip=o06600_115",
        text: "採用を検討中の企業様",
        logo: {
          src: "/common/icon_new_tab.svg",
          width: 16,
          height: 16,
        },
        dataClickLabel: "採用を検討中の企業様",
      },
      login: {
        text: "ログイン",
        link: "p/inflow/register/",
        dataClickLabel: "ヘッダー_ログイン_LTP導線",
      },
    },
  },
};

export type HeaderDataType = typeof HeaderData;
