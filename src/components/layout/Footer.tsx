import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { RequireExactlyOne } from "type-fest";

import { Icon, Icons } from "@/components/Icon";
import { BrandPill } from "@/components/layout/BrandPill";
import { WideContainer } from "@/components/layout/WideContainer";
import { shouldHaveLegalPage } from "@/pages/Legal";
import { conf } from "@/setup/config";

// to and href are mutually exclusive
type FooterLinkProps = RequireExactlyOne<
  {
    children: React.ReactNode;
    icon: Icons;
    to: string;
    href: string;
  },
  "to" | "href"
>;

function FooterLink(props: FooterLinkProps) {
  const navigate = useNavigate();

  const navigateTo = useCallback(() => {
    if (!props.to) return;

    navigate(props.to);
  }, [navigate, props.to]);

  return (
    <a
      href={props.href}
      target={props.href ? "_blank" : undefined}
      rel="noreferrer"
      className="tabbable rounded py-2 px-3 inline-flex cursor-pointer items-center space-x-3 transition-colors duration-200 hover:text-type-emphasis"
      onClick={props.to ? navigateTo : undefined}
    >
      <Icon icon={props.icon} className="text-2xl" />
      <span className="font-medium">{props.children}</span>
    </a>
  );
}

function Legal() {
  const { t } = useTranslation();

  if (!shouldHaveLegalPage()) return null;
  if (window.location.hash === "#/legal") return null;

  return (
    <FooterLink to="/legal" icon={Icons.DRAGON}>
      {t("footer.links.legal")}
    </FooterLink>
  );
}

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-16 border-t border-type-divider py-16 md:py-8">
      <WideContainer ultraWide classNames="grid md:grid-cols-2 gap-16 md:gap-8">
        <div>
          <div className="inline-block">
            <BrandPill />
          </div>
          <p className="mt-4 lg:max-w-[400px]">{t("footer.tagline")}</p>
        </div>
        <div className="md:text-right">
          <h3 className="font-semibold text-type-emphasis">
            {t("footer.legal.disclaimer")}
          </h3>
          <p className="mt-3">{t("footer.legal.disclaimerText")}</p>
        </div>
        <div className="flex flex-wrap gap-[0.5rem] -ml-3">
          {conf().GITHUB_LINK && (
            <FooterLink icon={Icons.GITHUB} href={conf().GITHUB_LINK}>
              {t("footer.links.github")}
            </FooterLink>
          )}
          {conf().DISCORD_LINK && (
            <FooterLink icon={Icons.DISCORD} href={conf().DISCORD_LINK}>
              {t("footer.links.discord")}
            </FooterLink>
          )}
          <div className="inline md:hidden">
            <Legal />
          </div>
        </div>
        <div className="hidden items-center justify-end md:flex -mr-3">
          <Legal />
        </div>
      </WideContainer>
      <div className="mt-10 border-t border-type-divider pt-5">
        <div className="overflow-hidden" aria-hidden="true">
          <div className="sig-ticker">
            <span className="sig-ticker-item">streamviva</span>
            <span className="sig-ticker-item">viva la streamviva</span>
            <span className="sig-ticker-item">35 sources online</span>
            <span className="sig-ticker-item">movies · tv · anime</span>
            <span className="sig-ticker-item">signal: live</span>
            <span className="sig-ticker-item">streamviva</span>
            <span className="sig-ticker-item">viva la streamviva</span>
            <span className="sig-ticker-item">35 sources online</span>
            <span className="sig-ticker-item">movies · tv · anime</span>
            <span className="sig-ticker-item">signal: live</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-3 opacity-50 transition-opacity duration-300 hover:opacity-90">
          <span
            className="h-px w-10"
            style={{ background: "hsla(189,92%,64%,0.5)" }}
          />
          <span className="font-mono-label text-type-secondary">
            end of transmission
          </span>
          <span
            className="h-px w-10"
            style={{ background: "hsla(189,92%,64%,0.5)" }}
          />
          <a
            href="https://deerflow.tech"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] tracking-wider text-type-secondary transition-colors hover:text-type-logo"
            title="Created By Deerflow"
          >
            ✦ DF
          </a>
        </div>
      </div>
    </footer>
  );
}

export function FooterView(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["flex min-h-screen flex-col", props.className || ""].join(
        " ",
      )}
    >
      <div style={{ flex: "1 0 auto" }}>{props.children}</div>
      <Footer />
    </div>
  );
}
