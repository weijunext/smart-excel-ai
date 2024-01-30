import Link from "next/link";
import { BsGithub, BsTwitterX, BsWechat } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

import { SiBuymeacoffee, SiJuejin } from "react-icons/si";

const ContactMe = () => {
  return (
    <div className="mx-auto flex flex-row items-center">
      <Link
        href="mailto:weijunext@gmail.com"
        target="_blank"
        rel="noopener norefferer nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <MdEmail className="text-lg" />
      </Link>
      <Link
        href="https://github.com/weijunext"
        target="_blank"
        rel="noopener norefferer nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <BsGithub className="text-lg" />
      </Link>
      <Link
        href="https://twitter.com/weijunext"
        target="_blank"
        rel="noopener norefferer nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <BsTwitterX className="text-lg" />
      </Link>
      <Link
        href="https://juejin.cn/user/26044008768029"
        target="_blank"
        rel="noopener norefferer nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <SiJuejin className="text-lg" />
      </Link>
      <Link
        href="https://weijunext.com/make-a-friend"
        target="_blank"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <BsWechat className="text-lg" />
      </Link>
      <Link
        href="https://www.buymeacoffee.com/weijunext"
        target="_blank"
        rel="noopener norefferer nofollow"
        className="mx-3 flex max-w-[24px] flex-col items-center justify-center"
      >
        <SiBuymeacoffee className="text-lg" />
      </Link>
    </div>
  );
};
export default ContactMe;
