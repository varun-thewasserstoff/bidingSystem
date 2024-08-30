import { bcryptPassword, validatePassword } from "../../config/bcrypt"
import postgresdb from "../../config/db"
import jwt from "jsonwebtoken";

import { Auction, autctionuser } from "../../models/schema"
import {and, desc, eq, inArray, sql,ne,asc} from "drizzle-orm";
import dbservices from ".";
import { SuiteContext } from "node:test";
const JWT_SECRET = 'varun132'

export class Admin{

  static convertToISO = (dateString: string, timeString: string) => {
    // Split the input date string
    const [day, month, year] = dateString.split('/');
    // Split the time string to ensure proper formatting
    const [hours, minutes, seconds] = timeString.split(':');
    // Construct the ISO 8601 date string with time
    const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    return isoDateString;
  }

 static convertToIst =  function convertUTCToIST(date) {
    // IST is UTC + 5:30
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds

    // Get the UTC time in milliseconds
    const utcTime = date.getTime();

    // Add the IST offset to get the time in IST
    const istTime = new Date(utcTime + IST_OFFSET);

    // Format the IST time
    return istTime.toISOString().replace('T', ' ').replace('Z', ' IST');
}

  static createAuction = async(details:any,adminId:number):Promise<any>=>{
    try{
    const auctions =  await postgresdb.insert(Auction).values({
      itemName:details.itemName,
      startPrice:details.startPrice,
      startTime:new Date(this.convertToISO(details.startDate,details.startTime)),
      endTime:new Date(this.convertToISO(details.endDate,details.endTime)),
      AdminId:adminId
    }).returning({itemName:Auction.itemName})
    return auctions;
    }catch(error){
      console.log(error)
      throw new Error(error)
    }
  }

  static getAllAuction = async(id:number):Promise<any>=>{
    try{
      const AllAuctions = await postgresdb.select().from(Auction).where(and(eq(Auction.AdminId,id),eq(Auction.isDeleted,false)))
      console.log(AllAuctions,"AllAuctions")
      if(AllAuctions.length == 0) throw new Error("Id Not found")
      return AllAuctions;
    }catch(error){
      throw new Error(error)
    }
  }

  static updateAuction = async(details:any,adminId:number,auctionId:number):Promise<any>=>{
    try{
      return await postgresdb.update(Auction).set({
        itemName:details.itemName,
        
      }).where(and(eq(Auction.AdminId,adminId),eq(Auction.id,auctionId))).returning({
        id: Auction.id,
        adminId:Auction.AdminId,
        itemName: Auction.itemName,
        startTime: Auction.startTime,
        endTime: Auction.endTime,
        startPrice: Auction.startPrice,
        winningUserId: Auction.winningUserId,
      })
    }catch(error){
      console.log("Error",error)
      throw new Error(error)
    }
  }


  static deleteAuction = async(adminId:number,auctionId:number):Promise<any>=>{
    try{
      const deletedData = await postgresdb.update(Auction).set({isDeleted:true}).where(and(eq(Auction.AdminId,adminId),eq(Auction.id,auctionId))).returning({id:Auction.id})
      if(!deletedData) throw new Error("AuctionId Not Found Or U are not owner of this Auction")
    }catch(error){
      console.log(error)
      throw new Error(error)
    }
  }

  static getUsers = async():Promise<any>=>{
    try{
      const getUsers = await postgresdb.select().from(autctionuser).where(eq(autctionuser.role,"user"))
      if(getUsers.length==0) throw new Error("No Users Found")
      return getUsers;
    }catch(error){
      console.log(error)
      throw new Error(error)
    }
  }
  
}