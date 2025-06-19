import Pagination from "@/app/components/Pagination";
import { Issue, Status } from "@/app/generated/prisma";
import prisma from "@/prisma/client";
import IssueAction from "./issueAction";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";

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
    <Flex direction='column' gap='3'>
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
