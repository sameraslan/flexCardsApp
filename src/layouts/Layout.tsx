import type { User } from "@prisma/client";
import cx from "classnames";
import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";

import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import HomeHeader from "@/components/HomeHeader";

type Props = PropsWithChildren & {
  className?: string;
  user?: User;
};

export default function Layout({ user, className, children }: Props) {
  const { pathname } = useRouter();
  return (
    <>
      {pathname === "/" ? <HomeHeader /> : <AppHeader user={user} />}
      <main
        className={cx(
          "min-h-layout-mobile sm:min-h-layout",
          {
            "pt-16": !className,
          },
          className
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
