import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/components";
import NextLink from "next/link";
import IssueAction from "./issueAction";
import { Issue, Status } from "@/app/generated/prisma";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "@/app/components/Pagination";

interface Props {
  searchParams: { status?: string; orderBy: keyof Issue; page?: string };
}

const IssuesPage = async ({ searchParams }: Props) => {
  const columns: {
    label: string;
    value: keyof Issue;
    classname?: string;
  }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", classname: "hidden md:table-cell" },
    { label: "Created", value: "ceatedAt", classname: "hidden md:table-cell" },
  ];

  const validStatuses = Object.values(Status);
  const status = validStatuses.includes(searchParams.status as Status)
    ? (searchParams.status as Status)
    : undefined;

  const where = { status };

  const validOrderFields: (keyof Issue)[] = [
    "id",
    "title",
    "description",
    "status",
    "ceatedAt",
    "updatedAt",
    "assignedToUserId",
  ];

  const orderByField = validOrderFields.includes(
    searchParams.orderBy as keyof Issue
  )
    ? (searchParams.orderBy as keyof Issue)
    : undefined;

  const page = parseInt(searchParams.page || "1");
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy: orderByField ? { [orderByField]: "asc" } : undefined,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });
  return (
    <div>
      <IssueAction />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => {
              const params = new URLSearchParams();

              if (status) params.set("status", status);
              params.set("orderBy", column.value);

              return (
                <Table.ColumnHeaderCell
                  key={column.value}
                  className={column.classname}
                >
                  <NextLink href={`/issues/list?${params.toString()}`}>
                    {column.label}
                  </NextLink>
                  {column.value === orderByField && (
                    <ArrowUpIcon className="inline ml-1" />
                  )}
                </Table.ColumnHeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.ceatedAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </div>
  );
};

export default IssuesPage;
