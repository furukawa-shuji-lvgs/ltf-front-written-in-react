import {
  getRoutePageDataBySlugKey,
  toRouteSlugKey,
} from "@features/routeCatalog/api/getRoutePageData.ts";
import type { PageRouteMatch } from "@features/routeCatalog/types.ts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface CatchAllPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

const renderFeaturePage = async (match: PageRouteMatch) => {
  switch (match.definition.feature) {
    case "achievement": {
      const { AchievementPage } = await import(
        "@features/achievement/components/AchievementPage.tsx"
      );
      return <AchievementPage match={match} />;
    }
    case "consultation": {
      const { ConsultationPage } = await import(
        "@features/consultation/components/ConsultationPage.tsx"
      );
      return <ConsultationPage match={match} />;
    }
    case "entry": {
      const { EntryPage } = await import("@features/entry/components/EntryPage.tsx");
      return <EntryPage match={match} />;
    }
    case "friend": {
      const { FriendPage } = await import("@features/friend/components/FriendPage.tsx");
      return <FriendPage match={match} />;
    }
    case "guide": {
      const { GuidePage } = await import("@features/guide/components/GuidePage.tsx");
      return <GuidePage match={match} />;
    }
    case "information": {
      const { InformationPage } = await import(
        "@features/information/components/InformationPage.tsx"
      );
      return <InformationPage match={match} />;
    }
    case "maintenance": {
      const { MaintenancePage } = await import(
        "@features/maintenance/components/MaintenancePage.tsx"
      );
      return <MaintenancePage match={match} />;
    }
    case "member": {
      const { MemberPage } = await import("@features/member/components/MemberPage.tsx");
      return <MemberPage match={match} />;
    }
    case "project": {
      const { ProjectPage } = await import("@features/project/components/ProjectPage.tsx");
      return <ProjectPage match={match} />;
    }
    case "service": {
      const { ServicePage } = await import("@features/service/components/ServicePage.tsx");
      return <ServicePage match={match} />;
    }
    case "top": {
      const { TopPage } = await import("@features/top/components/TopPage.tsx");
      return <TopPage match={match} />;
    }
    case "word": {
      const { WordPage } = await import("@features/word/components/WordPage.tsx");
      return <WordPage match={match} />;
    }
  }
};

export const generateMetadata = async ({ params }: CatchAllPageProps): Promise<Metadata> => {
  const routeData = getRoutePageDataBySlugKey(toRouteSlugKey((await params).slug));
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
  const routeData = getRoutePageDataBySlugKey(toRouteSlugKey((await params).slug));
  if (!routeData.match) {
    notFound();
  }

  return renderFeaturePage(routeData.match);
};

export default Page;
