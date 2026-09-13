export interface Tdkh {
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly keywords: string;
  readonly h1: string;
}

export interface GetTdkhResponseDto {
  readonly tdkh: Tdkh;
}

export interface SeoText {
  readonly title?: string;
  readonly text?: string;
  readonly secondTitle?: string;
  readonly secondText?: string;
}

export interface GetSeoTextResponseDto {
  readonly seoText: SeoText;
}

export interface BreadCrumb {
  readonly text: string;
  readonly url: string;
}

export interface GetBreadCrumbsResponseDto {
  readonly breadCrumbs: readonly BreadCrumb[];
}
