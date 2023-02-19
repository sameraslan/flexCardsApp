import { zodResolver } from "@hookform/resolvers/zod";
import { CarType, EngineType, GearboxType } from "@prisma/client";
import cx from "classnames";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Seo from "@/components/Seo";
import Layout from "@/layouts/Layout";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import type { CreateCarSchema } from "@/server/schema/car.schema";
import { createCarSchema } from "@/server/schema/car.schema";
import { trpc } from "@/utils/trpc";

export default function AddCar({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const { mutate } = trpc.car.create.useMutation({
    onSuccess: () => {
      toast.success("Deck added successfully!");
      router.push("/app/decks");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCarSchema>({
    resolver: zodResolver(createCarSchema),
  });

  const onSubmit: SubmitHandler<CreateCarSchema> = (values) => {
    mutate(values);
  };

  return (
    <Layout className="container pb-8 pt-24" user={user}>
      <Seo
        title="Add cards"
        description="Test"
      />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl">Add Deck</h2>
      </div>
      <div className="card w-full bg-secondary dark:bg-primary">
        <div className="card-body flex flex-col gap-0 p-4 sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            <div className="form-control">
              <label className="label" htmlFor="make">
                <span
                  className={cx("label-text", {
                    "text-error": Boolean(errors.make?.message),
                  })}
                >
                  Deck Title
                </span>
              </label>
              <input
                id="make"
                type="text"
                defaultValue=""
                className={cx(
                  "input-bordered input shadow-none focus:border-accent",
                  {
                    "input-error": Boolean(errors.make?.message),
                    "input-accent": !Boolean(errors.make?.message),
                  }
                )}
                placeholder="Deck Title"
                {...register("make")}
              />
              <label htmlFor="make" className="label">
                <span className="label-text-alt text-error">
                  {errors.make?.message}
                </span>
              </label>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="model">
                <span
                  className={cx("label-text", {
                    "text-error": Boolean(errors.model?.message),
                  })}
                >
                  Deck Description
                </span>
              </label>
              <input
                id="model"
                type="text"
                defaultValue=""
                className={cx(
                  "input-bordered input shadow-none focus:border-accent",
                  {
                    "input-error": Boolean(errors.model?.message),
                    "input-accent": !Boolean(errors.model?.message),
                  }
                )}
                placeholder="Description"
                {...register("model")}
              />
              <label htmlFor="model" className="label">
                <span className="label-text-alt text-error">
                  {errors.model?.message}
                </span>
              </label>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="productionYear">
                <span
                  className={cx("label-text", {
                    "text-error": Boolean(errors.productionYear?.message),
                  })}
                >
                  Year (defaulted 2023)
                </span>
              </label>
              <input
                id="productionYear"
                type="number"
                defaultValue={new Date().getFullYear()}
                className={cx(
                  "input-bordered input shadow-none focus:border-accent",
                  {
                    "input-error": Boolean(errors.productionYear?.message),
                    "input-accent": !Boolean(errors.productionYear?.message),
                  }
                )}
                {...register("productionYear", {
                  valueAsNumber: true,
                })}
              />
              <label htmlFor="productionYear" className="label">
                <span className="label-text-alt text-error">
                  {errors.productionYear?.message}
                </span>
              </label>
            </div>
            <button
              className={cx(
                "btn-accent btn mx-auto mt-2 w-full max-w-sm sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5",
                {
                  "btn-disabled loading": isSubmitting,
                }
              )}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Adding deck" : "Add Deck"}
            </button>
          </form>
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
