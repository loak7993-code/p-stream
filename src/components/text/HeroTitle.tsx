export interface HeroTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export function HeroTitle(props: HeroTitleProps) {
  return (
    <h1
      className={`font-display text-3xl leading-tight text-white sm:text-4xl md:text-[2.9rem] ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </h1>
  );
}
