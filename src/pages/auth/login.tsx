import { zodResolver } from "@hookform/resolvers/zod";
import cx from "classnames";
import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ClientSafeProvider } from "next-auth/react";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { DiGithubBadge } from "react-icons/di";
import { SiFacebook, SiGoogle, SiTwitter } from "react-icons/si";
import { toast } from "react-toastify";

import Seo from "@/components/Seo";
import type { LoginSchema } from "@/server/schema/auth.schema";
import { loginSchema } from "@/server/schema/auth.schema";

function getCallbackUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("callbackUrl") || `${window.location.origin}/`;
}

function providerIcon(providerName: ClientSafeProvider["name"]) {
  switch (providerName) {
    case "Google":
      return <SiGoogle className="h-4 w-4" />;
    case "Facebook":
      return <SiFacebook className="h-4 w-4" />;
    case "Twitter":
      return <SiTwitter className="h-4 w-4" />;
    case "GitHub":
      return <DiGithubBadge className="h-6 w-6" />;
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
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (values) => {
    const result = await signIn("credentials", {
      redirect: false,
      ...values,
    });

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    if (result?.ok) {
      toast.success("Logged in successfully!");
      router.push(result?.url ? result.url : "/app");
      return;
    }
  };

  return (
    <>
      <Seo title="Sign in" description="Sign in page." />
      <div className="container flex min-h-screen items-center justify-center py-8">
        <div className="card w-full max-w-sm bg-secondary dark:bg-primary">
          <div className="card-body flex flex-col gap-0 p-0 sm:p-4">
            {/* <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-6 flex flex-col gap-2"
            >
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
              {/* <div className="form-control">
                <label className="label" htmlFor="email">
                  <span
                    className={cx("label-text", {
                      "text-error": Boolean(errors.email?.message),
                    })}
                  >
                    Your email
                  </span>
                </label>
                <input
                  id="email"
                  type="text"
                  className={cx(
                    "input-bordered input shadow-none focus:border-accent",
                    {
                      "input-error": Boolean(errors.email?.message),
                      "input-accent": !Boolean(errors.email?.message),
                    }
                  )}
                  placeholder="example@gmail.com"
                  {...register("email")}
                />
                <label htmlFor="email" className="label">
                  <span className="label-text-alt text-error">
                    {errors.email?.message}
                  </span>
                </label>
              </div>
              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span
                    className={cx("label-text", {
                      "text-error": Boolean(errors.password?.message),
                    })}
                  >
                    Your password
                  </span>
                </label>
                <input
                  id="password"
                  type="password"
                  className={cx(
                    "input-bordered input shadow-none focus:border-accent",
                    {
                      "input-error": Boolean(errors.password?.message),
                      "input-accent": !Boolean(errors.password?.message),
                    }
                  )}
                  {...register("password")}
                />
                <label htmlFor="password" className="label">
                  <span className="label-text-alt text-error">
                    {errors.password?.message}
                  </span>
                </label>
              </div>
              <button
                className={cx("btn-accent btn mt-2", {
                  "btn-disabled loading": isSubmitting,
                })}
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Loading" : "Sign in"}
              </button>
            </form> */}
            {/* <p className="text-center">
              Don&apos;t have an account?{" "}
              <Link className="link-hover link" href="/auth/register">
                Register
              </Link>
            </p> */}
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
