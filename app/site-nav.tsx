import Link from "next/link";
import { filtersToQuery } from "@/lib/parse-filters";
import type { JobFilters } from "@/lib/types";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/aging", label: "Aging report" },
  { href: "/listings", label: "Listings" },
];

export function SiteNav({
  pathname,
  filters,
}: {
  pathname: string;
  filters: JobFilters;
}) {
  const query = filtersToQuery(filters);
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium tracking-wide text-teal-800 uppercase">
            Contract watch
          </p>
          <p className="text-sm text-zinc-600">
            Contractors · VA · NY/NJ/CT · NC
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={`${link.href}${query}`}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "bg-zinc-950 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
