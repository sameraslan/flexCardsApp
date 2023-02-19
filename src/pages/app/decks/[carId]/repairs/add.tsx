import { zodResolver } from "@hookform/resolvers/zod";
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
import type { CreateRepairSchema } from "@/server/schema/repair.schema";
import { createRepairSchema } from "@/server/schema/repair.schema";
import { trpc } from "@/utils/trpc";

export default function AddRepair({
  user
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { mutate } = trpc.repair.create.useMutation({
    onSuccess: () => {
      toast.success("Card added successfully!");
      router.push({
        pathname: "/app/decks/[carId]",
        query: { carId: router.query.carId },
      });
      router.reload();
    },
  });

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRepairSchema["body"]>({
    resolver: zodResolver(createRepairSchema.shape.body),
  });

  const onSubmit: SubmitHandler<CreateRepairSchema["body"]> = (values) => {
    mutate({
      params: {
        carId: router.query.carId as string,
      },
      body: values,
    });
  };

  return (
    <Layout className="container pb-8 pt-24" user={user}>
      <Seo
        title="Add card"
        description="Test add card description"
      />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl">Add Card</h2>
      </div>
      <div className="card w-full bg-secondary dark:bg-primary">
        <div className="card-body flex flex-col gap-0 p-4 sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="form-control sm:col-span-2 lg:col-span-3">
              <label className="label" htmlFor="title">
                Question
              </label>
              <input
                id="title"
                type="text"
                className={cx(
                  "input-bordered input shadow-none focus:border-accent",
                  {
                    "input-error": Boolean(errors.title?.message),
                    "input-accent": !Boolean(errors.title?.message),
                  }
                )}
                {...register("title")}
              />
              <label htmlFor="title" className="label">
                <span className="label-text-alt text-error">
                  {errors.title?.message}
                </span>
              </label>
            </div>
            <div className="form-control sm:col-span-2 lg:col-span-3">
              <label className="label" htmlFor="description">
                Answer
              </label>
              <textarea
                id="description"
                rows={5}
                className={cx(
                  "textarea-bordered textarea shadow-none focus:border-accent",
                  {
                    "textarea-error": Boolean(errors.description?.message),
                    "textarea-accent": !Boolean(errors.description?.message),
                  }
                )}
                {...register("description")}
              />
              <label htmlFor="description" className="label">
                <span className="label-text-alt text-error">
                  {errors.description?.message}
                </span>
              </label>
            </div>
            <button
              className={cx(
                "btn-accent btn mx-auto mt-2 w-full max-w-sm sm:col-span-2 lg:col-span-3",
                {
                  "btn-disabled loading": isSubmitting,
                }
              )}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Adding card" : "Add Card"}
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
