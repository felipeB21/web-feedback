import Link from "next/link";

export default function Navbar() {
  return (
    <header>
      <div>
        <Link href="/" className="text-2xl font-heading">
          WebFeedBack
        </Link>
      </div>
    </header>
  );
}
