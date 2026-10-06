import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

 async sendVerificationEmail(
    email:string,
    token:string
 ){

 const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
 });


 const url =
 `http://localhost:3000/verify-email?token=${token}`;


 await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: email,

    subject:'Verify your email',

    html:`
      <h2>Welcome to ConsolaCMS</h2>

      <p>
      Click the button below to verify your account.
      </p>

      <a href="${url}">
       Verify Email
      </a>
    `
 });

 }

}