DO $$ BEGIN
 ALTER TABLE "auctions" ADD CONSTRAINT "auctions_winning_user_id_autctionuser_id_fk" FOREIGN KEY ("winning_user_id") REFERENCES "public"."autctionuser"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
