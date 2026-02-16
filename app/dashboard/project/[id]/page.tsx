import { api } from "@/lib/api";
import { cookies } from "next/headers";

export default async function ProjectIDPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const { data: projects, error } = await api.project.get({
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  if (error) {
    return <div>Error loading projects</div>;
  }

  const projectId = projects?.find((p) => p.id === id);

  if (!projectId) {
    return <p>Project Not Found</p>;
  }

  return (
    <div className="my-10 font-sans">
      <h1 className="text-4xl font-bold font-heading">{projectId.name}</h1>
    </div>
  );
}
