type HeaderItem = {
  title: string;
  id: number;
};

export interface TableOfContentsItem {
  h2: HeaderItem;
  h3: HeaderItem[];
}

export interface ProcessedArticleHtml {
  html: string | null;
  toc: TableOfContentsItem[];
}
