import { ReactNode } from "react";

import { Icon, Icons } from "@/components/Icon";

interface SectionHeadingProps {
  icon?: Icons;
  title: string;
  children?: ReactNode;
  className?: string;
  customIcon?: ReactNode;
}

let sectionCounter = 0;
const channelNumbers = [
  "CH 01",
  "CH 02",
  "CH 03",
  "CH 04",
  "CH 05",
  "CH 06",
  "CH 07",
  "CH 08",
  "CH 09",
  "CH 10",
  "CH 11",
  "CH 12",
];

export function SectionHeading(props: SectionHeadingProps) {
  const channel = channelNumbers[sectionCounter % channelNumbers.length];
  sectionCounter += 1;

  return (
    <div className={props.className}>
      <div className="mb-5 flex items-center gap-4">
        <span className="font-mono-label shrink-0 text-buttons-toggle">
          {channel}
        </span>
        <span
          className="h-px w-6 shrink-0"
          style={{ background: "hsla(189, 92%, 64%, 0.5)" }}
        />
        <p className="flex flex-1 items-center font-display font-extrabold uppercase tracking-wide text-type-text z-[19]">
          {props.customIcon ? (
            <span className="mr-2 text-xl flex items-center justify-center">
              {props.customIcon}
            </span>
          ) : props.icon ? (
            <span className="mr-2 text-xl">
              <Icon icon={props.icon} />
            </span>
          ) : null}
          {props.title}
        </p>
        {props.children}
      </div>
    </div>
  );
}
