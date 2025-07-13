ALTER TABLE "rooms" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "owner_id" uuid;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;