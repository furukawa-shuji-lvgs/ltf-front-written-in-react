export interface Tdkh {
  key: string;
  title: string;
  description: string;
  keywords: string;
  h1: string;
}

export interface GetTdkhResponseDto {
  tdkh: Tdkh;
}

export interface SeoText {
  title?: string;
  text?: string;
  secondTitle?: string;
  secondText?: string;
}

export interface GetSeoTextResponseDto {
  seoText: SeoText;
}

export interface BreadCrumb {
  text: string;
  url: string;
}

export interface GetBreadCrumbsResponseDto {
  breadCrumbs: BreadCrumb[];
}
