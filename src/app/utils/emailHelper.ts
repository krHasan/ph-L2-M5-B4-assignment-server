/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import config from "../config";

const sendEmail = async (
    email: string,
    html: string,
    subject: string,
    attachment?: { filename: string; content: Buffer; encoding: string },
) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: config.sender_email,
                pass: config.sender_app_password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Email configuration
        const mailOptions: any = {
            from: '"Rentify" <kr.hasanbd@gmail.com>',
            to: email,
            subject,
            html,
        };

        if (attachment) {
            mailOptions.attachments = [
                {
                    filename: attachment.filename,
                    content: attachment.content,
                    encoding: attachment.encoding,
                },
            ];
        }

        // Sending the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};

export const EmailHelper = {
    sendEmail,
};
