import nodeMailer from "nodemailer";

// These credentials will be used to send OTP from the server to the user.
const senderEmail: string = "dummy@email.com", password: string = "dummypassword";

const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: senderEmail,
        pass: password
    }
});

export default async(email: string, OTP: number): Promise<void> => {
    const mailOptions: object = {
        from: {
            name: "Dummy name",
            address: senderEmail
        },
        to: [email],
        subject: "OTP for email verification",
        text: "This is the OTP you can use for verification.",
        html: `<h1>OTP: ${OTP}</h1>`
    }
    try {
        transporter.sendMail(mailOptions);      // There is an error here
        console.log("Email sent.");
    }
    catch(error) {
        console.log("Something went wrong while sending the email.");
    }
}