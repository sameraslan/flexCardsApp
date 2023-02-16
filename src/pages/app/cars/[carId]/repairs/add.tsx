import { zodResolver } from "@hookform/resolvers/zod";
import cx from "classnames";
import dayjs from "dayjs";
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
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const { data: lastMileage } = trpc.repair.getHighestMileage.useQuery(
    {
      carId: router.query.carId as string,
    },
    {
      onSuccess: (data) => {
        setValue("mileage", data.mileage ?? 0);
      },
      enabled: Boolean(router.query.carId),
    }
  );

  const { data: firstDate } = trpc.repair.getFirstRepairDate.useQuery(
    {
      carId: router.query.carId as string,
    },
    {
      enabled: Boolean(router.query.carId),
    }
  );

  const { mutate } = trpc.repair.create.useMutation({
    onSuccess: () => {
      toast.success("Repair added successfully!");
      router.push({
        pathname: "/app/cars/[carId]/repairs",
        query: { carId: router.query.carId },
      });
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
        <h2 className="text-3xl">Add repair</h2>
      </div>
      <div className="card w-full bg-secondary dark:bg-primary">
        <div className="card-body flex flex-col gap-0 p-4 sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="form-control sm:col-span-2 lg:col-span-3">
              <label className="label" htmlFor="title">
                Title
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
                Description
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
            <div className="form-control">
              <label className="label" htmlFor="price">
                Price
              </label>
              <input
                id="price"
                type="number"
                defaultValue={0}
                className={cx(
                  "input-bordered input shadow-none focus:border-accent",
                  {
                    "input-error": Boolean(errors.price?.message),
                    "input-accent": !Boolean(errors.price?.message),
                  }
                )}
                {...register("price", {
                  valueAsNumber: true,
                })}
              />
              <label htmlFor="price" className="label">
                <span className="label-text-alt text-error">
                  {errors.price?.message}
                </span>
              </label>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                type="date"
                defaultValue={dayjs().format("YYYY-MM-DD")}
                min={
                  firstDate?.date
                    ? dayjs(firstDate.date).format("YYYY-MM-DD")
                    : undefined
                }
                max={dayjs().format("YYYY-MM-DD")}
                className={cx(
                  "input-bordered input shadow-none focus:border-accent",
                  {
                    "input-error": Boolean(errors.date?.message),
                    "input-accent": !Boolean(errors.date?.message),
                  }
                )}
                {...register("date")}
              />
              <label htmlFor="date" className="label">
                <span className="label-text-alt text-error">
                  {errors.date?.message}
                </span>
              </label>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="mileage">
                Mileage
              </label>
              <input
                id="mileage"
                type="number"
                defaultValue={0}
                min={lastMileage?.mileage ?? 0}
                className={cx(
                  "input-bordered input shadow-none focus:border-accent",
                  {
                    "input-error": Boolean(errors.mileage?.message),
                    "input-accent": !Boolean(errors.mileage?.message),
                  }
                )}
                {...register("mileage", {
                  valueAsNumber: true,
                })}
              />
              <label htmlFor="mileage" className="label">
                <span className="label-text-alt text-error">
                  {errors.mileage?.message}
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
              {isSubmitting ? "Adding repair" : "Add repair"}
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
