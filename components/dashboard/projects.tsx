import { api } from "@/lib/api";
import { cookies } from "next/headers";
import PaperPlaneLottie from "../lottie/paperplane";
import Link from "next/link";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import CardProject from "./card-project";

export default async function Projects() {
  const { data: projects, error } = await api.project.get({
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  if (error) {
    return <div>Error loading projects</div>;
  }

  return (
    <div className="my-10">
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <PaperPlaneLottie />
          <h2 className="font-semibold text-xl">
            You don&apos;t have any project feedback yet
          </h2>
          <Link href={"/dashboard/new-project"} className="mt-5">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create your first project
            </Button>
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <li key={project.id}>
              <CardProject project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
