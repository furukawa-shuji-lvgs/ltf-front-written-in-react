type HeaderItem = {
  readonly title: string;
  readonly id: number;
};

export interface TableOfContentsItem {
  readonly h2: HeaderItem;
  readonly h3: readonly HeaderItem[];
}

export interface ProcessedArticleHtml {
  readonly html: string | null;
  readonly toc: readonly TableOfContentsItem[];
}
