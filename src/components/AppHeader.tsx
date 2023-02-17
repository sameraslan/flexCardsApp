import { Disclosure, Menu, Transition } from "@headlessui/react";
import type { User } from "@prisma/client";
import cx from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { Fragment } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

import Logo from "@/assets/images/svg/FlashLogo.svg";

type Props = {
  user?: User;
};

const links = [
  { name: "Dashboard", href: "/app", exact: true },
  { name: "My Decks", href: "//app/decks" },
];

export default function Header({ user }: Props) {
  const router = useRouter();
  return (
    <Disclosure
      as="header"
      className="fixed inset-x-0 top-0 z-10 bg-base-100 shadow-sm shadow-primary"
    >
      {({ open }) => (
        <>
          <div className="container px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="swap-rotate swap inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-primary hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  <FiX
                    className={cx("absolute h-6 w-6", {
                      "swap-on": !open,
                      "swap-off": open,
                    })}
                    aria-hidden="true"
                  />
                  <FiMenu
                    className={cx("absolute h-6 w-6", {
                      "swap-on": open,
                      "swap-off": !open,
                    })}
                    aria-hidden="true"
                  />
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link className="group flex items-center gap-3" href="/">
                    <Logo className="h-8 w-8 group-hover:animate-spin-slow" />
                    <h1 className="flex flex-col items-center">
                      <span className="text-xl leading-5 tracking-wide">
                        FlexCards
                      </span>
                      {/* <span className="text-xs leading-[14px] tracking-tighter">
                        Yelaoooo
                      </span> */}
                    </h1>
                  </Link>
                </div>
                <nav className="hidden sm:ml-6 sm:flex sm:flex-1 sm:justify-self-center">
                  <ul className="flex space-x-4">
                    {links.map((item) => (
                      <li className="flex" key={item.name}>
                        <Link
                          href={item.href}
                          className={cx(
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral hover:text-white",
                            {
                              "!bg-primary !text-white":
                                router.pathname === item.href,
                              "bg-base-200":
                                !item.exact &&
                                router.pathname !== item.href &&
                                router.pathname.startsWith(item.href),
                            }
                          )}
                          aria-current={router.pathname === item.href && "page"}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              {user ? (
                <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="group flex items-center gap-2 p-2 text-sm">
                      <span className="sr-only">Open user menu</span>
                      <p className="hidden transition-colors group-hover:text-accent sm:block">
                        {user.name}
                      </p>
                      {user.image ? (
                        <Image
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full transition-all group-hover:outline-none group-hover:ring-2 group-hover:ring-white group-hover:ring-offset-2 group-hover:ring-offset-gray-800"
                          src={user.image}
                          alt=""
                        />
                      ) : (
                        <FaUserCircle className="h-8 w-8 rounded-full transition-all group-hover:outline-none group-hover:ring-2 group-hover:ring-white group-hover:ring-offset-2 group-hover:ring-offset-gray-800" />
                      )}
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/app/profile"
                              className={cx(
                                "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300",
                                {
                                  "bg-gray-100 dark:bg-gray-600/30": active,
                                }
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/app/settings"
                              className={cx(
                                "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300",
                                {
                                  "bg-gray-100 dark:bg-gray-600/30": active,
                                }
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut()}
                              className={cx(
                                active && "bg-red-100 dark:bg-red-700/10",
                                "block w-full px-4 py-2 text-left text-sm text-red-700"
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : null}
            </div>
          </div>
          <Transition
            as={Fragment}
            enter="transition duration-300 ease"
            enterFrom="transform opacity-0 -translate-x-full"
            enterTo="transform opacity-100 translate-x-0"
            leave="transition duration-500 ease"
            leaveFrom="transform opacity-100 translate-x-0"
            leaveTo="transform opacity-0 -translate-x-full"
          >
            <Disclosure.Panel
              as="nav"
              className="fixed inset-x-0 top-[64px] bottom-0 overflow-hidden sm:hidden"
            >
              <ul className="container h-full space-y-4 rounded-md bg-white py-8 shadow-lg ring-black ring-opacity-5 dark:bg-base-100">
                {links.map((item) => (
                  <li key={item.name} className="flex text-center">
                    <Disclosure.Button
                      as={Link}
                      href={item.href}
                      className={cx(
                        "w-full rounded-md px-3 py-6 text-xl font-medium text-secondary transition-colors hover:bg-primary hover:text-white",
                        {
                          "!bg-neutral !text-white":
                            router.pathname === item.href,
                          "bg-base-200":
                            !item.exact &&
                            router.pathname !== item.href &&
                            router.pathname.startsWith(item.href),
                        }
                      )}
                      aria-current={
                        router.pathname === item.href ? "page" : undefined
                      }
                    >
                      {item.name}
                    </Disclosure.Button>
                  </li>
                ))}
              </ul>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
