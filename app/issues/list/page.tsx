import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/components";
import NextLink from "next/link";
import IssueAction from "./issueAction";
import { Issue, Status } from "@/app/generated/prisma";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface Props {
  searchParams: { status?: string; orderBy?: string };
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

  const orderBy = searchParams.orderBy
    ? { [searchParams.orderBy]: "asc" }
    : undefined;

  const issues = await prisma.issue.findMany({
    where: { status },
    orderBy,
  });

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
                  <NextLink
                    href={{
                      query: { ...searchParams, orderBy: column.value },
                    }}
                  >
                    {column.label}
                  </NextLink>
                  {column.value === searchParams.orderBy && (
                    <ArrowUpIcon className="inline" />
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
    </div>
  );
};

export default IssuesPage;
