import Github from "@/components/icons/GitHub";
import Twitter from "@/components/icons/Twitter";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-10 flex sm:flex-row flex-col justify-between px-12 py-10 sm:mb-0 mb-3 text-sm text-secondary-500">
      <div className="">
        <Link
          href="/zh"
          aria-current="page"
          className="inline-flex items-center gap-2 text-lg text-secondary-700  md:text-xl"
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={30}
            height={30}
            className="h-6 w-6"
          />
          Smart Excel
        </Link>
        <p className="mt-2">{siteConfig.description}</p>
        <p className="flex items-center my-3">
          <Link
            href=""
            aria-label="@weijunext Twitter"
            target="_blank"
            rel="noopener norefferer nofollow"
          >
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="https://github.com/weijunext/smart-excel-ai"
            className="ml-2"
            aria-label="GitHub"
            target="_blank"
            rel="noopener norefferer nofollow"
          >
            <Github />
          </Link>
        </p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-10 text-left md:mt-0 md:flex md:gap-24">
        <div>
          <h3 className="font-semibold text-secondary-700">Follow Me</h3>{" "}
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="https://twitter.com/weijunext"
                target="_black"
                rel="noopener norefferer nofollow"
                className="hover:text-primary-500 hover:underline"
              >
                Twitter / X
              </Link>
            </li>{" "}
            <li>
              <Link
                href="https://github.com/weijunext"
                target="_black"
                rel="noopener norefferer nofollow"
                className="hover:text-primary-500 hover:underline"
              >
                Github
              </Link>
            </li>{" "}
            <li>
              <a
                href="mailto:weijunext@gmail.com"
                className="hover:text-primary-500 hover:underline"
              >
                Email
              </a>
            </li>{" "}
          </ul>
        </div>{" "}
        <div>
          <h3 className="font-semibold text-secondary-700">Links</h3>{" "}
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="https://weijunext.com/"
                title="Wei Jun's blog, share knowledge about front-end, fullstack and AI"
                target="_blank"
                className="hover:text-primary-500 hover:underline"
              >
                J Blog
              </Link>
            </li>{" "}
            <li>
              <Link
                href="https://smartexcel.cc/"
                title={siteConfig.description}
                target="_black"
                className="hover:text-primary-500 hover:underline"
              >
                Smart Excel
              </Link>
            </li>{" "}
            <li>
              <Link
                href="https://nextjs.weijunext.com/"
                title="Sharing Technologies in the Next.js Ecosystem"
                target="_black"
                className="hover:text-primary-500 hover:underline"
              >
                Next.js Practice
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
