import { useAutoAnimate } from "@formkit/auto-animate/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Seo from "@/components/Seo";
import Layout from "@/layouts/Layout";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";

export default function DashboardListWrapper({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [containerParent] = useAutoAnimate<HTMLDivElement>();

  return (
    <Layout className="container pb-8 pt-24" user={user}>
      <Seo
        title="Dashboard"
        description="Test"
      />
      <div ref={containerParent}>
        <p/>
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
