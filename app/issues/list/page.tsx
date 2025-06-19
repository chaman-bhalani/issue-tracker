import Pagination from "@/app/components/Pagination";
import { Issue, Status } from "@/app/generated/prisma";
import prisma from "@/prisma/client";
import IssueAction from "./issueAction";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: IssueQuery;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const validStatuses = Object.values(Status);
  const status = validStatuses.includes(searchParams.status as Status)
    ? (searchParams.status as Status)
    : undefined;
  const where = { status };

  const orderBy = columnNames.includes(searchParams.orderBy as keyof Issue)
    ? { [searchParams.orderBy as keyof Issue]: "asc" }
    : undefined;

  const page = parseInt(searchParams.page || "1");
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });
  return (
    <Flex direction="column" gap="3">
      <IssueAction />
      <IssueTable searchParams={searchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};

export default IssuesPage;

export const metadata: Metadata = {
  title: "Issue Tracker - Issues",
  description: "Manage and track your issues efficiently.",
  openGraph: {
    title: "Issue Tracker - Issues",
    description: "Manage and track your issues efficiently.",
    url: "https://yourdomain.com/issues",
    siteName: "Issue Tracker",
    images: [
      {
        url: "https://yourdomain.com/og-image-issues.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Issue Tracker - Issues",
    description: "Manage and track your issues efficiently.",
    images: ["https://yourdomain.com/twitter-image-issues.png"],
  },
};
