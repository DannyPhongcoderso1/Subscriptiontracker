import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

import {EMAIL_PASSWORDS} from "./env.js";

export const accountEmail = 'dannyphong2407@gmail.com';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dannyphong2407@gmail.com',
        pass: process.env.EMAIL_PASSWORDS
    }
})

export default transporter;