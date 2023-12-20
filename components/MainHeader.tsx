import Image from "next/image";
import Link from "next/link";

export default function MainHeader() {
  return (
    <Link href="/" className="flex space-x-3">
      <Image
        alt="header text"
        src="/logo.svg"
        className="sm:w-12 sm:h-12 w-8 h-8"
        width={32}
        height={32}
      />
      <h1 className="sm:text-4xl text-2xl ml-2 tracking-tight font-extralight flex items-center">
        Smart Excel
      </h1>
    </Link>
  );
}
