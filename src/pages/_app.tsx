import "react-toastify/dist/ReactToastify.min.css";
import "../styles/globals.css";

import { Overpass } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Slide, ToastContainer } from "react-toastify";

import { trpc } from "@/utils/trpc";

const overpass = Overpass({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component className={overpass.className} {...pageProps} />
      <ToastContainer
        transition={Slide}
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        limit={10}
        theme="colored"
      />
      <Analytics />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
