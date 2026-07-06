export const ErrorPageData = {
  title: "お探しのページは見つかりませんでした",
  pcText:
    "申し訳ございません。ご指定のページは削除されたか、移動した可能性がございます。\n以下の項目よりご覧になりたいページをお探しください。",
  spText:
    "申し訳ございません。\nご指定のページは削除されたか、\n移動した可能性がございます。\n以下の項目よりご覧になりたいページを\nお探しください。",
  contentsList: [
    {
      title: "レバテックフリーランスについて",
      links: [
        {
          link: "/",
          text: "TOPページ",
        },
        {
          link: "/service/",
          text: "サービス紹介",
        },
      ],
    },
    {
      title: "案件検索",
      links: [
        {
          link: "/project/search/",
          text: "案件一覧",
        },
      ],
    },
    {
      title: "お役立ちコンテンツ",
      links: [
        {
          link: "/guide/",
          text: "お役立ち記事",
        },
      ],
    },
  ],
  breadCrumb: {
    url: "",
    text: "404エラー",
  },
};

export type ErrorPageDataType = typeof ErrorPageData;
