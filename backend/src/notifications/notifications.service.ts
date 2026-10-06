// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { PrismaService } from '../database/prisma.service';
// import * as nodemailer from 'nodemailer';
// import { Twilio } from 'twilio';
// import { initializeApp, cert, getApps } from 'firebase-admin/app';
// import { getMessaging } from 'firebase-admin/messaging';

// @Injectable()
// export class NotificationsService {

//   private readonly logger = new Logger(
//     NotificationsService.name,
//   );

//   private mailTransporter: nodemailer.Transporter;

//   private twilioClient?: Twilio;


//   constructor(
//     private readonly prisma: PrismaService,
//   ) {


//     this.mailTransporter =
//       nodemailer.createTransport({

//         host:
//           process.env.SMTP_HOST ||
//           'smtp.mailtrap.io',

//         port:
//           Number(process.env.SMTP_PORT) ||
//           2525,

//         auth:{
//           user: process.env.SMTP_USER,
//           pass: process.env.SMTP_PASS,
//         },

//       });



//     if(
//       process.env.TWILIO_ACCOUNT_SID &&
//       process.env.TWILIO_AUTH_TOKEN
//     ){

//       this.twilioClient =
//         new Twilio(
//           process.env.TWILIO_ACCOUNT_SID,
//           process.env.TWILIO_AUTH_TOKEN,
//         );

//     }



//     if(
//       process.env.FIREBASE_CREDENTIALS_JSON
//     ){

//       try{

//         const credentials =
//           JSON.parse(
//             process.env.FIREBASE_CREDENTIALS_JSON,
//           );


//           if (!getApps().length){

//             initializeApp({
//               credential: cert(credentials),
//           });

//         }


//       }catch(error){

//         this.logger.error(
//           'Firebase initialization failed',
//         );

//       }

//     }

//   }





//   async sendNotification(

//     userId:string,

//     channels:
//       ('EMAIL'|'SMS'|'PUSH')[],

//     title:string,

//     message:string,

//   ){


//     const user =
//       await this.prisma.user.findUnique({

//         where:{
//           id:userId,
//         },

//       });



//     if(!user){
//       return;
//     }



//     const dispatches:
//       Promise<any>[] = [];



//     if(
//       channels.includes('EMAIL') &&
//       user.email
//     ){

//       dispatches.push(

//         this.mailTransporter.sendMail({

//           from:
//             '"Parish Office" <no-reply@parish.gov.rw>',

//           to:user.email,

//           subject:title,

//           text:message,

//         })

//         .catch(error=>{

//           this.logger.error(
//             `Email failed ${error.message}`,
//           );

//         })

//       );

//     }




//     if(
//       channels.includes('SMS') &&
//       user.phoneNumber &&
//       this.twilioClient
//     ){


//       dispatches.push(

//         this.twilioClient.messages.create({

//           body:
//             `${title}: ${message}`,

//           from:
//             process.env.TWILIO_PHONE_NUMBER,

//           to:
//             user.phoneNumber,

//         })

//         .catch(error=>{

//           this.logger.error(
//             `SMS failed ${error.message}`,
//           );

//         })

//       );


//     }





//     if(
//       channels.includes('PUSH') &&
//       user.fcmToken
//     ){


//       dispatches.push(

//         getMessaging().send({

//           token:user.fcmToken,

//           notification:{

//             title,

//             body:message,

//           },

//         })

//         .catch(error=>{

//           this.logger.error(
//             `Push failed ${error.message}`,
//           );

//         })

//       );


//     }




//     await Promise.all(dispatches);



//     await this.prisma.announcement.create({

//       data:{

//         title,

//         content:message,

//         branchId:
//           user.branchId,

//       },

//     });


//   }







//   @Cron(
//     CronExpression.EVERY_DAY_AT_9AM,
//   )
//   async handleBirthdayNotifications(){


//     this.logger.log(
//       'Birthday notification scan started',
//     );


//     /*
//       Schema yawe ntabwo ifite birthDate
//       kuri Member cyangwa User.
      
//       Iyo wongereye birthDate muri schema,
//       aha ni ho uzashyira query.
//     */


//   }







//   @Cron(
//     CronExpression.EVERY_DAY_AT_6PM,
//   )
//   async handleEventReminders(){


//     const tomorrow =
//       new Date();


//     tomorrow.setDate(
//       tomorrow.getDate()+1,
//     );



//     const events =
//       await this.prisma.event.findMany({

//         where:{

//           startDate:{

//             gte:
//               new Date(
//                 tomorrow.setHours(
//                   0,0,0,0,
//                 ),
//               ),

//             lte:
//               new Date(
//                 tomorrow.setHours(
//                   23,59,59,999,
//                 ),
//               ),

//           },

//         },


//         include:{

//           attendance:{

//             include:{

//               user:true,

//             },

//           },

//         },

//       });





//     for(
//       const event of events
//     ){

//       for(
//         const record of event.attendance
//       ){


//         await this.sendNotification(

//           record.userId,

//           [
//             'PUSH',
//             'EMAIL',
//           ],

//           `Reminder: ${event.title}`,

//           `
//           You have attendance for 
//           ${event.title}
//           scheduled on 
//           ${
//             event.startDate
//               ?
//               event.startDate.toLocaleString()
//               :
//               event.date.toLocaleString()
//           }
//           `,

//         );


//       }


//     }


//   }


// }
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationsService {
  findAll() {
    return [];
  }
}