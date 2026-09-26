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
        "flex items-center gap-3 rounded-none border border-type-divider bg-background-secondary/60 px-4 py-2 text-type-logo backdrop-blur-md",
        props.backgroundClass,
        props.clickable
          ? "transition-[transform,box-shadow] hover:-translate-y-px hover:border-buttons-toggle hover:shadow-[3px_3px_0_0_hsla(290,82%,64%,0.6)] active:translate-y-0 active:shadow-none"
          : "",
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className="viva-bulb inline-block h-2 w-2 rounded-none"
          style={{ background: "hsla(0, 84%, 64%, 1)" }}
        />
        <span className="font-display text-base font-black tracking-tight text-white">
          Stream<span className="viva-gradient-text">Viva</span>
        </span>
      </span>
      <span className="font-mono-label hidden text-type-secondary sm:inline">
        SIG/01
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
