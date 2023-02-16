import cx from "classnames";
import { GiAutoRepair } from "react-icons/gi";
import { ImStatsDots } from "react-icons/im";
import { IoCarSportSharp } from "react-icons/io5";

const features = [
  {
    id: 1,
    title: "Card Management",
    description:
      "Test description",
    icon: <IoCarSportSharp className="h-8 w-8" />,
  },
  {
    id: 2,
    title: "Add card logging",
    description:
      "Test additions",
    icon: <GiAutoRepair className="h-8 w-8" />,
  },
  {
    id: 3,
    title: "Statistics",
    description:
      "Test statistics",
    icon: <ImStatsDots className="h-8 w-8" />,
  },
];

export default function Features() {
  return (
    <section className="py-20 even:bg-base-200">
      <div className="container mx-auto flex flex-col gap-12 px-6 py-10 md:gap-20">
        <h2 className="text-center text-3xl font-black capitalize leading-10 text-accent md:text-5xl lg:text-6xl">
          Explore our awesome{" "}
          <span className="underline decoration-secondary">features</span>
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:mt-12 xl:grid-cols-3 xl:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={cx("space-y-3 rounded-xl border-2 border-accent p-8", {
                "md:col-span-2 xl:col-span-1": index === features.length - 1,
              })}
            >
              <span className="inline-block text-accent">{feature.icon}</span>
              <h1 className="text-2xl font-semibold capitalize text-gray-700 dark:text-white">
                {feature.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
