export interface HeroTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export function HeroTitle(props: HeroTitleProps) {
  return (
    <h1
      className={`font-display text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </h1>
  );
}
