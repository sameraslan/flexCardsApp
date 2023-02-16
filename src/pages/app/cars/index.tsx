import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { Fragment, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiEdit,
  FiPlus,
  FiRefreshCw,
  FiTool,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";

import Error from "@/components/Error";
import Loader from "@/components/Loader";
import Seo from "@/components/Seo";
import Layout from "@/layouts/Layout";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { formatEngineCapacity } from "@/utils/formatters";
import { trpc } from "@/utils/trpc";

function CarsList() {
  const [carsParent] = useAutoAnimate<HTMLDivElement>();

  const completeButtonRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    carId: "",
  });

  const utils = trpc.useContext();
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
    data: cars,
  } = trpc.car.getAll.useQuery();

  const { mutate: deleteCar } = trpc.car.delete.useMutation({
    onSuccess: () => {
      toast.success("Car deleted successfully!");
      utils.car.getAll.invalidate();
    },
  });

  if (isLoading) {
    return (
      <Loader>
        <span className="text-gray-400">Loading cars...</span>
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
        <p className="text-center">
          Add your first car to start tracking your repairs
        </p>
        <Link href="/app/cars/add" className="btn mt-4">
          <FiPlus className="mr-2" size={20} />
          Add Deck
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl">Your Decks</h2>
        <Link href="/app/cars/add" className="btn">
          <FiPlus className="mr-2" size={20} />
          Add Deck
        </Link>
      </div>
      <div
        ref={carsParent}
        className="grid grid-cols-1 justify-center gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {cars?.map((car) => (
          <div className="card min-h-[240px] bg-base-200" key={car.id}>
            <div className="flex h-full flex-col divide-y divide-secondary p-5">
              <div className="flex flex-grow flex-col gap-5 pb-3">
                <div className="flex flex-col gap-1">
                  <h4 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
                    {car.make} {car.model} {car.generation} {car.productionYear}
                  </h4>
                  <p className="font-light text-gray-700 dark:text-gray-400">
                    {car.type}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p>
                    <span className="font-medium">Engine:</span>{" "}
                    {car.engineType} {formatEngineCapacity(car.engineCapacity)}{" "}
                    {car.enginePower ? `${car.enginePower} HP` : null}
                  </p>
                  {car.gearboxType ? (
                    <p>
                      <span className="font-medium">Gearbox:</span>{" "}
                      {car.gearboxType}
                    </p>
                  ) : null}
                  {car.vin ? (
                    <p className="mb-2">
                      <span className="font-medium">VIN:</span> {car.vin}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-end justify-center gap-2 pt-3">
                {/* <div
                  className="tooltip tooltip-info"
                  data-tip="Show car repairs"
                >
                  <Link
                    className="btn-outline btn-info btn h-10 min-h-[2.5rem] border-none px-3"
                    aria-label="Show car repairs"
                    href={`/app/cars/${car.id}/repairs`}
                  >
                    <FiTool size={18} />
                  </Link>
                </div> */}
                <div className="tooltip tooltip-success" data-tip="Edit Deck">
                  <Link
                    className="btn-outline btn-success btn h-10 min-h-[2.5rem] border-none px-3"
                    aria-label="Edit car"
                    href={`/app/cars/${car.id}`}
                  >
                    <FiEdit size={18} />
                  </Link>
                </div>
                <div className="tooltip tooltip-error" data-tip="Delete Deck">
                  <button
                    className="btn-outline btn-error btn h-10 min-h-[2.5rem] border-none px-3"
                    aria-label="Delete car"
                    onClick={() => {
                      setDeleteModal({
                        visible: true,
                        carId: car.id,
                      });
                    }}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Transition
        show={Boolean(deleteModal.visible)}
        as={Fragment}
        enter="transition duration-150 ease"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-300 ease"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Dialog
          open={Boolean(deleteModal.visible)}
          initialFocus={completeButtonRef}
          className="relative z-50"
          onClose={() =>
            setDeleteModal({
              visible: false,
              carId: "",
            })
          }
        >
          <div className="fixed inset-0 bg-base-100/90" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4 ">
            <Dialog.Panel className="rounded-lg bg-base-200 p-6 text-center shadow">
              <FiAlertCircle className="mx-auto mb-4" size={56} />
              <Dialog.Title className="mb-2 text-xl font-normal text-accent">
                Delete deck?
              </Dialog.Title>
              <Dialog.Description className="mb-5 text-base font-normal">
                This will permanently delete this deck, including all of its cards.
              </Dialog.Description>
              <button
                className="btn-ghost btn mr-2"
                onClick={() => {
                  setDeleteModal({
                    visible: false,
                    carId: "",
                  });
                }}
              >
                No, cancel
              </button>
              <button
                ref={completeButtonRef}
                className="btn-error btn"
                onClick={() => {
                  deleteCar({ carId: deleteModal.carId });
                  setDeleteModal({
                    visible: false,
                    carId: "",
                  });
                }}
              >
                Yes I&apos;m sure
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default function CarsListWrapper({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [containerParent] = useAutoAnimate<HTMLDivElement>();

  return (
    <Layout className="container pb-8 pt-24" user={user}>
      <Seo
        title="Cards"
        description="Welcome to the decks page"
      />
      <div ref={containerParent}>
        <CarsList />
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
