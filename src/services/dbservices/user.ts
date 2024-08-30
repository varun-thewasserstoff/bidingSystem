import { bcryptPassword, validatePassword } from "../../config/bcrypt"
import postgresdb from "../../config/db"
import jwt from "jsonwebtoken";

import { Auction, autctionuser } from "../../models/schema"
import {and, desc, eq, inArray, sql,ne,asc} from "drizzle-orm";
import { date } from "drizzle-orm/mysql-core";
const JWT_SECRET = 'varun132'

export class UserAuction{
  static getall = async():Promise<any>=>{
    try{
      // const getAllData = await postgresdb.query.Auction.findMany({
      //   where:(Auction)=> eq(Auction.isDeleted,true),
      //   columns:{
      //     itemName:true,
      //     startTime:true,
      //     endTime:true,
      //     startPrice:true
      //   },
      //   with:{
      //     autctionuser:{
      //       columns:{
      //         name:true,
      //         email:true
      //       }
      //     }
      //   }
      // })
      // return getAllData;
      const getAllData = await postgresdb.select().from(Auction).where(eq(Auction.isDeleted,false))
      return getAllData
    }catch(error){
      console.log(error)
      throw new Error(error)
    }
  }

  static placeBid = async(userId:number,AuctionId:number,amount:number):Promise<any>=>{
    try{
      console.log(userId,AuctionId)
      const auctionExist = await postgresdb.select().from(Auction).where(and(eq(Auction.isDeleted,false),eq(Auction.id,AuctionId)))
      console.log(auctionExist,":auctionExist")
      if(auctionExist.length==0) throw new Error("Auction Doesnt Exist")
      if(new Date() > new Date(auctionExist[0].endTime)) throw new Error("Auction Has Ended")  
      if(auctionExist[0].startPrice > amount) throw new Error("Bid amount too low")
      else{
       await postgresdb.update(Auction).set({ startPrice:amount,winningUserId:userId }).where(eq(Auction.id,AuctionId))
    }  
    }catch(error){
      // console.log(error)
      throw new Error(error)
    }
  }

  static checkStatus = async(auctionId:number):Promise<any>=>{
    try{
      const auction = await postgresdb.select().from(Auction).where(eq(Auction.id,auctionId))
      if(auction.length == 0) throw new Error("Auction Id Not Found")
      return auction[0]   
    }catch(error){
      throw new Error(error)
    }
  }

  static winner = async(userId:number):Promise<any>=>{
    try{
      const results = await postgresdb
      .select({
        id: Auction.id,
        itemName: Auction.itemName,
        startTime: Auction.startTime,
        endTime: Auction.endTime,
        startPrice: Auction.startPrice,
        winningUserId: Auction.winningUserId,
        isDeleted: Auction.isDeleted,
        username: autctionuser.username
      })
      .from(Auction).leftJoin(autctionuser,eq(Auction.winningUserId, autctionuser.id))
      .where(eq(Auction.isDeleted, false)) 
      .execute()
      console.log(results)
    }catch(error){
      console.log(error)
      throw new Error(error)
    }
  }
 
}