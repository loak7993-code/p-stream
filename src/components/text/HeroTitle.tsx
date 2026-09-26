export interface HeroTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export function HeroTitle(props: HeroTitleProps) {
  return (
    <h1
      className={`font-display text-3xl font-semibold tracking-tight text-white drop-shadow-[0_2px_18px_hsla(28,60%,10%,0.9)] sm:text-4xl md:text-5xl ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </h1>
  );
}
