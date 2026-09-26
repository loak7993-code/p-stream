import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { useIsMobile } from "@/hooks/useIsMobile";

export function BrandPill(props: {
  clickable?: boolean;
  header?: boolean;
  backgroundClass?: string;
}) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div
      className={classNames(
        "group flex items-center gap-2.5 rounded-full px-4 py-2 text-type-logo backdrop-blur-lg",
        props.backgroundClass ?? "bg-pill-background bg-opacity-50",
        props.clickable
          ? "transition-[transform,box-shadow] hover:scale-105 hover:shadow-[0_0_0_1px_hsla(38,96%,68%,0.35),0_4px_28px_-8px_hsla(36,96%,58%,0.55)] active:scale-95"
          : "",
      )}
    >
      <span className="font-display text-lg font-semibold tracking-tight text-white">
        Stream
        <span className="viva-gradient-text">Viva</span>
      </span>
      <span className="flex items-center gap-1" aria-hidden="true">
        <span className="viva-bulb inline-block h-1.5 w-1.5 rounded-full bg-[hsla(38,96%,68%,1)]" />
        <span
          className="viva-bulb inline-block h-1.5 w-1.5 rounded-full bg-[hsla(36,96%,68%,1)]"
          style={{ animationDelay: "0.25s" }}
        />
        <span
          className="viva-bulb inline-block h-1.5 w-1.5 rounded-full bg-[hsla(8,84%,64%,1)]"
          style={{ animationDelay: "0.5s" }}
        />
      </span>
      <span
        className={[
          "sr-only",
          isMobile && props.header ? "hidden sm:block" : "",
        ].join(" ")}
      >
        {t("global.name")}
      </span>
    </div>
  );
}
