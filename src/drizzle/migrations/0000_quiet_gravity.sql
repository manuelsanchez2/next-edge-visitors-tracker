CREATE TABLE "visitors" (
	"session_id" uuid PRIMARY KEY NOT NULL,
	"last_active" timestamp with time zone DEFAULT now() NOT NULL,
	"target_domain" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "visitors_last_active_index" ON "visitors" USING btree ("last_active");--> statement-breakpoint
CREATE INDEX "visitors_target_domain_index" ON "visitors" USING btree ("target_domain");