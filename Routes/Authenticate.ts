import express, {Request, Response, Router} from "express";
import jwt from "jsonwebtoken";
import md5 from "md5";

const router: Router = express.Router();

// Importing user defined files and functions
import User from "../Models/Users";
import userInterface from "../Interfaces/userInterface";
import OTP_Generator from "../Functions/OTP_Generator";
import Send_OTP from "../Functions/Send_OTP";
import decoded_JWT from "../Interfaces/JWT";

router.post("/register", async(req: Request, res: Response) => {
    try {
        console.log(req.body);
        if(!req.body.newName || !req.body.newEmail || !req.body.newPassword || !req.body.confirmpassword) {
            return res.status(400).render("homepage", {
                message: "Please fill all the required fields"
            });
        }
        if(req.body.newpassword !== req.body.confirmPassword) {
            return res.status(400).render("homepage", {
                message: "Passwords doesn't match."
            });
        }
        if(req.body.newPassword.length < 6) {
            return res.status(400).render("homepage", {
                message: "Password is too weak."
            });
        }
        const foundUser: userInterface | null = await User.findOne({email: req.body.newEmail});
        if(!foundUser) {
            return res.status(400).render("homepage", {
                message: "User with emtered email already exists."
            });
        }
        const OTP: number = OTP_Generator();
        console.log(`This is the OTP ${OTP}`);
        const encodedJWT: string = jwt.sign({userDetails: req.body, otp: OTP}, "Secret-Key");
        res.cookie("userDetails_and_OTP", encodedJWT);
        // Need to send the OTP to the user via email
        Send_OTP(req.body.userEmail, OTP);
        return res.status(200).render("Verify_OTP", {
            message: ""
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).render("homepage", {
            message: "Internal Server Error."
        });
    }
});

router.post("/OTP", async(req: Request, res: Response) => {
    try {
        if(!req.cookies.userDetails_and_OTP) {
            return res.status(401).json({message: "Somethng went wrong."});
        }
        const decodedJWT: decoded_JWT = jwt.verify(req.cookies.userDetails_and_OTP, "Secret-Key");
        if(req.body.otp == decodedJWT.otp) {
            const createdUser = new User({
                name: decodedJWT.userDetails.newName,
                email: decodedJWT.userDetails.newEmail,
                password: md5(decodedJWT.userDetails.newPassword)
            });
            await createdUser.save();
            res.clearCookie("userDetails_and_OTP");
            return res.status(201).render("homepage", {
                message: "Registration successful. You can login now."
            });
        }
        return res.status(401).render("Verify_OTP", {
            message: "Incorrect OTP"
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).render("homepage", {
            message: "Internal server error"
        });
    }
});

router.post("/login", async(req: Request, res: Response) => {
    try {
        if(!req.body.userEmail || !req.body.userPassword) {
            return res.status(401).render("homepage", {
                message: "Please fill all the required fields."
            });
        }
        const foundUser: userInterface | null = await User.findOne({email: req.body.userEmail});
        if(!foundUser) {
            return res.status(400).render("homepage", {
                message: "User with entered email doesn't exists."
            });
        }
        if(foundUser.password !== md5(req.body.userPassword)) {
            return res.status(400).render("homepage", {
                message: "Incorrect password"
            });
        }
        const jwtToken: string = jwt.sign({ID: foundUser._id}, "Secret-Key");
        res.cookie("loggedin_user", jwtToken);
        return res.status(200).render("dashboard");
    }
    catch(error) {
        console.log(error);
        return res.status(500).render("homepage", {
            message: "Internal serve error."
        });
    }
});

module.exports = router;