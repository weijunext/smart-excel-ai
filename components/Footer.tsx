import SocialIcon from "@/components/social-icons";
import { siteConfig } from "@/config/site";
import Link from "next/link";

const Footer = () => {
  const d = new Date();
  const currentYear = d.getFullYear();

  return (
    <footer>
      <div className="mt-16 pt-6 pb-2 flex flex-col items-center bg-black text-sm text-gray-400 border-t">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href="mailto:weijunext@gmail.com" size={6} />
          <SocialIcon
            kind="github"
            href="https://github.com/weijunext"
            size={6}
          />
          <SocialIcon
            kind="twitter"
            href="https://twitter.com/BigYeChengPu"
            size={6}
          />
          <SocialIcon
            kind="twitterX"
            href="https://twitter.com/weijunext"
            size={6}
          />
          <SocialIcon
            kind="jueJin"
            href="https://juejin.cn/user/26044008768029"
            size={6}
          />
          <SocialIcon
            kind="weChat"
            href="https://weijunext.com/make-a-friend"
            size={6}
          />
        </div>
        <div className="mb-2 flex space-x-2">
          <Link href="https://weijunext.com/" target="_blank">
            J实验室
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
          <Link href={siteConfig.url}>{siteConfig.creator}</Link>
          <div>{" • "}</div>
          <div>{`© ${currentYear}`}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
