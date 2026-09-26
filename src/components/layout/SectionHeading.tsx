import { ReactNode } from "react";

import { Icon, Icons } from "@/components/Icon";

interface SectionHeadingProps {
  icon?: Icons;
  title: string;
  children?: ReactNode;
  className?: string;
  customIcon?: ReactNode;
}

export function SectionHeading(props: SectionHeadingProps) {
  return (
    <div className={props.className}>
      <div className="mb-5 flex items-center gap-3">
        <span
          className="h-4 w-px shrink-0 rounded-full"
          style={{ background: "hsla(245, 84%, 70%, 0.8)" }}
        />
        <p className="flex flex-1 items-center text-[15px] font-semibold tracking-wide text-type-text z-[19]">
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
