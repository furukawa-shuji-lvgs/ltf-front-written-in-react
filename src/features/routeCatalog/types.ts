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
  label: string;
  href: string;
}

export interface PageSection {
  title: string;
  body: string;
}

export interface PageDefinition {
  id: string;
  feature: RouteFeature;
  source: string;
  pattern: readonly string[];
  title: string;
  description: string;
  eyebrow: string;
  layout: RouteLayout;
  actions: readonly PageAction[];
  sections: readonly PageSection[];
  ogType?: "article" | "website";
}

export interface PageRouteMatch {
  definition: PageDefinition;
  params: Record<string, string>;
  pathname: string;
}
