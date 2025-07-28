import { ApiError } from "../utils/ApiError"
import { asynhandler } from "../utils/asynchandler"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model";
import { application } from "express";

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("authorization")?.replace("Bearer","")
    
        if(!token){
            throw new ApiError(401,"unauhtorized request")
        }
        const decodeToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        await User.findById(decodeToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"invalid access token")
        }
    
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }
})