import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const projectTypeEnum = pgEnum("project_type", [
  "website",
  "graphic_design",
  "app",
  "other",
]);

export const feedbackRoleEnum = pgEnum("feedback_role", [
  "developer",
  "designer",
  "manager",
  "other",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const project = pgTable(
  "project",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    description: text("description"),
    type: projectTypeEnum("type").default("website").notNull(),
    url: text("url"), // URL opcional si es de tipo 'website'
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    shareLink: text("share_link")
      .notNull()
      .unique()
      .$defaultFn(() => nanoid()),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("project_userId_idx").on(table.userId),
    index("project_shareLink_idx").on(table.shareLink),
  ],
);

export const feedback = pgTable(
  "feedback",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userName: text("user_name").notNull(), // Nombre de quien da el feedback
    role: feedbackRoleEnum("role").default("other").notNull(),
    content: text("content").notNull(), // El texto largo del feedback
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("feedback_projectId_idx").on(table.projectId)],
);

export const projectAnalytics = pgTable(
  "project_analytics",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    // Hash anónimo del visitante para contar únicos sin guardar datos sensibles
    visitorHash: text("visitor_hash"),
    referrer: text("referrer"), // De dónde vienen (google, twitter, directo)
    deviceType: text("device_type"), // desktop, mobile, etc.
    country: text("country"), // Opcional (si usas Vercel headers o similar)
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("analytics_projectId_idx").on(table.projectId),
    index("analytics_createdAt_idx").on(table.createdAt), // Útil para gráficas por fecha
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  projects: many(project),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
  feedbacks: many(feedback),
  analytics: many(projectAnalytics), // <-- Nueva relación
}));

export const analyticsRelations = relations(projectAnalytics, ({ one }) => ({
  project: one(project, {
    fields: [projectAnalytics.projectId],
    references: [project.id],
  }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  project: one(project, {
    fields: [feedback.projectId],
    references: [project.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
