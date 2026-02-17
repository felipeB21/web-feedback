import NotFound from "@/app/not-found";
import CopyLink from "@/components/dashboard/copy-link";
import { api } from "@/lib/api";
import { PROJECT_TYPES } from "@/utils/project-type";
import { Eye, Send } from "lucide-react";
import { cookies } from "next/headers";

export default async function ProjectIDPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const { data: project, error } = await api.protected.project({ id }).get({
    headers: {
      cookie: (await cookies()).toString(),
    },
  });

  if (error) {
    return <NotFound />;
  }

  if (!project) {
    return <NotFound />;
  }

  const typeConfig =
    PROJECT_TYPES[project.type as keyof typeof PROJECT_TYPES] ||
    PROJECT_TYPES.other;

  return (
    <div className="my-10 font-sans">
      <div className="flex items-center gap-5">
        <h1 className="text-4xl font-bold font-heading mb-2">{project.name}</h1>
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary w-fit rounded-full text-sm font-medium">
          {typeConfig.icon}
          <span>{typeConfig.label}</span>
        </div>
        <CopyLink shareLink={project.shareLink} />
      </div>

      <div className="font-medium text-muted-foreground text-sm flex items-center gap-10">
        <p className="flex items-center gap-1">
          <Eye className="w-4 h-4" /> Visits:{" "}
          <span className="text-black">{project.visits}</span>
        </p>
        <p className="flex items-center gap-1">
          <Send className="w-4 h-4" /> Total FeedBack&apos;s:{" "}
          <span className="text-black">{project.feedbacksCount}</span>
        </p>
      </div>

      <div className="my-10">
        {project.url && (
          <a
            href={project.url}
            className="text-primary hover:underline block mb-4"
            target="_blank"
          >
            {project.url}
          </a>
        )}

        {project.description && (
          <p className="text-muted-foreground whitespace-pre-wrap">
            {project.description}
          </p>
        )}
      </div>
    </div>
  );
}
