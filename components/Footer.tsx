import Github from "@/components/icons/GitHub";
import Twitter from "@/components/icons/Twitter";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 sm:mb-0 mb-3">
      <div>
        Powered by{" "}
        <a
          href="https://openai.com/blog/chatgpt"
          target="_blank"
          className="font-bold hover:underline transition underline-offset-2"
        >
          ChatGPT{" "}
        </a>
        and{" "}
        <a
          href="https://sdk.vercel.ai/docs"
          target="_blank"
          className="font-bold hover:underline transition underline-offset-2"
        >
          Vercel AI SDK
        </a>
      </div>
      <div className="flex gap-2 pb-4 sm:pb-0">
        <Link
          href="https://twitter.com/weijunext"
          className="group"
          aria-label="weijunext Twitter"
          target="_blank"
        >
          <Twitter className="h-5 w-5" />
        </Link>
        <Link
          href="https://github.com/weijunext/smart-excel-ai"
          className="group"
          aria-label="GitHub"
          target="_blank"
        >
          <Github />
        </Link>
      </div>
    </footer>
  );
}
