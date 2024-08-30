import postgresdb from "../config/db"
import { autctionuser } from "../models/schema"
import dbservices from "../services/dbservices"
import {and, desc, eq, inArray, sql,ne,asc} from "drizzle-orm";

import { Request,Response } from "express"

export class adminController{
  static createAuction = async(req:Request,res:Response)=>{
    try{
      const role = req["user"]["role"]
      // console.log(role,"Role")
      const adminId = req["user"]["id"]
      if(role=='user') res.status(500).send({status:false,message:"U cant Create Auction as a User"})
      const details = req.body
      // console.log(details,"details")
      const createAuction = await dbservices.Admin.createAuction(details,adminId)
      // console.log(createAuction)
      res.status(200).json({status:true,message:"Auction Created"})
    }catch(error){
      res.status(500).json({status:false,message:error.message})
    }
  }


  static getAllAuctions = async(req:Request,res:Response)=>{
    try{
      const userId = req["user"]["id"]
      const getAllData = await dbservices.Admin.getAllAuction(userId)
      res.status(200).json({message:"Get Data",status:true,getAllData})
    }catch(error){
      res.status(500).json({message:error.message,status:false})
    }
  }

  static updateAuction = async(req:Request,res:Response)=>{
    try{
      const adminId = req["user"]["id"];
      const auctionId = req.params.auctionId;
      const details = req.body
      if (req["user"]["role"]=='user') res.status(500).json({message:"No access for the user",status:false})
      const updatedData = await dbservices.Admin.updateAuction(details,adminId,parseInt(auctionId))
      res.status(200).json({message:"Successfully Updated",status:true,updatedData:updatedData[0]})
    }catch(error){
      res.status(500).json({status:false,message:error.message})
    }
  }
  static deleteAuction = async(req:Request,res:Response)=>{
    try{
      const [role,adminId] = [req["user"]["role"],req["user"]["id"]]
      if(role == 'user') res.status(400).json({status:false,message:"As user u cant delete auction"})
      const auctionId = req.params.auctionId
      await dbservices.Admin.deleteAuction(adminId,parseInt(auctionId))
      res.status(200).json({status:true,message:"Gets Deleted"})
    }catch(error){
      res.status(500).json({message:error.message,status:false})
    }
  }

  static getUsers = async(req:Request,res:Response)=>{
    try{
      const role = req["user"]["role"]
      console.log(role)
      if(role=="user") res.status(404).json({message:"U are unable to access all Users"})
      const getUsers = await dbservices.Admin.getUsers() 
      res.status(200).json({message:"Get Data",status:true,getUsers})
    }catch(error){
      res.status(500).json({message:error.message,status:false})
    }
  }

  



}