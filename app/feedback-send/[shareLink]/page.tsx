import NotFound from "@/app/not-found";
import NewFeedback from "@/components/new-feedback";
import { api } from "@/lib/api";
import { session } from "@/lib/server";
import { PROJECT_TYPES } from "@/utils/project-type";

export default async function FeedBackSend({
  params,
}: {
  params: { shareLink: string };
}) {
  const { shareLink } = await params;
  const user = await session();
  const { data, error } = await api.public.feedback({ shareLink }).get();

  if (user?.user.id === data?.userId) {
    return <strong>You can&apos;t send yourself a FeedBack</strong>;
  }

  if (!data || error) {
    return <NotFound />;
  }

  const typeConfig =
    PROJECT_TYPES[data.type as keyof typeof PROJECT_TYPES] ||
    PROJECT_TYPES.other;

  return (
    <div>
      <div className="my-10 font-sans flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary w-fit rounded-full text-sm font-medium">
            {typeConfig.icon}
            <span>{typeConfig.label}</span>
          </div>
          <h1 className="text-4xl font-bold font-heading mb-2">{data.name}</h1>
        </div>

        <div className="mb-10">
          {data.url && (
            <a
              href={data.url}
              className="text-primary hover:underline block mb-4"
              target="_blank"
            >
              {data.url}
            </a>
          )}

          {data.description && (
            <p className="text-muted-foreground whitespace-pre-wrap">
              {data.description}
            </p>
          )}
        </div>
      </div>
      <NewFeedback />
    </div>
  );
}
