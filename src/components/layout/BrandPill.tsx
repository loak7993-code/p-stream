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
        "flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-type-logo",
        props.backgroundClass,
        props.clickable
          ? "transition-[transform,box-shadow,border-color] duration-300 hover:border-iris-200/30 hover:shadow-[0_8px_32px_-12px_hsla(245,70%,55%,0.45)] active:scale-[0.98]"
          : "",
      )}
    >
      <span className="font-display text-[19px] leading-none tracking-tight text-white">
        Stream<em className="viva-gradient-text not-italic">Viva</em>
      </span>
      <span
        className="viva-bulb ml-0.5 inline-block h-1 w-1 rounded-full"
        style={{ background: "hsla(245, 84%, 70%, 1)" }}
      />
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
