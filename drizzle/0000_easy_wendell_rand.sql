CREATE TABLE IF NOT EXISTS "auctions" (
	"id" serial PRIMARY KEY NOT NULL,
	"adminid" integer,
	"item_name" varchar(255) NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"start_price" integer NOT NULL,
	"winning_user_id" integer,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "autctionuser" (
	"id" serial NOT NULL,
	"name" varchar,
	"email" varchar,
	"password" varchar NOT NULL,
	"role" varchar(50) DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "autctionuser_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "autctionuser_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auctions" ADD CONSTRAINT "auctions_adminid_autctionuser_id_fk" FOREIGN KEY ("adminid") REFERENCES "public"."autctionuser"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
