import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../models/schema"
import dotenv from "dotenv"
dotenv.config()
// const client = new Client({
//   connectionString: "postgres://user:password@host:port/db",
// });
// or

export let client = new Client({
  host: process.env.HOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});


client.connect().then(()=>{
  console.log("Postgress Client is Connected Successfully")
  
}).catch((err:any)=>{
  console.log("Error connecting DB : ",err)
  
});

const postgresdb = drizzle(client,{schema:{...schema}});

export default postgresdb