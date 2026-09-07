import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,    // use env variables for security
        pass: process.env.EMAIL_PASS,
    },
});




export const sendRegisterOtpEmail = (email, otp) => {
    const mailOptions = {
        from: 'somkenemuscle@gmail.com',
        to: email,
        subject: 'Your Registration OTP',
        text: `Hello! Your OTP for registration is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('❌ Error sending registration otp email:', err);
        } else {
            console.log('✅ Registration Otp Email sent:', info.response);
        }
    });
};