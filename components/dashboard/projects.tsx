import { api } from "@/lib/api";
import { cookies } from "next/headers";
import PaperPlaneLottie from "../lottie/paperplane";
import Link from "next/link";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Card } from "../ui/card";

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
          <h2 className="font-semibold">
            You don&apos;t have any project feedback yet
          </h2>
          <Link href={"/dashboard/new-project"} className="mt-5">
            <Button>
              <Plus />
              Create your first project
            </Button>
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id}>
              <Link href={`/dashboard/project/${project.id}`}>
                <Card className="p-4 hover:bg-accent transition-colors">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.description || "No description"}
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
