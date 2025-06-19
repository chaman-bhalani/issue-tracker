import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import DeleteIssueButton from "./DeleteIssueButton";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "./AssigneeSelect";
import { Metadata } from "next";
import { cache } from "react";

interface Props {
  params: { id: string };
}

const fetchUser = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } })
);
const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const issue = await fetchUser(parseInt(params.id));
  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export async function generateMetadata({ params }: Props) {
  const issue = await fetchUser(parseInt(params.id));
  return {
    title: issue?.title,
    description: "Issue details" + issue?.id,
  };
}
export default IssueDetailPage;

// export const metadata: Metadata = {
//   title: "Issue Tracker - Issue Details",
//   description: "View and manage issue details in the Issue Tracker app.",
//   openGraph: {
//     title: "Issue Tracker - Issue Details",
//     description: "View and manage issue details in the Issue Tracker app.",
//     url: "https://yourdomain.com/issues/details",
//     siteName: "Issue Tracker",
//     images: [
//       {
//         url: "https://yourdomain.com/og-image-issue-details.png",
//         width: 1200,
//         height: 630,
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Issue Tracker - Issue Details",
//     description: "View and manage issue details in the Issue Tracker app.",
//     images: ["https://yourdomain.com/twitter-image-issue-details.png"],
//   },
// };
