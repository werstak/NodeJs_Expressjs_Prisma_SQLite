import process from 'process';
import * as nodemailer from 'nodemailer';

export async function handlerEmailSending(existingUser: any, email: string, subject: any, htmlContent: any, text: any) {

    // To resolve - error "self-signed certificate in certificate chain"
    // This line of code needs to be added
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    // Or this object
    // tls: {
    //     rejectUnauthorized: false
    // }

    try {
        const transporter = await nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: 465,
            secure: true,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const infoSendMail = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html: htmlContent,
            // text: text
        });
        console.log('Message sent: %s', infoSendMail);
    } catch (error) {
        console.error('Error sending email: ', error);
    }


    // const transporter = nodemailer.createTransport({
    //     host: process.env.HOST,
    //     service: process.env.SERVICE,
    //     port: 465,
    //     secure: true,
    //     tls: {
    //         rejectUnauthorized: false
    //     },
    //     auth: {
    //         user: process.env.MAIL_USER,
    //         pass: process.env.MAIL_PASSWORD,
    //     },
    // });
    //
    // return transporter.sendMail({
    //     from: process.env.MAIL_USER,
    //     to: email,
    //     subject: subject,
    //     html: htmlContent,
    //     // text: text
    // });
}
