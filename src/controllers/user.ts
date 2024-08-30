import postgresdb from "../config/db"
import { autctionuser } from "../models/schema"
import dbservices from "../services/dbservices"
import {and, desc, eq, inArray, sql,ne,asc} from "drizzle-orm";

import { Request,Response } from "express"

export class userController{
  static allAuctions = async(req:Request,res:Response)=>{
    try{
      const [role,userId] = [req["user"]["role"],req["user"]["id"]]
      if(role=="admin") res.status(400).json({message:"Uare admin for this route",status:false})
      const getData = await dbservices.UserAuction.getall()
      if(getData.length == 0) res.status(500).json({message:"faild to get data",status:false})
      res.status(200).json({message:"Get all Data",getData})
    }catch(error){
      res.status(500).json({message:error.message,status:false})
    }

  }

  static placeBid = async(req:Request,res:Response)=>{
    try{
      const userId = req["user"]['id']
      const auctionId = req.params.auctionId
      const {amount} = req.body
      const placeBid = await dbservices.UserAuction.placeBid(userId,parseInt(auctionId),parseInt(amount))
      res.status(200).json({message:"Bid Placed Successfully",status:true})
    }catch(error){
      res.status(500).json({message:error.message,status:false})
    }
  }

  static checkResult = async(req:Request,res:Response)=>{
    try{
      let auctionStatus = "On Going"
      if(req["user"]['role']=='admin') res.status(500).json({message:"u are Admin",status:false})
      const auctionId = req.params.auctionId
      const result =   await dbservices.UserAuction.checkStatus(parseInt(auctionId))
      if (new Date() > new Date(result.endTime)) auctionStatus = "Expires"
      if (new Date() < new Date(result.startTime))auctionStatus = "Upcoming"
      res.status(200).json({status:true,auctionStatus})
    }catch(error){
      res.status(500).json({message:error.message,status:false})
    }
  }

  static UserWinningAuction = async(req:Request,res:Response)=>{
    try{
      const [userId,role] = [req['user']['id'],req['user']['role']]
      if(role =='admin') res.status(500).json({message:"U are Not Authorized",status:false})
      const UserWinner = await dbservices.UserAuction.winner(userId)
      res.status(200).json({status:true})
    }catch(error){
      res.status(500).json({message:error.message,status:false})
    }
  }






}