import type { InferGetServerSidePropsType } from "next";
import type { ClientSafeProvider } from "next-auth/react";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { SiGoogle } from "react-icons/si";
import Seo from "@/components/Seo";


function getCallbackUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("callbackUrl") || `${window.location.origin}/`;
}

function providerIcon(providerName: ClientSafeProvider["name"]) {
  switch (providerName) {
    case "Google":
      return <SiGoogle className="h-4 w-4" />;
    default:
      return undefined;
  }
}

function providerButton(provider: ClientSafeProvider) {
  return (
    <button
      className="btn flex-grow"
      key={provider.name}
      onClick={() => signIn(provider.id, { callbackUrl: getCallbackUrl() })}
    >
      {providerIcon(provider.name)}
    </button>
  );
}

export default function Login({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {


  return (
    <>
      <Seo title="Sign in" description="Sign in page." />
      <div className="container flex min-h-screen items-center justify-center py-8">
        <div className="card w-full max-w-sm bg-secondary dark:bg-primary">
          <div className="card-body flex flex-col gap-0 p-0 sm:p-4">
            <div className="divider my-6">Sign in with</div>
            {providers ? (
              <div className="flex gap-2">
                {Object.values(providers).map((provider) => {
                  if (provider.name === "Credentials") return null;
                  return providerButton(provider);
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken();

  return {
    props: {
      providers,
      csrfToken,
    },
  };
}
