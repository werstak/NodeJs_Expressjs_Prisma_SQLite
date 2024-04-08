import process from 'process';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();


export function emailService(user: any, jti: any) {
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
    return jwt.sign({
        userId: user.id,
        jti
    }, refreshSecret, {
        expiresIn: '30d',
        // expiresIn: '5h',
    });
}



export class EmailService {
    private static transporter: nodemailer.Transporter;
    private static env = {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    };

    public static initialize() {
        try {
            EmailService.transporter = nodemailer.createTransport({
                service: process.env.SERVICE,
                host: process.env.HOST,
                port: 456,
                secure: false,
                auth: {
                    user: this.env.user,
                    pass: this.env.pass,
                },
            });
        } catch (error) {
            console.error('Error initializing email service');
            throw error;
        }
    }
}





const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: 456,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;




// import nodemailer from 'nodemailer';
// import config from 'config';
// import pug from 'pug';
// import { convert } from 'html-to-text';
// import { Prisma } from '@prisma/client';
//
// const smtp = config.get<{
//     host: string;
//     port: number;
//     user: string;
//     pass: string;
// }>('smtp');
//
// export default class Email {
//     #firstName: string;
//     #to: string;
//     #from: string;
//     constructor(private user: Prisma.UserCreateInput, private url: string) {
//         this.#firstName = user.name.split(' ')[0];
//         this.#to = user.email;
//         this.#from = `Codevo <admin@admin.com>`;
//     }
//
//     private newTransport() {
//         // if (process.env.NODE_ENV === 'production') {
//         // }
//
//         return nodemailer.createTransport({
//             ...smtp,
//             auth: {
//                 user: smtp.user,
//                 pass: smtp.pass,
//             },
//         });
//     }
//
//     private async send(template: string, subject: string) {
//         // Generate HTML template based on the template string
//         const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
//             firstName: this.#firstName,
//             subject,
//             url: this.url,
//         });
//         // Create mailOptions
//         const mailOptions = {
//             from: this.#from,
//             to: this.#to,
//             subject,
//             text: convert(html),
//             html,
//         };
//
//         // Send email
//         const info = await this.newTransport().sendMail(mailOptions);
//         console.log(nodemailer.getTestMessageUrl(info));
//     }
//
//     async sendVerificationCode() {
//         await this.send('verificationCode', 'Your account verification code');
//     }
//
//     async sendPasswordResetToken() {
//         await this.send(
//             'resetPassword',
//             'Your password reset token (valid for only 10 minutes)'
//         );
//     }
// }
