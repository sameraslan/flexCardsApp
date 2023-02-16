import cx from "classnames";
import type { PropsWithChildren } from "react";
import React from "react";
import ReactDOM from "react-dom";

type Props = PropsWithChildren & {
  color: "info" | "success" | "warning" | "error";
  top?: boolean;
  right?: boolean;
};

export default function Toast({ color, top, right, children }: Props) {
  return ReactDOM.createPortal(
    <div
      className={cx("toast", {
        "toast-top": top,
        "toast-right": right,
      })}
    >
      <div
        className={cx("alert", {
          "alert-info": color === "info",
          "alert-success": color === "success",
          "alert-warning": color === "warning",
          "alert-error": color === "error",
        })}
      >
        <span>{children}</span>
      </div>
    </div>,
    document.body
  );
}
