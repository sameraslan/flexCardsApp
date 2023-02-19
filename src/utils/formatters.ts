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