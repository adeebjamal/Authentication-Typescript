import express, {Request, Response, Router} from "express";
import jwt from "jsonwebtoken";

const router: Router = express.Router();

// Importing user defined files and functions
import User from "../Models/Users";
import userInterface from "../Interfaces/userInterface";
import OTP_Generator from "../Functions/OTP_Generator";

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
        if(foundUser) {
            return res.status(400).render("homepage", {
                message: "User with emtered email already exists."
            });
        }
        const OTP: number = OTP_Generator();
        console.log(`This is the OTP ${OTP}`);
        const encodedJWT: string = jwt.sign({userDetails: req.body, otp: OTP}, "Secret-Key");
        res.cookie("userDetails_and_OTP", encodedJWT);
        // Need to send the OTP to the user via email
        return res.status(200).render("verify_otp", {
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

module.exports = router;