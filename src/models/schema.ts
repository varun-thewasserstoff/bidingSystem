import { serial,pgTable,varchar, integer,primaryKey,timestamp,boolean } from "drizzle-orm/pg-core";

export const autctionuser = pgTable("autctionuser",{
  id: serial("id").unique(),
  username: varchar("name"),
  email:varchar("email"),
  password:varchar("password").notNull(),
  role: varchar('role',{length:50}).default('user'),
  createdAt:timestamp("created_at").defaultNow()
},(table)=>({
   pk: primaryKey({ columns:[table.id] }),
}))

export const Auction = pgTable('auctions', {
  id: serial('id').primaryKey(),
  AdminId:integer("adminid"),
  itemName: varchar('item_name', {length:255}).notNull(),
  startTime: timestamp('start_time',{withTimezone:true}).notNull(),
  endTime: timestamp('end_time',{withTimezone:true}).notNull(),
  startPrice: integer('start_price').notNull(),
  winningUserId: integer('winning_user_id').references(()=> autctionuser.id),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

