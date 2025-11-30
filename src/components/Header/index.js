import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold">Amadeus</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
