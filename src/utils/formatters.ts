const DEFAULT_LOCALE = "en-US";

export function formatDate(
  date: Date | null,
  locale: string = DEFAULT_LOCALE,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

export function formatPrice(
  price: number | null,
  locale: string = DEFAULT_LOCALE,
  options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
  }
): string | null {
  if (!price) return "0";
  return new Intl.NumberFormat(locale, options).format(price);
}

export function formatMileage(
  mileage: number | null,
  locale: string = DEFAULT_LOCALE,
  options: Intl.NumberFormatOptions = {
    style: "unit",
    unit: "kilometer",
  }
): string | null {
  if (!mileage) return "0";
  return new Intl.NumberFormat(locale, options).format(mileage);
}

export function formatEngineCapacity(
  engineCapacity: number | null,
  locale: string = DEFAULT_LOCALE,
  options: Intl.NumberFormatOptions = {
    style: "unit",
    unit: "liter",
    unitDisplay: "short",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }
): string | null {
  if (!engineCapacity) return null;
  return new Intl.NumberFormat(locale, options).format(
    Math.round(engineCapacity / 100) / 10
  );
}
