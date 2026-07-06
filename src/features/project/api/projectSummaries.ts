import { z } from "zod";

export const projectSummarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  price: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  detailPath: z.string().min(1),
  status: z.enum(["open", "closed"]),
});

export type ProjectSummary = z.infer<typeof projectSummarySchema>;

const openProjectSummaries = [
  {
    id: "project-java-spring",
    title: "Java/Spring Bootを用いた基幹システム開発案件",
    price: "〜850,000円/月",
    tags: ["Java", "Spring Boot", "リモート可"],
    detailPath: "/project/detail/1001/",
    status: "open",
  },
  {
    id: "project-react-saas",
    title: "TypeScript/Reactを用いたSaaSフロントエンド開発案件",
    price: "〜780,000円/月",
    tags: ["TypeScript", "React", "週3日可"],
    detailPath: "/project/detail/1002/",
    status: "open",
  },
  {
    id: "project-aws-platform",
    title: "AWSを用いたクラウド基盤設計・運用案件",
    price: "〜900,000円/月",
    tags: ["AWS", "Terraform", "上流工程"],
    detailPath: "/project/detail/1003/",
    status: "open",
  },
] satisfies [ProjectSummary, ...ProjectSummary[]];

const closedProjectSummaries = [
  {
    id: "project-closed-php",
    title: "PHP/Laravelを用いたECサイト改修案件",
    price: "〜720,000円/月",
    tags: ["PHP", "Laravel", "募集終了"],
    detailPath: "/project/detail/9001/",
    status: "closed",
  },
] satisfies [ProjectSummary, ...ProjectSummary[]];

const projectSummariesByStatus = {
  open: openProjectSummaries,
  closed: closedProjectSummaries,
} satisfies Record<ProjectSummary["status"], [ProjectSummary, ...ProjectSummary[]]>;

export interface GetProjectSummariesParams {
  count: number;
  status?: ProjectSummary["status"];
}

const buildRepeatedSummaries = (
  summaries: [ProjectSummary, ...ProjectSummary[]],
  count: number,
): ProjectSummary[] =>
  Array.from({ length: count }, (_, index) => {
    const summary = summaries[index % summaries.length] ?? summaries[0];
    return {
      ...summary,
      id: `${summary.id}-${index + 1}`,
    };
  });

export const getProjectSummaries = ({
  count,
  status = "open",
}: GetProjectSummariesParams): ProjectSummary[] => {
  const summaries = projectSummariesByStatus[status];

  return projectSummarySchema.array().parse(buildRepeatedSummaries(summaries, count));
};
