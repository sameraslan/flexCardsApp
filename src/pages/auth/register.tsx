import { zodResolver } from "@hookform/resolvers/zod";
import cx from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Seo from "@/components/Seo";
import type { RegisterSchema } from "@/server/schema/auth.schema";
import { registerSchema } from "@/server/schema/auth.schema";
import { trpc } from "@/utils/trpc";

export default function Register() {
  const router = useRouter();

  const { mutate } = trpc.auth.register.useMutation({
    onSuccess: async () => {
      const values = getValues();

      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.ok) {
        toast.success("Account created successfully!");
        router.push(result?.url ? result.url : "/app");
        return;
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterSchema> = async (values) => {
    mutate(values);
  };

  return (
    <>
      <Seo title="Sign in" description="Sign in page." />
      <div className="container flex min-h-screen items-center justify-center py-8">
        <div className="card w-full max-w-sm bg-secondary dark:bg-primary">
          <div className="card-body flex flex-col gap-0 p-4 sm:p-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <div className="form-control">
                <label className="label" htmlFor="firstName">
                  <span
                    className={cx("label-text", {
                      "text-error": Boolean(errors.firstName?.message),
                    })}
                  >
                    First name
                  </span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  className={cx(
                    "input-bordered input shadow-none focus:border-accent",
                    {
                      "input-error": Boolean(errors.firstName?.message),
                      "input-accent": !Boolean(errors.firstName?.message),
                    }
                  )}
                  {...register("firstName")}
                />
                <label htmlFor="firstName" className="label">
                  <span className="label-text-alt text-error">
                    {errors.firstName?.message}
                  </span>
                </label>
              </div>
              <div className="form-control">
                <label className="label" htmlFor="lastName">
                  <span
                    className={cx("label-text", {
                      "text-error": Boolean(errors.lastName?.message),
                    })}
                  >
                    Last name
                  </span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  className={cx(
                    "input-bordered input shadow-none focus:border-accent",
                    {
                      "input-error": Boolean(errors.lastName?.message),
                      "input-accent": !Boolean(errors.lastName?.message),
                    }
                  )}
                  {...register("lastName")}
                />
                <label htmlFor="lastName" className="label">
                  <span className="label-text-alt text-error">
                    {errors.lastName?.message}
                  </span>
                </label>
              </div>
              <div className="form-control">
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
                {isSubmitting ? "Loading" : "Register"}
              </button>
            </form>
            <div className="divider"></div>
            <p className="text-center">
              Already have an account?{" "}
              <Link className="link-hover link" href="/auth/login">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
