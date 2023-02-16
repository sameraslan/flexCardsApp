import type { PropsWithChildren } from "react";
import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import { GiPoliceCar } from "react-icons/gi";

type Props = PropsWithChildren & {
  message: string;
};

export default function Error({ message, children }: Props) {
  return (
    <div className="flex min-h-layout-inside-mobile flex-col items-center justify-center sm:min-h-layout-inside">
      <GiPoliceCar className="mx-auto mb-4" size={56} />
      <h2 className="mb-4 text-center text-3xl">Something went wrong</h2>
      <div className="alert max-w-sm shadow-lg">
        <div>
          <FiAlertCircle
            className="h-6 w-6 flex-shrink-0 stroke-current"
            size={20}
          />
          <span>{message}</span>
        </div>
      </div>
      {children}
    </div>
  );
}
