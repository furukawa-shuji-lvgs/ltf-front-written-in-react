export type RouteFeature =
  | "achievement"
  | "consultation"
  | "entry"
  | "friend"
  | "guide"
  | "information"
  | "maintenance"
  | "member"
  | "project"
  | "service"
  | "top"
  | "word";

export type RouteLayout = "standard" | "wide" | "form" | "maintenance";

export interface PageAction {
  readonly label: string;
  readonly href: string;
}

export interface PageSection {
  readonly title: string;
  readonly body: string;
}

export interface PageDefinition {
  readonly id: string;
  readonly feature: RouteFeature;
  readonly source: string;
  readonly pattern: readonly string[];
  readonly title: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly layout: RouteLayout;
  readonly actions: readonly PageAction[];
  readonly sections: readonly PageSection[];
  readonly ogType?: "article" | "website";
}

export interface PageRouteMatch {
  readonly definition: PageDefinition;
  readonly params: Readonly<Record<string, string>>;
  readonly pathname: string;
}
