import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      <h1 className="text-2xl font-heading font-bold">404 - Not Found</h1>
      <p className="font-sans">
        The page you are looking for does not exist. Please check the URL and
        try again.
      </p>
      <Link href="/" className="text-sm font-medium hover:underline mt-4">
        Go back to Home
      </Link>
    </div>
  );
}
