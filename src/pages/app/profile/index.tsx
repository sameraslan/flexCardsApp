import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { MdOutlineBuildCircle } from "react-icons/md";

import Layout from "@/layouts/Layout";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";

export default function ProfilePage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout className="container pb-8 pt-24" user={user}>
      <div className="flex min-h-layout-inside-mobile flex-col items-center justify-center gap-6 sm:min-h-layout-inside">
        <MdOutlineBuildCircle className="h-24 w-24 animate-spin-slow text-accent" />
        <div className="flex flex-col items-center justify-center gap-1">
          <h2 className="text-center text-3xl">Work in progress</h2>
          <p>please visit later...</p>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  return {
    props: {
      user: session?.user,
    },
  };
}
