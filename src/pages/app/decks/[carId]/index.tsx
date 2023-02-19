import { zodResolver } from "@hookform/resolvers/zod";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CarType, EngineType, GearboxType } from "@prisma/client";
import AddRepair from "./repairs/add"
import { useState } from "react";
import cx from "classnames";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Link from "next/link";

import Seo from "@/components/Seo";
import Layout from "@/layouts/Layout";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import type { UpdateCarSchema } from "@/server/schema/car.schema";
import { updateCarSchema } from "@/server/schema/car.schema";
import { queryOnlyOnce } from "@/utils/react-query";
import { trpc } from "@/utils/trpc";
import {
  FiAlertCircle,
  FiEdit,
  FiPlus,
  FiRefreshCw,
  FiTool,
  FiTrash2,
} from "react-icons/fi";
import { AiFillPlusCircle } from "react-icons/ai";
import { FaLessThanEqual } from "react-icons/fa";

/*Now replace car id with deck id and showcase the flashcards the way it is rn*/

export default function EditCar({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [carsParent] = useAutoAnimate<HTMLDivElement>();

  const {
    data: cards,
  } = trpc.repair.getAll.useQuery(
    {
      carId: router.query.carId as string,
    },
    {
      enabled: Boolean(router.query.carId),
    }
  );

  const utils = trpc.useContext();
  const { mutate: deleteRepair } = trpc.repair.delete.useMutation({
    onSuccess: () => {
      toast.success("Repair deleted successfully!");
      utils.repair.getAll.invalidate();
    },
  });

  const { isLoading } = trpc.car.getOne.useQuery(
    { carId: router.query.carId as string },
    {
      onSuccess: (data) => {
        setValue("type", data?.type ?? CarType.Coupe);
        setValue("make", data?.make ?? "");
        setValue("model", data?.model ?? "");
        setValue("vin", data?.vin ?? "");
      },
      enabled: Boolean(router.query.carId),
      ...queryOnlyOnce,
    }
  );

  const {
    setValue,
  } = useForm<UpdateCarSchema["body"]>({
    resolver: zodResolver(updateCarSchema.shape.body),
  });

  const [addButton, setAddButton] = useState(false)

  

  /* Next step:
    - Make it so that I can create individual flashcards on this page
    - With a button to go left and right and then edit/delete individual ones
    - Can make this page a view/edit flashcards page
    - So do UI for this first with map stuff
    - Then use repair as template for backend array of flashcards
    - Boom done
  */

  /*Now I have it so that I can access and show repairs. Next, get the user to be able to add repairs */
  return (
    <Layout className="container pb-8 pt-24" user={user}>
      <Seo
        title="Update deck"
        description="Update deck"
      />
      {!isLoading ? (
        <>
          {/* <div className="mb-4 flex items-center justify-between">
            <h2 className="text-3xl">Update Deck</h2>
          </div> */}
          <div
        ref={carsParent}
        className="grid grid-cols-1 justify-center gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {cards?.map((card) => (
          <div className="card min-h-[240px] bg-base-200" key={card.id}>
            <div className="flex h-full flex-col p-5">
              <div className="flex flex-grow flex-col gap-1 pb-3">
                <h4 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
                  {card.title}
                </h4>
              </div>
              <p className="mb-4 flex-grow font-light text-gray-700 dark:text-gray-400">
                  {card.description}
              </p>
              <div className="flex items-end justify-center gap-2 pt-3">
                <div className="tooltip tooltip-success" data-tip="Edit card">
                  <Link
                    className="btn-outline btn-success btn h-10 min-h-[2.5rem] border-none px-3"
                    aria-label="Edit card"
                    href={`/app/decks/${card.carId}/repairs/${card.id}`}
                  >
                    <FiEdit size={18} />
                  </Link>
                </div>
                <div className="tooltip tooltip-error" data-tip="Delete card">
                  <button
                    className="btn-outline btn-error btn h-10 min-h-[2.5rem] border-none px-3"
                    aria-label="Delete card"
                    onClick={() => {
                      deleteRepair({
                        carId: card.carId,
                        repairId: card.id,
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
        </>
      ) : null}
      <div className="tooltip" data-tip="Add Card">
                  <button
                    className="btn-outline btn h-10 min-h-[2.5rem] border-none px-3"
                    aria-label="Add card button"
                    onClick={() => {
                      setAddButton(!addButton)
                    }}
                  >
                    <AiFillPlusCircle size={18} />
                  </button>
                </div>
      {addButton ?
        <AddRepair user={user}></AddRepair> : null}
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
