import Link from "next/link";

import Logo from "@/assets/images/svg/FlashLogo.svg";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 bg-base-100 shadow-sm shadow-primary">
      <div className="container relative flex h-16 items-center justify-between px-8">
        <div className="flex flex-1 items-center justify-start sm:items-stretch sm:justify-center">
          <div className="flex flex-shrink-0 items-center">
            <Link className="group flex items-center gap-3" href="/">
              <Logo className="h-12 group-hover:animate-spin-slow" />
              <h1 className="flex flex-col items-center">
                <span className="text-xl leading-5 tracking-wide">FlexCards</span>
              </h1>
            </Link>
            <Link className="btn-outline btn absolute right-8" href="/app">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
