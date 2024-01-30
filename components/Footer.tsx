import ContactMe from "@/components/ContactMe";
import { siteConfig } from "@/config/site";
import Link from "next/link";

const Footer = () => {
  const d = new Date();
  const currentYear = d.getFullYear();

  return (
    <footer>
      <div className="mt-16 pt-6 pb-2 flex flex-col items-center bg-black text-sm text-gray-400 border-t">
        <div className="mb-3 flex space-x-4">
          <ContactMe />
        </div>
        <div className="mb-2 flex space-x-2 flex-wrap justify-center">
          <Link href="https://weijunext.com/" target="_blank">
            J实验室
          </Link>
          <div>{" • "}</div>
          <Link href="https://githubbio.com/" target="_blank">
            Github Bio Generator
          </Link>
          <div>{" • "}</div>
          <Link href="https://smartexcel.cc/" target="_blank">
            Smart Excel
          </Link>
          <div>{" • "}</div>
          <Link href="https://nextjs.weijunext.com/" target="_blank">
            Next.js Practice
          </Link>
        </div>
        <div className="mb-2 flex space-x-2">
          <div>{`©${currentYear}`}</div>{" "}
          <Link href={siteConfig.url}>{siteConfig.creator}</Link>{" "}
          <div>All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
