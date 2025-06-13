import React from "react";
import NextLink from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";

interface Props {
  href: string;
  children: string;
}

const Link = ({ href, children }: Props) => {
  return (
    <div>
      <RadixLink asChild>
        <NextLink href={href}>{children}</NextLink>
      </RadixLink>
    </div>
  );
};

export default Link;
