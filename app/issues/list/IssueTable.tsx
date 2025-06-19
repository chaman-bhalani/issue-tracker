import { IssueStatusBadge } from "@/app/components";
import { Issue, Status } from "@/app/generated/prisma";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";

export interface IssueQuery {
  status: Status;
  orderBy: keyof Issue;
  page: string;
}
interface Props {
  searchParams: IssueQuery;
  issues: Issue[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
  const validStatuses = Object.values(Status);
  const status = validStatuses.includes(searchParams.status as Status)
    ? (searchParams.status as Status)
    : undefined;
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

  return (
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
  );
};

const columns: {
  label: string;
  value: keyof Issue;
  classname?: string;
}[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status", classname: "hidden md:table-cell" },
  { label: "Created", value: "ceatedAt", classname: "hidden md:table-cell" },
];
export const columnNames = columns.map((column) => column.value);
export default IssueTable;
