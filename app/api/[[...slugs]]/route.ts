import { Elysia, t } from "elysia";
import { project } from "@/db/schema";
import { db } from "@/db";
import { session } from "@/lib/server";
import { eq } from "drizzle-orm";

const app = new Elysia({ prefix: "/api" })
  .get(
    "/project",
    async ({ set }) => {
      const user = await session().then((s) => s?.user);

      if (!user) {
        set.status = 401;
        return "Unauthorized";
      }

      const projects = await db
        .select()
        .from(project)
        .where(eq(project.userId, user.id));

      return projects;
    },
    {
      response: {
        200: t.Array(
          t.Object({
            id: t.String(),
            name: t.String(),
            description: t.Nullable(t.String()),
            url: t.Nullable(t.String()),
            type: t.String(),
            createdAt: t.Date(),
            updatedAt: t.Date(),
          }),
        ),
        401: t.String(),
      },
    },
  )
  .post(
    "/project",
    async ({ set, body }) => {
      const user = await session().then((s) => s?.user);

      if (!user) {
        set.status = 401;
        return "Unauthorized";
      }

      const { name, description, type, url } = body;

      const [newProject] = await db
        .insert(project)
        .values({
          name,
          description: description ?? null,
          type,
          url: url ?? null,
          userId: user.id,
        })
        .returning();

      return newProject;
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
        200: t.Object({
          id: t.String(),
          name: t.String(),
          description: t.Nullable(t.String()),
          url: t.Nullable(t.String()),
          type: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        }),
        401: t.String(),
      },
    },
  );

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;

export type App = typeof app;
