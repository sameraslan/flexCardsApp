import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { Repair } from "@prisma/client";
import cx from "classnames";
import dayjs from "dayjs";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Link from "next/link";
import { FaCalendarCheck, FaPiggyBank, FaRoad } from "react-icons/fa";
import { FiAlertCircle, FiPlus, FiRefreshCw } from "react-icons/fi";

import Error from "@/components/Error";
import Loader from "@/components/Loader";
import Seo from "@/components/Seo";
import Layout from "@/layouts/Layout";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { formatDate, formatMileage, formatPrice } from "@/utils/formatters";
import { trpc } from "@/utils/trpc";

function TotalSpendStat(
  repairs: Omit<Repair, "id" | "createdAt" | "carId" | "updatedAt">[]
) {
  const totalSpend = repairs
    .map((repair) => repair.price)
    .reduce((a, b) => {
      if (repairs.length === 1) return b;
      if (typeof a !== "number") return null;
      if (typeof b !== "number") return null;
      return a + b;
    });

  return (
    <div className="stat">
      <div className="stat-figure text-accent">
        <FaPiggyBank className="inline-block h-8 w-8 stroke-current" />
      </div>
      <div className="stat-title whitespace-normal text-sm md:text-base">
        Total spend
      </div>
      <div className="stat-value whitespace-normal text-xl text-accent sm:text-2xl md:text-3xl lg:text-4xl">
        {formatPrice(totalSpend)}
      </div>
      <div className="stat-desc whitespace-normal text-xs md:text-sm">
        of {repairs.length} repairs
      </div>
    </div>
  );
}

function LastMileageStat(
  repairs: Omit<Repair, "id" | "createdAt" | "carId" | "updatedAt">[]
) {
  const allMileages = repairs.map((repair) => repair.mileage);
  const lastMileage = allMileages.reduce((a, b) => {
    if (repairs.length === 1) return b;
    if (typeof a !== "number") return null;
    if (typeof b !== "number") return null;
    return a > b ? a : b;
  });

  const firstMileage = allMileages.reduce((a, b) => {
    if (repairs.length === 1) return b;
    if (typeof a !== "number") return null;
    if (typeof b !== "number") return null;
    return b > a ? a : b;
  });

  return (
    <div className="stat">
      <div className="stat-figure text-accent">
        <FaRoad className="inline-block h-8 w-8 stroke-current" />
      </div>
      <div className="stat-title whitespace-normal text-sm md:text-base">
        Last mileage
      </div>
      <div className="stat-value whitespace-normal text-xl text-accent sm:text-2xl md:text-3xl lg:text-4xl">
        {formatMileage(lastMileage)}
      </div>
      {typeof firstMileage === "number" && typeof lastMileage === "number" ? (
        <div className="stat-desc whitespace-normal text-xs md:text-sm">
          {lastMileage - firstMileage !== 0
            ? `${formatMileage(
                lastMileage - firstMileage
              )} between first and last repair`
            : null}
        </div>
      ) : null}
    </div>
  );
}

function LastDateStat(
  repairs: Omit<Repair, "id" | "createdAt" | "carId" | "updatedAt">[]
) {
  const lastDate = repairs
    .map((repair) => repair.date)
    .reduce((a, b) => {
      if (!a) return b;
      if (!b) return null;
      return dayjs(a).isAfter(dayjs(b)) ? a : b;
    });

  const difference = dayjs().diff(lastDate, "day");

  return (
    <div className="stat">
      <div className="stat-figure text-accent">
        <FaCalendarCheck className="inline-block h-8 w-8 stroke-current" />
      </div>
      <div className="stat-title whitespace-normal text-sm md:text-base">
        Last repair date
      </div>
      <div className="stat-value whitespace-normal text-xl text-accent sm:text-2xl md:text-3xl lg:text-4xl">
        {formatDate(lastDate)}
      </div>
      <div className="stat-desc whitespace-normal text-xs md:text-sm">
        {difference === 0
          ? "Today"
          : difference === 1
          ? "Yesterday"
          : `${difference} days ago`}
      </div>
    </div>
  );
}

function DashboardList() {
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
    data: cars,
  } = trpc.car.getAllWithRepairs.useQuery();

  if (isLoading) {
    return (
      <Loader>
        <span className="text-gray-400">Loading dashboard...</span>
      </Loader>
    );
  }

  if (isError) {
    return (
      <Error message={error?.message}>
        <button onClick={() => refetch()} className="btn mt-4">
          <FiRefreshCw className="mr-2" size={20} />
          Try again
        </button>
      </Error>
    );
  }

  if (isSuccess && !cars?.length) {
    return (
      <div className="flex min-h-layout-inside-mobile flex-col items-center justify-center sm:min-h-layout-inside">
        <FiAlertCircle className="mx-auto mb-4" size={56} />
        <h2 className="text-center text-3xl">You don&apos;t have any cars</h2>
        <p className="text-center">Add your first car to show your dashboard</p>
        <Link href="/app/cars/add" className="btn mt-4">
          <FiPlus className="mr-2" size={20} />
          Add car
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 justify-center gap-16 sm:grid-cols-2 xl:grid-cols-3">
      {cars?.map((car, index) => (
        <div className="flex flex-col" key={car.id}>
          <h1 className="mb-4 text-center text-2xl md:text-3xl">
            {car.make} {car.model} {car.generation} {car.productionYear}
          </h1>
          <div
            className={cx("stats stats-vertical shadow", {
              "bg-primary dark:bg-neutral": index % 2 === 0,
              "bg-base-200": index % 2 !== 0,
            })}
          >
            {car.repairs.length ? (
              <>
                {TotalSpendStat(car.repairs)}
                {LastMileageStat(car.repairs)}
                {LastDateStat(car.repairs)}
              </>
            ) : (
              <div className="stat">
                <div className="stat-figure text-accent">
                  <FiAlertCircle className="inline-block h-8 w-8 stroke-current" />
                </div>
                <div className="stat-title whitespace-normal text-sm md:text-base">
                  No repairs
                </div>
                <div className="stat-value whitespace-normal text-xl text-accent sm:text-2xl md:text-3xl lg:text-4xl">
                  Please add repairs
                </div>
                <div className="stat-desc whitespace-normal text-xs md:text-sm">
                  To show statistics
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

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
        <DashboardList />
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
