import Link from "next/link";
import NavbarAuth from "./auth/navbar-auth";

const navigation = [
  { name: "Docs", href: "/docs" },
  { name: "Pricing", href: "/pricing" },
] as const;

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b p-2 font-sans">
      <div className="flex items-center gap-5">
        <Link href="/" className="text-xl font-heading font-bold">
          WebFeedBack
        </Link>
        <nav>
          <ul className="flex gap-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:underline  "
              >
                {item.name}
              </Link>
            ))}
          </ul>
        </nav>
      </div>
      <NavbarAuth />
    </header>
  );
}
