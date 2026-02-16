CREATE TABLE "project_analytics" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"visitor_hash" text,
	"referrer" text,
	"device_type" text,
	"country" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_analytics" ADD CONSTRAINT "project_analytics_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_projectId_idx" ON "project_analytics" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "analytics_createdAt_idx" ON "project_analytics" USING btree ("created_at");