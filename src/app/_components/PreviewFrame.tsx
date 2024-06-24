import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  rounded?: boolean;
  frame: string | null;
  plain?: boolean;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const PreviewFrame = ({
  rounded,
  frame,
  className,
  children,
  plain = false,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        "flex relative w-full h-auto aspect-square mx-auto",
        className,
        plain ? "" : "border border-border bg-slate-100",
        rounded ? "rounded-full overflow-hidden" : "",
      )}
      {...props}
    >
      {children}
      {frame && (
        <img
          src={frame}
          alt="Selected Frame"
          className="w-full h-full absolute top-0 left-0 pointer-events-none"
        />
      )}
    </div>
  );
};

export default PreviewFrame;
