import { Elysia, t } from "elysia";
import { project, projectAnalytics, feedback } from "@/db/schema";
import { db } from "@/db";
import { session } from "@/lib/server";
import { and, eq, sql, count } from "drizzle-orm";

const ProjectModel = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Nullable(t.String()),
  url: t.Nullable(t.String()),
  type: t.String(),
  shareLink: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

const ProjectWithStatsModel = t.Composite([
  ProjectModel,
  t.Object({
    visits: t.Numeric(),
    feedbacksCount: t.Numeric(),
    uniqueVisitors: t.Numeric(),
  }),
]);

const app = new Elysia({ prefix: "/api" })
  .group("/public", (app) =>
    app.post(
      "/track/:shareLink",
      async ({ params, request, headers }) => {
        const { shareLink } = params;

        const targetProject = await db.query.project.findFirst({
          where: eq(project.shareLink, shareLink),
          columns: { id: true },
        });

        if (!targetProject) {
          return { status: "error", message: "Project not found" };
        }

        const userAgent = headers["user-agent"] || "unknown";
        const referrer = headers["referer"] || "direct";
        const ip = headers["x-forwarded-for"] || "unknown";

        const visitorHash = Bun.hash(ip + userAgent).toString();
        const isMobile = /mobile/i.test(userAgent) ? "mobile" : "desktop";

        await db.insert(projectAnalytics).values({
          projectId: targetProject.id,
          visitorHash,
          referrer,
          deviceType: isMobile,
        });

        return { status: "success" };
      },
      {
        params: t.Object({ shareLink: t.String() }),
      },
    ),
  )
  .group("/protected", (app) =>
    app
      .derive(async () => {
        const s = await session();
        return { user: s?.user };
      })
      .onBeforeHandle(({ set, user }) => {
        if (!user) {
          set.status = 401;
          return "Unauthorized";
        }
      })
      .get(
        "/project",
        async ({ user }) => {
          const projects = await db
            .select({
              id: project.id,
              name: project.name,
              description: project.description,
              url: project.url,
              type: project.type,
              shareLink: project.shareLink,
              createdAt: project.createdAt,
              updatedAt: project.updatedAt,
              visits:
                sql<number>`(select count(*) from ${projectAnalytics} where ${projectAnalytics.projectId} = ${project.id})`.mapWith(
                  Number,
                ),
              feedbacksCount:
                sql<number>`(select count(*) from ${feedback} where ${feedback.projectId} = ${project.id})`.mapWith(
                  Number,
                ),
            })
            .from(project)
            .where(eq(project.userId, user!.id));

          return projects.map((p) => ({ ...p, uniqueVisitors: 0 }));
        },
        {
          response: {
            200: t.Array(ProjectWithStatsModel),
            401: t.String(),
          },
        },
      )
      .get(
        "/project/:id",
        async ({ set, params, user }) => {
          const { id } = params;

          const existingProject = await db.query.project.findFirst({
            where: and(eq(project.userId, user!.id), eq(project.id, id)),
          });

          if (!existingProject) {
            set.status = 404;
            return "Project not found";
          }

          const [visitsCount, feedbackCountResult, uniqueCountResult] =
            await Promise.all([
              db
                .select({ count: count() })
                .from(projectAnalytics)
                .where(eq(projectAnalytics.projectId, id)),
              db
                .select({ count: count() })
                .from(feedback)
                .where(eq(feedback.projectId, id)),
              db
                .select({
                  count:
                    sql<number>`count(distinct ${projectAnalytics.visitorHash})`.mapWith(
                      Number,
                    ),
                })
                .from(projectAnalytics)
                .where(eq(projectAnalytics.projectId, id)),
            ]);

          return {
            ...existingProject,
            visits: Number(visitsCount[0].count),
            feedbacksCount: Number(feedbackCountResult[0].count),
            uniqueVisitors: Number(uniqueCountResult[0].count),
          };
        },
        {
          params: t.Object({ id: t.String() }),
          response: {
            200: ProjectWithStatsModel,
            404: t.String(),
            401: t.String(),
          },
        },
      )
      .post(
        "/project",
        async ({ body, user }) => {
          const { name, description, type, url } = body;

          const [newProject] = await db
            .insert(project)
            .values({
              name,
              description: description ?? null,
              type,
              url: url ?? null,
              userId: user!.id,
            })
            .returning();

          return {
            ...newProject,
            visits: 0,
            feedbacksCount: 0,
            uniqueVisitors: 0,
          };
        },
        {
          body: t.Object({
            name: t.String(),
            description: t.Optional(t.String()),
            type: t.Union([
              t.Literal("website"),
              t.Literal("graphic_design"),
              t.Literal("app"),
              t.Literal("other"),
            ]),
            url: t.Optional(t.String()),
          }),
          response: {
            200: ProjectWithStatsModel,
            401: t.String(),
          },
        },
      ),
  );

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;

export type App = typeof app;
