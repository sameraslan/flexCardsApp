import type { PropsWithChildren } from "react";

import Logo from "@/assets/images/svg/Logo.svg";

type Props = PropsWithChildren;

export default function Loader({ children = "Loading..." }: Props) {
  return (
    <div className="flex min-h-layout-inside-mobile flex-col items-center justify-center gap-6 sm:min-h-layout-inside">
      <Logo className="h-24 w-24 animate-spin-slow text-accent" />
      {children}
    </div>
  );
}
