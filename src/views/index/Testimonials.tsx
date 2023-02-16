import cx from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Mary Smith",
    title: "Marketing Manager at XYZ Corporation",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e2",
    text: "Test test",
  }
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const activeTestimonial = index >= 0 ? testimonials[index] : null;

  useEffect(() => {
    const carousel = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex === testimonials.length - 1) return 0;
        return prevIndex + 1;
      });
    }, 10000);

    return () => clearTimeout(carousel);
  }, []);

  if (!activeTestimonial) return null;

  return (
    <section className="py-32 even:bg-base-200">
      <div className="container">
        <div className="mx-auto flex min-h-[300px] max-w-xl flex-col items-center justify-center gap-6">
          <h2 className="mb-4 text-center text-4xl font-black capitalize leading-10 text-accent md:text-5xl lg:text-6xl">
            Testimonials
          </h2>
          {activeTestimonial ? (
            <>
              <p className="text-center font-serif text-base italic text-accent sm:text-xl md:text-2xl">
                &quot;{activeTestimonial.text}&quot;
              </p>
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={activeTestimonial.avatar}
                  alt={activeTestimonial.name}
                  width={64}
                  height={64}
                  className="mb-2 h-12 w-12 rounded-full sm:h-14 sm:w-14 md:h-16 md:w-16"
                />
                <h3 className="text-sm font-bold text-accent sm:text-base md:text-lg">
                  {activeTestimonial.name}
                </h3>
                <p className="text-center text-xs font-medium text-accent/60 sm:text-sm md:text-base">
                  {activeTestimonial.title}
                </p>
              </div>
            </>
          ) : null}
          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                className={cx(
                  "h-6 w-6 before:block before:h-1 before:w-6 before:rounded-full before:transition-colors before:content-[''] hover:before:bg-accent",
                  {
                    "before:bg-primary": idx !== index,
                    "before:bg-secondary": idx === index,
                  }
                )}
                aria-label={`Show testimonial number ${idx + 1}`}
                onClick={() => setIndex(idx)}
                key={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
