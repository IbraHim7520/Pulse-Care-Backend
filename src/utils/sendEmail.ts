import nodemailer from 'nodemailer'
import AppError from '../shared/AppError'
import status from 'http-status'
import path from 'path'
import ejs from  'ejs'
import env from '../configs/env'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SENDER_SMTP_HOST,
    secure:true,
    auth:{
        user: process.env.EMAIL_SENDER_SMTP_USER,
        pass: process.env.EMAIL_SENDER_SMTP_PASS,
    },
    port: Number(process.env.EMAIL_SENDER_SMTP_PORT as string)
})

interface sendMailOption {
    to: string,
    subject:string,
    templateName:string,
    templateData : Record<string , any>,
    attachment?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail = async(emailTemplate: sendMailOption)=>{
    const {to , subject , templateName , templateData, attachment} = emailTemplate;
    
    try {
        const templatePath = path.resolve(process.cwd(), `src/Templates/${templateName}.ejs`)
    
        const htmlFile = await ejs.renderFile(templatePath , templateData)

        const info = await transporter.sendMail({
            from: process.env.EMAIL_SENDER_SMTP_FROM,
            to: to,
            subject:subject,
            html: htmlFile,
            attachments : attachment?.map( (att)=>({
                filename: att.filename,
                content: att.content,
                contentType: att.contentType
            }) )
        })
        if(env.NODE_ENV === 'development') {
            console.log(info)
        }
         console.log(`Email sent to ${to} : ${info.messageId}`);
    } catch (error) {
        console.log("Error Sending Error: ", error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email!!");
    }
}