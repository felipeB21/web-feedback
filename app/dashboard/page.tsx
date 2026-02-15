import Projects from "@/components/dashboard/projects";
import { session } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await session().then((session) => session?.user);
  if (!user) {
    redirect("/");
  }
  return (
    <div className="my-10 font-sans">
      <h1 className="text-3xl font-black font-heading">
        Welcome, {user?.name}!
      </h1>
      <p className="text-lg text-accent-foreground mt-2">
        Here you can manage your feedback, view analytics, and customize your
        settings.
      </p>
      <Projects />
    </div>
  );
}
