import type { Metadata } from "next";
import type { ReactNode } from "react";

import { notFound } from "next/navigation";

import type { PageRouteMatch } from "@features/routeCatalog/types.ts";

import {
  getRoutePageDataBySlugKey,
  toRouteSlugKey,
} from "@features/routeCatalog/api/getRoutePageData.ts";

interface CatchAllPageProps {
  readonly params: Promise<{
    readonly slug?: readonly string[];
  }>;
}

const featurePageRenderers = {
  achievement: async (match: PageRouteMatch) => {
    const { AchievementPage } =
      await import("@features/achievement/components/AchievementPage.tsx");
    return <AchievementPage match={match} />;
  },
  consultation: async (match: PageRouteMatch) => {
    const { ConsultationPage } =
      await import("@features/consultation/components/ConsultationPage.tsx");
    return <ConsultationPage match={match} />;
  },
  entry: async (match: PageRouteMatch) => {
    const { EntryPage } = await import("@features/entry/components/EntryPage.tsx");
    return <EntryPage match={match} />;
  },
  friend: async (match: PageRouteMatch) => {
    const { FriendPage } = await import("@features/friend/components/FriendPage.tsx");
    return <FriendPage match={match} />;
  },
  guide: async (match: PageRouteMatch) => {
    const { GuidePage } = await import("@features/guide/components/GuidePage.tsx");
    return <GuidePage match={match} />;
  },
  information: async (match: PageRouteMatch) => {
    const { InformationPage } =
      await import("@features/information/components/InformationPage.tsx");
    return <InformationPage match={match} />;
  },
  maintenance: async (match: PageRouteMatch) => {
    const { MaintenancePage } =
      await import("@features/maintenance/components/MaintenancePage.tsx");
    return <MaintenancePage match={match} />;
  },
  member: async (match: PageRouteMatch) => {
    const { MemberPage } = await import("@features/member/components/MemberPage.tsx");
    return <MemberPage match={match} />;
  },
  project: async (match: PageRouteMatch) => {
    const { ProjectPage } = await import("@features/project/components/ProjectPage.tsx");
    return <ProjectPage match={match} />;
  },
  service: async (match: PageRouteMatch) => {
    const { ServicePage } = await import("@features/service/components/ServicePage.tsx");
    return <ServicePage match={match} />;
  },
  top: async (match: PageRouteMatch) => {
    const { TopPage } = await import("@features/top/components/TopPage.tsx");
    return <TopPage match={match} />;
  },
  word: async (match: PageRouteMatch) => {
    const { WordPage } = await import("@features/word/components/WordPage.tsx");
    return <WordPage match={match} />;
  },
} satisfies Record<
  PageRouteMatch["definition"]["feature"],
  (match: PageRouteMatch) => Promise<ReactNode>
>;

const renderFeaturePage = (match: PageRouteMatch) =>
  featurePageRenderers[match.definition.feature](match);

export const generateMetadata = async ({ params }: CatchAllPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const routeData = getRoutePageDataBySlugKey(toRouteSlugKey(slug));
  if (!routeData.metadata) {
    return {
      title: "ページが見つかりません",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return routeData.metadata;
};

const Page = async ({ params }: CatchAllPageProps) => {
  const { slug } = await params;
  const routeData = getRoutePageDataBySlugKey(toRouteSlugKey(slug));
  if (!routeData.match) {
    notFound();
  }

  return renderFeaturePage(routeData.match);
};

export default Page;
