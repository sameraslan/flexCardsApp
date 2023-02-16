const numbers = [
  {
    id: 1,
    label: "Repairs",
    value: "20k+",
  },
  {
    id: 2,
    label: "Cars",
    value: "1k+",
  },
  {
    id: 3,
    label: "Saved hours",
    value: "800+",
  },
  {
    id: 4,
    label: "Users",
    value: "300+",
  },
];

export default function Numbers() {
  return (
    <section className="pb-40 even:bg-base-200">
      <div className="mx-auto bg-gradient-to-t from-base-100 to-base-200 pb-20">
        <div className="container mx-auto flex w-full flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mt-20">
              <h2 className="text-center text-3xl font-black capitalize leading-10 text-accent md:text-5xl lg:text-6xl">
                By the{" "}
                <span className="underline decoration-secondary">numbers</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto -mt-8 flex items-center justify-center">
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-8 md:gap-10 lg:grid-cols-4 lg:gap-12">
          {numbers.map((number, index) => (
            <div
              key={index}
              className="flex h-40 w-40 flex-col items-center justify-center rounded-2xl bg-white shadow transition-transform sm:h-48 sm:w-48 sm:even:translate-y-8 sm:even:transform sm:hover:-translate-y-4 sm:hover:even:translate-y-4 md:h-52 md:w-52 lg:h-56 lg:w-56"
            >
              <h2 className="text-center text-2xl font-extrabold leading-10 text-gray-800 md:text-4xl lg:text-5xl">
                {number.value}
              </h2>
              <p className="mt-4 text-center text-base leading-none text-gray-600 md:text-lg lg:text-xl">
                {number.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
