import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "ab97e09e1cbd7b",
        pass: process.env.MAILTRAP_PASSWORD,
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;

    await transporter.sendMail({
        from: "E-Commerce „<noreply@e-commerce.com>",
        to: email,
        subject: "Verification email",
        html: `
            <h2>Welcome in E-commerce!</h2>
            <a href="${verificationUrl}">Confirm</a>
            <
        `,
    })
}