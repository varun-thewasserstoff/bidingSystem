import postgresdb from "../config/db"
import { autctionuser } from "../models/schema"
import dbservices from "../services/dbservices"
import {and, desc, eq, inArray, sql,ne,asc} from "drizzle-orm";

import { Request,Response } from "express"

export class authController{
  static register=async(req:Request,res:Response)=>{
    try{
      console.log("hit")
      console.log(req.body)
      const details = req.body
      await dbservices.Auth.register(details)
      res.status(200).send({status:true,message:"User Registered Successfully"})
    }catch(error){
      res.status(500).send({status:false,message:error.message})
    }
  }

  static logIn = async(req:Request,res:Response)=>{
    try{
      const {username,password} = req.body
      const checkLogin=await dbservices.Auth.login(username,password)
      res.status(200).send({message:"Loged In",status:true,token:checkLogin})
    }catch(error){
      res.status(500).send({status:false,message:error.message})
    }
  }

  static check = async(req:Request,res:Response)=>{
    try{
      console.log(req["user"]["id"])
      res.status(200).send({message:"all well",status:true})
    }catch(error){
      res.status(500).json({status:false,message:error.message})
    }
  }
}