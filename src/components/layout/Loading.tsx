export interface LoadingProps {
  text?: string;
  className?: string;
}

export function Loading(props: LoadingProps) {
  return (
    <div className={props.className}>
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-12 items-center justify-center">
          <div className="mx-1 h-2 w-2 animate-loading-pin rounded-full bg-[hsla(245,84%,70%,0.3)]" />
          <div className="mx-1 h-2 w-2 animate-loading-pin rounded-full bg-[hsla(245,84%,70%,0.55)] [animation-delay:150ms]" />
          <div className="mx-1 h-2 w-2 animate-loading-pin rounded-full bg-[hsla(243,92%,82%,1)] [animation-delay:300ms]" />
          <div className="mx-1 h-2 w-2 animate-loading-pin rounded-full bg-[hsla(40,55%,88%,1)] [animation-delay:450ms]" />
        </div>
        {props.text && props.text.length ? (
          <p className="mt-3 max-w-xs text-sm opacity-75">{props.text}</p>
        ) : null}
      </div>
    </div>
  );
}
