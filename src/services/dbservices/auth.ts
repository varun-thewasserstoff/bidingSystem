import { bcryptPassword, validatePassword } from "../../config/bcrypt"
import postgresdb from "../../config/db"
import jwt from "jsonwebtoken";

import { autctionuser } from "../../models/schema"
import {and, desc, eq, inArray, sql,ne,asc} from "drizzle-orm";
const JWT_SECRET = 'varun132'

export class Auth{
  static register=async(details:any):Promise<any>=>{
    try{
      return await postgresdb.insert(autctionuser).values({
        username:details.username,
        email:details.email,
        password:await bcryptPassword(details.password),
        role:details.role
      }).returning({userId:autctionuser.id})  
    }catch(error){
      throw new Error(error)
    }
  }

  static login = async(username:string,password:string):Promise<any>=>{
    try{
      const user = await postgresdb.select().from(autctionuser).where(eq(autctionuser.username,username))
      if (user.length>0)
      {
        const hashPassword = await validatePassword(password,user[0].password)
        if(hashPassword==true){
          const token = jwt.sign(
            { username: user[0].username, role: user[0].role,id:user[0].id },
            JWT_SECRET, 
            { expiresIn: '1h' }
          )
          // console.log(token)
          return token;  
        }
        else{
          throw new Error('Invalid password');
        }
      }
      else{
        throw new Error('Invalid Username');
      }

    }catch(error){
      throw new Error(error)
    }
  }
}