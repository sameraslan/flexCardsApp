import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-32 even:bg-base-200 sm:py-40 md:py-30">
      <div className="container grid md:grid-cols-2 md:gap-8 xl:gap-0">
        <div className="mr-auto place-self-center">
          <h2 className="mb-4 max-w-2xl text-3xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl lg:text-6xl">
            Ready for flashcards?
          </h2>
          {/* <p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
            Flash woo
          </p> */}
          {/* <Link className="btn-outline btn w-full sm:w-auto" href="/app">
            Get Started
          </Link> */}
        </div>
      </div>
    </section>
  );
}
