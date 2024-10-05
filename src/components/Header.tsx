import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full max-w-4xl mx-auto bg-background/50 border px-10 py-4 sticky top-2 rounded-lg backdrop-blur-sm z-10 my-xs">
      <Link href="/">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight group">
          <span className="text-primary group-hover:text-inherit">Space</span><span className="text-secondary group-hover:text-inherit">Crammers</span>
        </h3>
      </Link>
      <Link href="/about">
        <h4 className="scroll-m-20 text-xl transition-colors font-semibold tracking-tight text-secondary hover:text-inherit">
          About
        </h4>
      </Link>
    </header>
  );
}
