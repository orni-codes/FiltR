export function Brand() {
  return (
    <div className="flex h-10 items-center gap-2.5" aria-label="FiltR">
      <div className="relative flex size-7 items-center justify-center rounded-md bg-foreground text-sm font-semibold text-background">
        F<span className="absolute right-1.5 top-1/2 h-px w-2 bg-primary-foreground" />
      </div>
      <span className="text-[19px] font-semibold text-foreground">
        Filt
        <span className="relative text-primary">
          R<span className="absolute -right-0.5 top-[9px] h-px w-2 bg-background" />
        </span>
      </span>
    </div>
  );
}
