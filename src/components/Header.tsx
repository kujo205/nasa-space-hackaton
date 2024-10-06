import Link from "next/link";
import { Earth } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full max-w-4xl mx-auto bg-background/70 border px-5 max-sm:mx-3 md:px-10 py-4 sticky top-2 rounded-lg backdrop-blur-sm z-10 my-xs">
      <Link className="flex group items-end" href="/">
        <h3 className="flex items-center flex-wrap scroll-m-20 text-2xl font-semibold tracking-tight group">
          <span className="text-primary group-hover:text-inherit">Space</span>
          <span className="inline text-gray-400 group-hover:text-inherit">
            Crammers.
          </span>
          <Earth className="text-gray-400 group-hover:text-white" size={20} />
        </h3>
      </Link>
      <Link href="/about">
        <h4 className="scroll-m-20 text-xl transition-colors font-semibold tracking-tight text-gray-400 hover:text-inherit">
          About
        </h4>
      </Link>
    </header>
  );
}
