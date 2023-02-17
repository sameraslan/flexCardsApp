import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Dialog, Transition } from "@headlessui/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { FiAlertCircle, FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

import Loader from "@/components/Loader";
import Seo from "@/components/Seo";
import Layout from "@/layouts/Layout";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { formatDate, formatMileage, formatPrice } from "@/utils/formatters";
import { trpc } from "@/utils/trpc";

function RepairsList() {
  const [repairsParent] = useAutoAnimate<HTMLDivElement>();

  const completeButtonRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    carId: "",
    repairId: "",
  });

  const { query } = useRouter();
  const utils = trpc.useContext();
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: repairs,
  } = trpc.repair.getAll.useQuery(
    {
      carId: query.carId as string,
    },
    {
      enabled: Boolean(query.carId),
    }
  );

  const { mutate: deleteRepair } = trpc.repair.delete.useMutation({
    onSuccess: () => {
      toast.success("Repair deleted successfully!");
      utils.repair.getAll.invalidate();
    },
  });

  if (isLoading) {
    return (
      <Loader>
        <span className="text-gray-400">Loading repairs...</span>
      </Loader>
    );
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isSuccess && !repairs?.length) {
    return (
      <div className="flex min-h-layout-inside-mobile flex-col items-center justify-center sm:min-h-layout-inside">
        <FiAlertCircle className="mx-auto mb-4" size={56} />
        <h2 className="text-center text-3xl">
          You don&apos;t have any repairs
        </h2>
        <p className="text-center">
          Add your first repair by clicking the button below.
        </p>
        <Link
          href={`//app/decks/${encodeURIComponent(
            query.carId as string
          )}/repairs/add`}
          className="btn mt-4"
        >
          <FiPlus className="mr-2" size={20} />
          Add repair
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl">Your repairs</h2>
        <Link
          href={`//app/decks/${encodeURIComponent(
            query.carId as string
          )}/repairs/add`}
          className="btn"
        >
          <FiPlus className="mr-2" size={20} />
          Add repair
        </Link>
      </div>
      <div
        ref={repairsParent}
        className="grid grid-cols-1 justify-center gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {repairs.map((repair) => (
          <div className="card min-h-[240px] bg-base-200" key={repair.id}>
            <div className="flex h-full flex-col divide-y divide-secondary p-5">
              <div className="flex flex-grow flex-col gap-1 pb-3">
                <h4 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
                  {repair.title}
                </h4>
                <p className="mb-4 flex-grow font-light text-gray-700 dark:text-gray-400">
                  {repair.description}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(repair.date)}
                </p>
                <p>
                  <span className="font-medium">Price:</span>{" "}
                  {formatPrice(repair.price)}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Mileage:</span>{" "}
                  {formatMileage(repair.mileage)}
                </p>
              </div>
              <div className="flex items-end justify-center gap-2 pt-3">
                <div className="tooltip tooltip-success" data-tip="Edit repair">
                  <Link
                    className="btn-outline btn-success btn h-10 min-h-[2.5rem] border-none px-3"
                    aria-label="Edit repair"
                    href={`//app/decks/${repair.carId}/repairs/${repair.id}`}
                  >
                    <FiEdit size={18} />
                  </Link>
                </div>
                <div className="tooltip tooltip-error" data-tip="Delete repair">
                  <button
                    className="btn-outline btn-error btn h-10 min-h-[2.5rem] border-none px-3"
                    aria-label="Delete repair"
                    onClick={() => {
                      setDeleteModal({
                        visible: true,
                        carId: repair.carId,
                        repairId: repair.id,
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
              repairId: "",
            })
          }
        >
          <div className="fixed inset-0 bg-base-100/90" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4 ">
            <Dialog.Panel className="rounded-lg bg-base-200 p-6 text-center shadow">
              <FiAlertCircle className="mx-auto mb-4" size={56} />
              <Dialog.Title className="mb-2 text-xl font-normal text-accent">
                Delete repair?
              </Dialog.Title>
              <Dialog.Description className="mb-5 text-base font-normal">
                This will permanently delete this repair.
              </Dialog.Description>
              <button
                className="btn-ghost btn mr-2"
                onClick={() => {
                  setDeleteModal({
                    visible: false,
                    carId: "",
                    repairId: "",
                  });
                }}
              >
                No, cancel
              </button>
              <button
                ref={completeButtonRef}
                className="btn-error btn"
                onClick={() => {
                  deleteRepair({
                    carId: deleteModal.carId,
                    repairId: deleteModal.repairId,
                  });
                  setDeleteModal({
                    visible: false,
                    carId: "",
                    repairId: "",
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

export default function RepairsListWrapper({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [containerParent] = useAutoAnimate<HTMLDivElement>();

  return (
    <Layout className="container pb-8 pt-24" user={user}>
      <Seo
        title="List of additions"
        description="Test list of additions"
      />
      <div ref={containerParent}>
        <RepairsList />
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
