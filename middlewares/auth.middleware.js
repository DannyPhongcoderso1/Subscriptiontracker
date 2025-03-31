import {JWT_SECRET} from "../config/env.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
//SO is making request get user details -> authorize middle -> if valid -> get user details
const authorize = async (req, res, next) => {
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];

        }

        if(!token) return res.status(401).json({message:'unauthorized'});

        const decoded = jwt.verify(token, JWT_SECRET);
        const user =  await User.findById(decoded.userId);

        if(!user) return res.status(401).json({message:'unauthorized'});

        req.user = user;

        next();

    }catch(error){
        res.status(401).send({message:'Unauthorized', error: error.message});
    }
}

export default authorize;