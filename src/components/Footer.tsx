export default function Footer() {
  return (
    <footer className="container py-4 px-8 sm:py-6">
      <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm transition-colors sm:text-center">
          © 2023{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-900 hover:underline dark:hover:text-white"
          >
            Samer Aslan
          </a>
        </span>
        <div className="mt-4 flex sm:mt-0">
        </div>
      </div>
    </footer>
  );
}
