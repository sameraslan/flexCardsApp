import { SiFacebook, SiGithub, SiInstagram, SiTwitter } from "react-icons/si";

type SocialLinkProps = {
  href: string;
  alt: string;
  children?: React.ReactNode;
};

const socialLinks = [
  {
    href: "https://facebook.com/teziovsky/",
    alt: "Teziovsky's facebook page",
    children: <SiFacebook />,
  },
  {
    href: "https://instagram.com/teziovsky/",
    alt: "Teziovsky's instagram page",
    children: <SiInstagram />,
  },
  {
    href: "https://twitter.com/teziovsky/",
    alt: "Teziovsky's twitter page",
    children: <SiTwitter />,
  },
  {
    href: "https://github.com/teziovsky/",
    alt: "Teziovsky's github page",
    children: <SiGithub />,
  },
];

const SocialLink = ({ href, alt, children }: SocialLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-4 transition-colors hover:text-gray-900 dark:hover:text-white"
  >
    {children}
    <span className="sr-only">{alt}</span>
  </a>
);

export default function Footer() {
  return (
    <footer className="container py-4 px-8 sm:py-6">
      <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm transition-colors sm:text-center">
          © 2022{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:teziovsky@gmail.com"
            className="transition-colors hover:text-gray-900 hover:underline dark:hover:text-white"
          >
            Samer Aslan
          </a>
        </span>
        <div className="mt-4 flex sm:mt-0">
          {socialLinks.map((link) => (
            <SocialLink key={link.href} {...link} />
          ))}
        </div>
      </div>
    </footer>
  );
}
